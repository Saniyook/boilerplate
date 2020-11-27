import 'reflect-metadata';
import { RestEndpoint } from '@loopback/openapi-v3';
import { OPENAPI_V3_METHODS_KEY } from '../const/loopbackMetaKeys';

export interface ControllerMethodsMeta {
  [propName: string]: RestEndpoint;
}

export const getOperationDescription = (
  controller: new (...args: any[]) => any,
  propName: string
) => {
  const meta = Reflect.getOwnMetadata(
    OPENAPI_V3_METHODS_KEY,
    controller.prototype
  ) as ControllerMethodsMeta;
  return meta?.[propName]?.spec?.description ?? '';
};
