[![Build Status](https://github.com/si3nloong/rsql/workflows/test/badge.svg?branch=master)](https://github.com/si3nloong/rsql/actions)

### RESTful Query Language (RSQL)

Utility to generate rsql query string. It is automatically sanitizing input values to protect for unnecessary injections.
Rules are following [this documentation](https://aboullaite.me/rsql/).

This utility is providing the type safety when making query strings.
If you are using typescript, you can easily define the type of the query string or get DTO's using mechanisms like OpenAPI schema.

# Installation

Using npm:

```bash
$ npm i --save rsql
```

```typescript
import { filter, ne, or, eq, includes, notIncludes } from 'rsql';

type Query = {
  name: string;
  status: string[];
};

filter<Query>(
  eq('name', 'test'),
  includes('status', ['A', 'B', 'C']),
  notIncludes('status', ['A', 'B', 'C']),
).qs(); // (name==test;status=in=A,B,C;status=nin=A,B,C)

filter(ne('b', 'value'), or(eq('c', 'v2'), eq('d', 'v4'))).qs(); // (b!=value;(c==v2,d==v4))
```
