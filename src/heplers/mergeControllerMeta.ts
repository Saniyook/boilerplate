import { merge } from 'lodash';
import 'reflect-metadata';

export function mergeMeta(target: any, source: any) {
  const sourceMetaKeys = Reflect.getOwnMetadataKeys(source);

  sourceMetaKeys.forEach((key) => {
    const targetMeta = Reflect.getMetadata(key, target);
    const sourceMeta = Reflect.getMetadata(key, source);

    Reflect.defineMetadata(key, merge(targetMeta, sourceMeta), target);
  });

  return target;
}
