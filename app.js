const express = require("express");
const bodyParser = require('body-parser');
const routes = require("./routes/index.js");

require("dotenv").config();

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/api',  (req, res) => res.send({
       message: "Default route"
}));

app.use(routes);
let portNumber = process.env.PORT_NUMBER || 5000;
app.listen(portNumber, () => console.log(`listning on port ${portNumber}`));