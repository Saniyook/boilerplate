import 'reflect-metadata';
import { ExpressMetadataKeys } from '../const/ExpressMetadataKeys';

export const getInjectedParams = (
  controller: new (...args: any[]) => any,
  propName: string
) => {
  const requestObjectIndex = Reflect.getOwnMetadata(
    ExpressMetadataKeys.REQUEST_OBJECT,
    controller.prototype[propName]
  );

  const responseObjectIndex = Reflect.getOwnMetadata(
    ExpressMetadataKeys.RESPONSE_OBJECT,
    controller.prototype[propName]
  );

  return {
    requestObjectIndex,
    responseObjectIndex,
  };
};
