import fs from 'fs';
import path from 'path';
import {
  ComponentsObject,
  getControllerSpec,
  OperationObject,
  ParameterObject,
  SchemaObject,
} from '@loopback/openapi-v3';
import express, { IRouterMatcher, Request, Response } from 'express';
import { middleware as createOpenApiMiddleware } from 'express-openapi-validator';
import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';
import http from 'http';
import swaggerUi from 'swagger-ui-express';
import { getApiServerURL } from './heplers/getApiServerURL';
import { getOpenApiSpec } from './heplers/getOpenApiSpec';
import { openApiPathToExpress } from './heplers/openApiPathToExpress';
import { ExpressHttpVerbsType } from './types/http';
import { merge } from 'lodash';
import { getControllerResponseMeta } from './heplers/getControllerResponseMeta';
import bodyParser from 'body-parser';
import { getOperationDescription } from './heplers/getOperationDescription';
import { getInjectedParams } from './heplers/getInjectedParams';
import YML from 'json-to-pretty-yaml';
import { LoopbackOpenApiSpecMetaKeys } from './const/LoopbackMetadataKeys';

export interface ApplicationParams {
  proto: string;
  host: string;
  port: number;
  apiPath: string;
  apiVersion: string;
  docsPath: string;
}

// TODO config module
const DEFAULT_PARAMS: ApplicationParams = {
  proto: process.env.API_PROTO || 'http',
  host: process.env.API_HOST || 'localhost',
  port: Number(process.env.API_PORT) || 8000,
  apiPath: process.env.API_PATH || 'api',
  apiVersion: process.env.API_VERISON || 'v1',
  docsPath: process.env.API_DOCS_PATH || 'api-docs',
};

export default class Application {
  app = express();
  private _pathsSpec: OpenAPIV3.PathsObject = {};
  private _components: ComponentsObject = {};
  private _params: ApplicationParams = DEFAULT_PARAMS;
  private _apiPrefix!: string;
  private _apiRouter = express.Router();
  private _apiSpec: OpenAPIV3.Document = {} as OpenAPIV3.Document;
  private _authStrategies: Map<string, IRouterMatcher<void>> = new Map();

  constructor(params?: Partial<ApplicationParams>) {
    this._params = { ...this._params, ...params };
    this._apiPrefix = `/${this._params.apiPath}/${this._params.apiVersion}`;
  }

  controller(controller: new (...args: any[]) => any) {
    const { paths, basePath = '', components } = getControllerSpec(controller);
    const responses = getControllerResponseMeta(controller);

    const routes = Reflect.ownKeys(paths) as string[];

    routes.forEach((path) => {
      const pathWithBaseControllerPath = `${basePath}${path}`;
      const verbs = Reflect.ownKeys(paths[path]) as ExpressHttpVerbsType[];

      verbs.forEach((verb) => {
        const operation = paths[path][verb] as OperationObject;
        const expressPath = openApiPathToExpress(pathWithBaseControllerPath);
        const {
          [LoopbackOpenApiSpecMetaKeys.PROPERTY_NAME]: propName,
          parameters,
        } = operation;
        const responsesSpec = responses?.[propName];
        const operationDescription = getOperationDescription(
          controller,
          propName
        );
        paths[path][verb].description = operationDescription;
        const injectedParams = getInjectedParams(controller, propName);
        const instance = new controller();

        const authHandler = this._authStrategies.get('jwt');

        this._apiRouter[verb](expressPath, async (req, res) => {
          let params = this.getArgumentsFromRequest(
            req,
            parameters as ParameterObject[]
          );

          const arrayWithIndexedArgs: any[] = new Array(
            ...Array(instance[propName].length)
          );

          if (operation.requestBody) {
            const index =
              operation.requestBody[
                LoopbackOpenApiSpecMetaKeys.PARAMETER_INDEX
              ];
            arrayWithIndexedArgs.splice(index, 1, req.body);
          }

          if (Number.isInteger(injectedParams.requestObjectIndex)) {
            const index = injectedParams.requestObjectIndex;
            arrayWithIndexedArgs.splice(index, 1, req);
          }

          if (Number.isInteger(injectedParams.responseObjectIndex)) {
            const index = injectedParams.responseObjectIndex;
            arrayWithIndexedArgs.splice(index, 1, res);
          }

          const args = arrayWithIndexedArgs.map((argument) => {
            return argument || params.shift();
          });

          const result = await instance[propName](...args);
          const code = responsesSpec.find((spec) => {
            return result instanceof (spec.responseModelOrSpec as Function);
          })?.responseCode;

          if (!res.writableEnded) {
            return res.status(code || 500).json(result);
          }
        });
      });

      this._pathsSpec[pathWithBaseControllerPath] = paths[
        path
      ] as OpenAPIV3.PathItemObject;
      this._components = merge(this._components, components);
    });
  }

  secure(strategyName: string, handler: IRouterMatcher<void>) {
    this._authStrategies.set(strategyName, handler);
  }

  protected getArgumentsFromRequest(
    req: Request,
    params: ParameterObject[] = []
  ) {
    const args = params.map((parameter) => {
      let p: any;
      switch (parameter.in) {
        case 'path':
          p = req.params[parameter.name];
          break;
        case 'query':
          p = req.query[parameter.name];
          break;
        case 'header':
          p = req.headers[parameter.name];
          break;
        case 'cookie':
          p = req.cookies[parameter.name];
          break;
        default:
          p = undefined;
      }

      return this._convertParams(parameter.schema as SchemaObject, p);
    });

    return args;
  }

  private _convertParams(schema: SchemaObject, parameter: any) {
    if (parameter === undefined) {
      return parameter;
    }

    if (schema.type === 'string') {
      return String(parameter);
    }

    if (schema.type === 'integer' || schema.type === 'number') {
      return Number(parameter);
    }

    if (schema.type === 'boolean') {
      return Boolean(parameter);
    }

    if (schema.type === 'array') {
      return parameter.map((p: any) =>
        this._convertParams(schema.items as SchemaObject, p)
      );
    }

    return parameter;
  }

  private _init() {
    const { proto, host, port, apiPath, apiVersion, docsPath } = this._params;
    this._apiSpec = getOpenApiSpec(
      this._pathsSpec,
      this._components,
      getApiServerURL(proto, host, port, apiPath, apiVersion)
    );

    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
    this.app.use(`/${docsPath}`, swaggerUi.serve);
    this.app.get(`/${docsPath}`, swaggerUi.setup(this._apiSpec));
    this.app.use(
      createOpenApiMiddleware({
        apiSpec: this._apiSpec,
        validateResponses: true,
        validateRequests: true,
      })
    );
    this.app.use(this._apiPrefix, this._apiRouter);
    this.app.use((err: any, req: Request, res: Response, next: Function) => {
      if (!res.writableEnded) {
        res.status(err.status || 500).json({
          message: err.message,
          errors: err.errors,
        });
      }
    });
  }

  async start() {
    this._init();

    return new Promise((res, rej) => {
      http.createServer(this.app).listen(this._params.port, () => {
        const { proto, host, port, docsPath } = this._params;
        console.log('Server started at port ' + this._params.port);
        console.log(
          `See docs at ${getApiServerURL(proto, host, port, docsPath)}`
        );

        const yml = YML.stringify(this._apiSpec);

        fs.writeFile(path.resolve(__dirname, '../api.yml'), yml, (err) => {
          if (err) {
            rej(err);
            return console.log({ err });
          }

          res();
        });
      });
    });
  }
}
