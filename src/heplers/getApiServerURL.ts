import { ServerObject } from 'openapi3-ts';

export const getApiServerURL = (
  proto: string,
  host: string,
  port?: number,
  basePath?: string,
  version?: string
): string =>
  `${proto}://${host}${port ? `:${port}` : ''}${
    basePath ? `/${basePath}` : ''
  }${version ? `/${version}` : ''}`;
