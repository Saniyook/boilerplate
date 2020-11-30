import { ResponseDecoratorMetadata } from '@loopback/openapi-v3';
import { LoopbackMetadataKeys } from '../const/LoopbackMetadataKeys';
import 'reflect-metadata';

export type ControllerResponseMetaT = {
  [propertyName: string]: ResponseDecoratorMetadata;
};

export const getControllerResponseMeta = (
  controller: new (...args: any) => any
): ControllerResponseMetaT => {
  return Reflect.getOwnMetadata(
    LoopbackMetadataKeys.OPENAPI_V3_METHODS_RESPONSE_KEY,
    controller.prototype
  );
};
