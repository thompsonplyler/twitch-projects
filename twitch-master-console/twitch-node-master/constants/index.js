require("dotenv").config();

module.exports = {
  TMIJS_PORT: 3337,
  SOCKET_PORT: 3338,
  PUBSUBPASSWORD: process.env.PUBSUBPASSWORD,
  API_KEY: process.env.API_KEY,
};
