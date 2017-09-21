const models = require('../models');
const Promise = require('bluebird');
const session = models.Sessions;

module.exports.createSession = (req, res, next) => {
  console.log('**** create sessions');
  session.create().then(resolve => {
    console.log('*** this is resolve:', resolve);
    var sessionId = resolve.insertId;
    session.get({ id: sessionId }).then(sessionObj => {
      //attach to the response
      console.log('SUCCESS');
      //res.cookie('sessionId', sessionObj.hash);
      //session.hash
      req.session = { 'hash': sessionObj.hash };
      next();
    }).catch(sessionReject => {
      //do something about failure
      console.log('REJECT');
      next();
    });
    console.log('***this is resolve ID: ', sessionId);
  }).catch(reject => {
    console.log('***This is reject: ', reject);
    next();
  });
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/
