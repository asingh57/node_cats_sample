var https = require('https');
var mariadb = require('mariadb');
var fs = require('fs');
var express = require('express');
const app = express();

const config = require('/config/config.json');//config stored outside repo for security reasons
const defaultConfig = config.development;
console.log(process.env.NODE_ENV);
const environment = process.env.NODE_ENV || 'development';
const environment_config = config[environment];


const ssl_details = {
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem')
};


app.get('/', (req, res) => {
    res.json(environment_config);
});



const httpsServer = https.createServer(ssl_details, app);

httpsServer.listen(environment_config.node_port, () => {
	console.log('HTTPS Server running on port '+environment_config.node_port);
});

