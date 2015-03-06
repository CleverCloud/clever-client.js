var express = require("express");

var app = express();

app.use(express.static("."));
app.use(require("./self.js"));
app.use(require("./organisations.js"));
app.use(require("./applications.js"));
app.use(require("./addons.js"));

var port = process.env.PORT || 8080;

app.listen(port);
console.log("test server listening on port " + port + "…");
