import 'reflect-metadata';
import { RestEndpoint } from '@loopback/openapi-v3';
import { LoopbackMetadataKeys } from '../const/LoopbackMetadataKeys';

export interface ControllerMethodsMeta {
  [propName: string]: RestEndpoint;
}

export const getOperationDescription = (
  controller: new (...args: any[]) => any,
  propName: string
) => {
  const meta = Reflect.getOwnMetadata(
    LoopbackMetadataKeys.OPENAPI_V3_METHODS_KEY,
    controller.prototype
  ) as ControllerMethodsMeta;
  return meta?.[propName]?.spec?.description ?? '';
};
