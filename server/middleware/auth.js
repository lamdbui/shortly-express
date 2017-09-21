const models = require('../models');
const Promise = require('bluebird');
const session = models.Sessions;

module.exports.createSession = (req, res, next) => {
  console.log('**** create sessions');
  session.create().then(resolve => {
    console.log('*** this is resolve:', resolve);
  }).catch(reject => {
    console.log('***This is reject: ', reject);
  });
  next();
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/
