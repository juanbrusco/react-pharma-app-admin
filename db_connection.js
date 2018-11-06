var mysql = require('mysql');
var connection = mysql.createPool({

    host     : '',
    user     : '',
    password : '',
    database : '',
    port: ''

});
module.exports = connection;