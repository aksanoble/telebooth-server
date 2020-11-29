const fetchGraphQL = require("../utils").fetchGraphQL;

// mutation MyMutation {
//     insert_user(objects: {chat_id: 10, is_bot: false, id: 10, last_seen: null, last_typed: null, username: ""}, on_conflict: {constraint: user_pkey, update_columns: username}) {
//       returning {
//         id
//         chat_id
//         is_bot
//         last_seen
//         last_typed
//         username
//       }
//     }
//   }

const query = `query MyQuery {
    user {
      id
    }
  }
`;

function fetchMyQuery() {
  return fetchGraphQL(query, "MyQuery", {});
}

async function startFetchMyQuery() {
  const { errors, data } = await fetchMyQuery();

  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }

  // do something great with this precious data
  console.log(data);
}

startFetchMyQuery();
