import 'reflect-metadata';
import { EXPRESS_REQUEST_OBJECT } from '../const/metaKeys';

export const requestObject = (): ParameterDecorator => {
  return (target: any, propKey: string | symbol, index: number) => {
    Reflect.defineMetadata(EXPRESS_REQUEST_OBJECT, index, target[propKey]);
  };
};
