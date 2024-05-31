import {
  filter,
  ne,
  or,
  eq,
  includes,
  notIncludes,
  gte,
  lte,
  like,
  notLike,
  select,
  sort,
  limit,
} from '../src';
import { describe } from 'node:test';

describe('Tests', () => {
  test('Query String', () => {
    const qs = filter(
      eq('name', 1),
      ne('flag', true),
      includes('status', ['A', 'B', 'C']),
      notIncludes('status', ['A', 'B', 'C']),
      like('test', 'xxx%'),
    )
      .sort('a', 'b', 'c')
      .limit(100)
      .qs();
    expect(qs).toBe(
      `(name==1;flag!=true;status=in=A,B,C;status=out=A,B,C;test=like=xxx)&sort=a,b,c&limit=100`,
    );

    expect(
      filter(ne('b', 'value'), or(eq('c', 'v2'), eq('d', 'v4')))
        .limit(100)
        .qs(),
    ).toBe(`(b!=value;(c==v2,d==v4))&limit=100`);

    const qs1 = filter(
      gte('submittedAt', '2019-12-22T16:00:00Z'),
      lte('submittedAt', '2019-12-31T15:59:59Z'),
      eq('status', 'APPROVED'),
    )
      .limit(100)
      .qs();
    expect(qs1).toBe(
      `(submittedAt=ge=2019-12-22T16:00:00Z;submittedAt=le=2019-12-31T15:59:59Z;status==APPROVED)&limit=100`,
    );
  });

  test('Query string with types', () => {
    interface ITest {
      name: string;
      flag: boolean;
      test: string;
    }

    const qs = filter<ITest>(
      eq('name', 'test'),
      ne('flag', false),
      notLike('test', '123'),
    ).qs();

    expect(qs).toBe(`(name==test;flag!=false;test=notlike=123)`);
  });

  test('Select', () => {
    const qs = select('a', 'b', 'c').qs();
    expect(qs).toBe(`select=a,b,c`);
  });

  test('Sort', () => {
    const qs = sort('c', 'd').qs();
    expect(qs).toBe(`sort=c,d`);
  });

  test('Limit', () => {
    const qs = limit(100).qs();
    expect(qs).toBe(`limit=100`);
  });
});
