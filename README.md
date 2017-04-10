# graphql-disable-introspection
Disable Introspection in GraphQL-JS with a simple validation rule

## Usage

Install the package from npm

```sh
npm install -save graphql-disable-introspection
```

Then import it and pass it to `graphql-server-<express/koa/hapi/lambda/micro/...>` as an additional validation rule:

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
