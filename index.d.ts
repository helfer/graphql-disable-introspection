declare module 'graphql-disable-introspection' {
  import type { ValidationRule } from 'graphql';

  const NoIntrospection: ValidationRule;

  export = NoIntrospection;
}
