var graphql = require('graphql');
var noIntrospection = require('./index');
var expect = require('chai').expect;
var express = require('express');
var request = require('supertest-as-promised');
var graphqlExpress = require('graphql-server-express').graphqlExpress;
var bodyParser = require('body-parser');

var schema = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
      hello: {
        type: graphql.GraphQLString,
        resolve() {
          return Promise.resolve('world');
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

	describe('works with graphql-server-express', function() {
		var app = express();
		app.use('/graphql',
			bodyParser.json(),
			graphqlExpress({ schema: schema, validationRules: [noIntrospection] })
		);
		
		it('disables introspection using __schema', function() {
      var req = request(app)
        .post('/graphql')
        .send({
          query: '{ __schema { queryType { name } } }'
        });

      return req.then( function(result) {
				return expect(result.body.errors[0].message).to.match(/introspection is not allowed/);
      });
    });

		it('disables introspection using __type', function() {
      var req = request(app)
        .post('/graphql')
        .send({
          query: '{ __type(name: "Query") { name } }'
        });

      return req.then( function(result) {
				return expect(result.body.errors[0].message).to.match(/introspection is not allowed/);
      });
    });

		it('allows other valid queries through', function() {
      var req = request(app)
        .post('/graphql')
        .send({
          query: '{ hello }'
        });

      return req.then( function(result) {
				return expect(result.body).to.deep.equal({ data: { hello: 'world' } });
      });
    });
	
  });
});


