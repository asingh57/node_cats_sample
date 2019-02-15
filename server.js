var https = require('https');
var mariadb = require('mariadb');
var fs = require('fs');
var express = require('express');
const app = express();
const _ = require('lodash');

const config = require('/config/config.json');//config stored outside repo for security reasons
const defaultConfig = config.development;
const environment = process.env.NODE_ENV || 'development';
const environment_config = config[environment];
const final_config = _.merge(defaultConfig, environment_config);


const ssl_details = {
  ca: fs.readFileSync(final_config.ssl_ca),
  key: fs.readFileSync(final_config.ssl_key),
  cert: fs.readFileSync(final_config.ssl_cert)
};
app.use(express.static(__dirname + '/public'));

//---------------
//Home page scripts and HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/pages/home/home.html');
});
//---------------



const httpsServer = https.createServer(ssl_details, app);

httpsServer.listen(final_config.node_port, () => {
	console.log('HTTPS Server running on port '+final_config.node_port);
});

