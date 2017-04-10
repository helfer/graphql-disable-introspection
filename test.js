var graphql = require('graphql');
var noIntrospection = require('./index');
var expect = require('chai').expect;

var schema = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
      hello: {
        type: graphql.GraphQLString,
        resolve() {
          return 'world';
        }
      }
    }
  })
});

describe('NoIntrospection validation rule', function(){

  it('disallows queries with __schema', function(){
		var query = graphql.parse('{ __schema { queryType { name } } }');
		var validationErrors = graphql.validate(schema, query, [noIntrospection]);
		return expect(validationErrors[0].message).to.match(/introspection is not allowed/);
  });

  it('disallows queries with __type', function(){
		var query = graphql.parse('{ __type(name: "Query"){ name } }');
		var validationErrors = graphql.validate(schema, query, [noIntrospection]);
		return expect(validationErrors[0].message).to.match(/introspection is not allowed/);
  });

  it('allows valid queries that do not contain __schema or __type', function(){
		var query = graphql.parse('{ hello }');
		var validationErrors = graphql.validate(schema, query, [noIntrospection]);
		return expect(validationErrors.length).to.equal(0);
  });
});


