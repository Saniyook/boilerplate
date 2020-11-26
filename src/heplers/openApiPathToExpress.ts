import { Request, Response } from 'express';

type ExpressPath = string;

export const openApiPathToExpress = (openApiPath: string): ExpressPath => {
  const expressPath = openApiPath.replace(/(\{)([a-zA-Z0-9]*)(\})/gi, ':$2');
  return expressPath;
};
