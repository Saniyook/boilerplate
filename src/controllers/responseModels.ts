import { Model, model, property } from '@loopback/repository';

@model()
export class SuccessModel extends Model {
  constructor(result: number[]) {
    super();
    this.result = result;
  }

  @property({ type: 'array', itemType: 'number' })
  result: number[];
}

@model()
export class SomeError extends Model {
  constructor(message: string) {
    super();
    this.message = message;
  }

  @property({ type: 'string' })
  message: string;
}
