
var https = require('https');
var mariadb = require('mariadb');
var fs = require('fs');
var express = require('express');
const app = express();
const _ = require('lodash');
const bodyParser = require("body-parser");


const config = require('/config/config.json');//config stored outside repo for security reasons
const defaultConfig = config.development;
const environment = process.env.NODE_ENV || 'development';
const environment_config = config[environment];
const final_config = _.merge(defaultConfig, environment_config);
const database_config=final_config.database; //config loaded for app

const ssl_details = {//load ssl files
  ca: fs.readFileSync(final_config.ssl_ca),
  key: fs.readFileSync(final_config.ssl_key),
  cert: fs.readFileSync(final_config.ssl_cert)
};
app.use(express.static(__dirname + '/public'));//expose the public directory containing images and front end js


app.use(bodyParser.urlencoded({
    extended: true
}));


const httpsServer = https.createServer(ssl_details, app);//setup https

httpsServer.listen(final_config.node_port, () => {
	console.log('HTTPS Server running on port '+final_config.node_port);
});


const serverCert = [fs.readFileSync(database_config.ssl_cert, "utf8")];// load the custom created server cert for mariadb

var pool= mariadb
 .createPool({
   host: database_config.host, 
   ssl: {
	 ca: serverCert
   }, 
   user: database_config.user, 
   password:database_config.password, 
   database:database_config.name,
   connectionLimit: 5
 })



//---------------
//Home page HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/pages/home/home.html');
});
//---------------


app.get('/get_all_users', (req, res) => { //gets all users and their preferences
    pool.getConnection()
    .then(conn => {    
      conn.query("Select * from preferences order by preference_id ASC;")
        .then((rows) => {
        conn.end();

          res.send(rows);
        })
    }).catch(err => {
      //not connected
        conn.end();
        console.log("connection failed");
        res.status(500).send(err);
    });
});


app.post('/add_user', (req, res) => {//inserts a new value into the preferencedb

    pool.getConnection()
    .then(conn => {    

        req.body.name=req.body.name.trim()//trim whitespaces

        if(//check param validity
        req.body.name==="" 
            || 
        typeof req.body.name === undefined 
            || 
        req.body.name ===null 
        ){
            
            var err="name is required";
            res.status(500).send(err);
            return;
        }

        if(
        req.body.animal!=="cat" 
            && 
        req.body.animal !== "dog" 
        ){
            
            var err="animal type is invalid";
            res.status(500).send(err);
            return;
        }


      conn.query("INSERT INTO preferences(name,colour,animal) VALUES(?,?,?);",
        [req.body.name,req.body.colour,req.body.animal])
        .then((data) => {        
            conn.end();
            res.send(data);
        })
    }).catch(err => {
      //not connected
        conn.end();
        console.log("connection failed");
        res.status(500).send(err);
    });
});





