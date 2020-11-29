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
  