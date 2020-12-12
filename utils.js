require("dotenv").config();
const { GraphQLClient } = require("graphql-request");

const fetchGQL = new GraphQLClient(process.env.GRAPHQL_ENDPOINT);
fetchGQL.setHeader("X-Hasura-Admin-Secret", process.env.HASURA_ADMIN_SECRET);

module.exports = {
  fetchGQL
};
