import { IStringer, Operator } from './types';

export class Expression<T> implements IStringer {
  constructor(
    private field: keyof T,
    private operator: Operator,
    private value: T[keyof T],
  ) {}

  public string = () => {
    let str = String(this.field);
    switch (this.operator) {
      case Operator.Equal:
        str += '==';
        break;
      case Operator.NotEqual:
        str += '!=';
        break;
      case Operator.LesserThan:
        str += '=lt=';
        break;
      case Operator.LesserEqual:
        str += '=le=';
        break;
      case Operator.GreaterThan:
        str += '=gt=';
        break;
      case Operator.GreaterEqual:
        str += '=ge=';
        break;
      case Operator.In:
        str += '=in=';
        break;
      case Operator.NotIn:
        str += '=out=';
        break;
      case Operator.Like:
        str += '=like=';
        break;
      case Operator.NotLike:
        str += '=notlike=';
        break;
      default:
        throw new Error('unsupported Operator');
    }
    switch (typeof this.value) {
      case 'string':
        str += this.sanitizeInput(`${this.value}`);
        break;
      default:
        if (Array.isArray(this.value)) {
          str += this.value.map((v) => this.sanitizeInput(String(v))).join(',');
        } else {
          str += this.sanitizeInput(String(this.value));
        }
    }
    return str;
  };

  private sanitizeInput(input: string): string {
    // Remove any special characters that might be used for SQL injection
    return input.replace(/[^A-Za-z0-9-_:.]/g, '');
  }
}
