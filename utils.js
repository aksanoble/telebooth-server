const fetch = require("node-fetch");
require("dotenv").config();

async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch(process.env.GRAPHQL_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

module.exports = {
  fetchGraphQL,
};
