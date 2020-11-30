import 'reflect-metadata';
import { ExpressMetadataKeys } from '../const/ExpressMetadataKeys';
import { AuthenticationMetaT } from '../types/metadata';

export function authenticate(
  ...strategyNamesOrOptions: (string | AuthenticationMetaT)[]
) {
  return (
    target: any,
    propName?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>
  ) => {
    const specs: AuthenticationMetaT[] = strategyNamesOrOptions.map(
      (nameOrOption) => {
        if (typeof nameOrOption === 'string') {
          return { strategy: nameOrOption };
        }
        return nameOrOption;
      }
    );

    if (target && !propName && !descriptor) {
      // Class decorator
      return Reflect.defineMetadata(
        ExpressMetadataKeys.AUTH_STRATEGY,
        specs,
        target.prototype
      );
    }

    if (propName && descriptor) {
      // Method decorator
      return Reflect.defineMetadata(
        ExpressMetadataKeys.AUTH_STRATEGY,
        specs,
        target[propName]
      );
    }

    throw new Error(
      `@authenticate cannot be used on a property: ${target}->${String(
        propName
      )}`
    );
  };
}

export namespace authenticate {
  export const skip = () => authenticate({ strategy: '', skip: true });
}
