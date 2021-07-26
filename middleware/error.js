const winston = require('winston');

module.exports = function(err, req, res, next){
    winston.error(err.message, err);
    //or winston.log('error', err.message);

    //error
    //warn
    //info
    //verbose
    //debug
    //silly

    res.status(500).send('Something failed.');
    //500 means internal server error
}