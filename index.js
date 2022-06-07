const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app,use(express.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());


app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))