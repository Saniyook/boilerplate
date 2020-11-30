import 'reflect-metadata';
import { ExpressMetadataKeys } from '../const/ExpressMetadataKeys';

export const requestObject = (): ParameterDecorator => {
  return (target: any, propKey: string | symbol, index: number) => {
    Reflect.defineMetadata(
      ExpressMetadataKeys.REQUEST_OBJECT,
      index,
      target[propKey]
    );
  };
};
