import 'reflect-metadata';
import {
  EXPRESS_REQUEST_OBJECT,
  EXPRESS_RESPONSE_OBJECT,
} from '../const/metaKeys';

export const getInjectedParams = (
  controller: new (...args: any[]) => any,
  propName: string
) => {
  const requestObjectIndex = Reflect.getOwnMetadata(
    EXPRESS_REQUEST_OBJECT,
    controller.prototype[propName]
  );

  const responseObjectIndex = Reflect.getOwnMetadata(
    EXPRESS_RESPONSE_OBJECT,
    controller.prototype[propName]
  );

  return {
    requestObjectIndex,
    responseObjectIndex,
  };
};
