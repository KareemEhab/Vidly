const express = require("express");
const app = express();
const winston = require("winston");

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

const port = process.env.PORT || "3000";

var server;

if (process.env.NODE_ENV !== "test")
  server = app.listen(port, () => winston.info(`Listening on port ${port}...`));
else server = app.listen();

module.exports = server;
