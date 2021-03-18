/** @format */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static('./app'));

const projectData = {};

app.get('/data', (req, res) => {
	res.send(projectData);
});

app.post('/add', (req, res) => {
	projectData.user = req.body;
	res.send(projectData);
});

app.listen(8080, () => {
	console.log('server is running on', 8080);
});
