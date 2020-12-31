const { gql } = require("graphql-request");

const upsertUserQuery = gql`
  mutation UpsertUser($username: String!, $first_name: String!, $id: Int!, $is_bot: Boolean!) {
    insert_user(
      objects: { id: $id, username: $username, first_name: $first_name, is_bot: $is_bot }
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

const insertMessageQuery = gql`
  mutation InsertMessage($chat_id:Int!
    $id:Int!
    $text:String!
    $user_id:Int!
    $timestamp:timestamptz!) {
    insert_message(
      objects: {
        chat_id:$chat_id
        id:$id
        text:$text
        user_id:$user_id
        timestamp:$timestamp
      }
    ) {
      returning {
        chat_id
        id
        text
      }
    }
  }
`;

module.exports = {
  upsertUserQuery,
  insertMessageQuery
};
