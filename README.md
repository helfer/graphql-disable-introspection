# graphql-disable-introspection
Disable introspection queries in GraphQL with a simple validation rule. Queries that contain `__schema` or `__type` will fail validation with this rule. For example, the following queries will be rejected:

```graphql
query {
  __schema {
    queryType {
      name
    }
  }
}

query {
  __type(name: "Query") {
    description
    fields {
      name
    }
  }
}
```

## Usage

The package can be installed from npm

```sh
npm install -save graphql-disable-introspection
```

It exports a single validation rule which you can pass to your node GraphQL server with the `validationRules` argument. 

Here's an example for `graphql-server-express`:

```diff
import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress } from 'graphql-server-express';
+ import NoIntrospection from 'graphql-disable-introspection';

const myGraphQLSchema = // ... define or import your schema here!
const PORT = 3000;

var app = express();

// bodyParser is needed just for POST.
app.use('/graphql', bodyParser.json(), graphqlExpress({
   schema: myGraphQLSchema,
+  validationRules: [NoIntrospection]
}));

app.listen(PORT);

```

If you're using `express-graphql`, it works exactly the same way:

```diff
app.use('/graphql', graphqlHTTP({
  schema: MyGraphQLSchema,
+ validationRules: [NoIntrospection]
}));
```
