import { Expression } from './expression';
import { IArray, IStringer, Operator } from './types';

export default class Query<T> {
  private projections: string[] = [];
  private conditions: IArray = [];
  private sorts: string[] = [];
  private max = 0;

  public select = (...args: string[]) => {
    this.projections = args;
    return this;
  };

  public filter = (...args: (Expression<T> | IArray)[]) => {
    this.conditions = and(...args);
    return this;
  };

  public sort = (...args: string[]) => {
    this.sorts = args;
    return this;
  };

  public limit = (num: number) => {
    this.max = num;
    return this;
  };

  public qs = () => {
    let querystr = '';

    if (this.projections.length > 0) {
      querystr += querystr !== '' ? '&' : '';
      querystr += `select=${this.projections.join(',')}`;
    }

    if (this.conditions.length > 0) {
      querystr += querystr !== '' ? '&' : '';
      querystr += this.conditions.reduce(
        (acc: string, cur: IStringer | string) => {
          if (typeof cur === 'string') {
            acc += cur;
          } else {
            acc += cur.string();
          }
          return acc;
        },
        '',
      );
    }

    if (this.sorts.length > 0) {
      querystr += querystr !== '' ? '&' : '';
      querystr += `sort=${this.sorts.join(',')}`;
    }

    if (this.max > 0) {
      querystr += querystr !== '' ? '&' : '';
      querystr += `limit=${this.max.toFixed(0)}`;
    }

    return querystr;
  };
}

const mapExpr =
  <T, K extends keyof T>(optr: Operator) =>
  (field: K, value: T[K]) =>
    new Expression<T>(field, optr, value);

const groupBy =
  <T>(seperator: string) =>
  (...args: (Expression<T> | IArray)[]) => {
    const length = args.length - 1;
    const result = args.reduce(
      (acc: IArray, cur: Expression<T> | IArray, i: number) => {
        if (cur instanceof Expression) {
          acc.push(cur);
        } else {
          acc = acc.concat(cur);
        }
        if (i < length) {
          acc.push(seperator);
        }
        return acc;
      },
      ['('],
    );
    result.push(')');
    return result;
  };

export const or = <T>(...args: (Expression<T> | IArray)[]) =>
  groupBy<T>(',')(...args);
export const and = <T>(...args: (Expression<T> | IArray)[]) =>
  groupBy<T>(';')(...args);

export const eq = <T = any, K extends keyof T = any>(field: K, value: T[K]) =>
  mapExpr<T, K>(Operator.Equal)(field, value);
export const ne = <T = any, K extends keyof T = any>(field: K, value: T[K]) =>
  mapExpr<T, K>(Operator.NotEqual)(field, value);
export const gt = <T = any, K extends keyof T = any>(field: K, value: T[K]) =>
  mapExpr<T, K>(Operator.GreaterThan)(field, value);
export const gte = <T = any, K extends keyof T = any>(field: K, value: T[K]) =>
  mapExpr<T, K>(Operator.GreaterEqual)(field, value);
export const lt = <T = any, K extends keyof T = any>(field: K, value: T[K]) =>
  mapExpr<T, K>(Operator.LesserThan)(field, value);
export const lte = <T = any, K extends keyof T = any>(field: K, value: T[K]) =>
  mapExpr<T, K>(Operator.LesserEqual)(field, value);
export const includes = <T = any, K extends keyof T = any>(
  field: K,
  value: T[K],
) => mapExpr<T, K>(Operator.In)(field, value);
export const notIncludes = <T = any, K extends keyof T = any>(
  field: K,
  value: T[K],
) => mapExpr<T, K>(Operator.NotIn)(field, value);
export const like = <T = any, K extends keyof T = any>(field: K, value: T[K]) =>
  mapExpr<T, K>(Operator.Like)(field, value);
export const notLike = <T = any, K extends keyof T = any>(
  field: K,
  value: T[K],
) => mapExpr<T, K>(Operator.NotLike)(field, value);

export const filter = <T>(...args: (Expression<T> | IArray)[]) =>
  new Query<T>().filter(...args);
export const select = (...args: string[]) => new Query().select(...args);
export const sort = (...args: string[]) => new Query().sort(...args);
export const limit = (num: number) => new Query().limit(num);
