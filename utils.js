require("dotenv").config();
const { GraphQLClient } = require("graphql-request");

const fetchGQL = new GraphQLClient(process.env.GRAPHQL_ENDPOINT);

module.exports = {
  fetchGQL,
};
