const constants = require("../constants");

module.exports = {
  tmi: {
    options: { debug: true },
    connection: {
      cluster: "aws",
      reconnect: true,
    },

    identity: {
      username: "PubSubBot",
      password: constants.PUBSUBPASSWORD,
    },
    channels: ["gamemasterthompson"],
  },
  environments: {
    local: "http://localhost:3001",
    remote: "http://fresh-under-one-sky-email-api.herokuapp.com",
  },
};
