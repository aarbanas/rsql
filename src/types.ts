export enum Operator {
  Equal,
  NotEqual,
  GreaterThan,
  GreaterEqual,
  LesserThan,
  LesserEqual,
  Like,
  NotLike,
  In,
  NotIn,
}

export interface IStringer {
  string(): string;
}

export type IArray<T> = (string | IStringer)[];
