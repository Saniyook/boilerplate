import 'reflect-metadata';
import { ExpressMetadataKeys } from '../const/ExpressMetadataKeys';

export const responseObject = (): ParameterDecorator => {
  return (target: any, _: string | symbol, index: number) => {
    Reflect.defineMetadata(ExpressMetadataKeys.RESPONSE_OBJECT, index, target);
  };
};
