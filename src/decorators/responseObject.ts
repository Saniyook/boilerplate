import 'reflect-metadata';
import { EXPRESS_RESPONSE_OBJECT } from '../const/metaKeys';

export const responseObject = (): ParameterDecorator => {
  return (target: any, _: string | symbol, index: number) => {
    Reflect.defineMetadata(EXPRESS_RESPONSE_OBJECT, index, target);
  };
};
