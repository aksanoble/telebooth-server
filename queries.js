const { fetchGQL } = require("./utils");
const { gql } = require("graphql-request");
const to = require("await-to-js").default;

const query = gql`
  mutation MyMutation($username: String!, $first_name: String!, $id: Int!) {
    insert_user(
      objects: { id: $id, username: $username, first_name: $first_name }
      on_conflict: { constraint: user_pkey, update_columns: username }
    ) {
      returning {
        id
        is_bot
        username
      }
    }
  }
`;

const upsertUser = async (variables) => {
  const [err, data] = await to(fetchGQL.request(query, variables));
  if (err) {
    console.log("Error in fetching Graphql", err);
  } else {
    console.log(JSON.stringify(data), "data");
  }
};

module.exports = {
  upsertUser,
};
