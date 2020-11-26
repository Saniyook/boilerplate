import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';
import { ComponentsObject, PathsObject, ServerObject } from 'openapi3-ts';

export const getOpenApiSpec = (
  pathSpec: PathsObject,
  components: ComponentsObject,
  serverURL: string
): OpenAPIV3.Document =>
  ({
    openapi: process.env.OPEN_API_VERSION || '3.0.3',
    info: {
      title: process.env.OPEN_API_INFO_TITLE || 'Title',
      version: process.env.OPEN_API_INFO_VERSION || '1.0.0',
    },
    servers: [
      {
        url: serverURL,
      },
    ],
    paths: pathSpec,
    components: components,
  } as OpenAPIV3.Document);
