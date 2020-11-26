import { mergeMeta } from './mergeControllerMeta';

export function applyControllerMixins<
  T extends new (...args: any[]) => any,
  P extends T
>(derivedCtor: T, baseCtors: P[]) {
  baseCtors.forEach((baseCtor) => {
    mergeMeta(derivedCtor.prototype, baseCtor.prototype);

    Reflect.ownKeys(baseCtor.prototype).forEach((name) => {
      if (name !== 'constructor') {
        derivedCtor.prototype[name] = baseCtor.prototype[name];
      }
    });
  });

  return derivedCtor;
}
