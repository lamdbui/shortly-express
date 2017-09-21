const models = require('../models');
const Promise = require('bluebird');
const session = models.Sessions;
const user = models.Users;

module.exports.createSession = (req, res, next) => {
  console.log('**** create sessions');
  if (req.cookies === undefined || Object.keys(req.cookies).length === 0) {
    session.create().then(resolve => {
      var sessionId = resolve.insertId;
      session.get({ id: sessionId }).then(sessionObj => {
        req.session = { 'hash': sessionObj.hash };
        res.cookie('shortlyid', sessionObj.hash);
        next();
      }).catch(sessionReject => {
        //do something about failure
        next();
      });
    }).catch(reject => {
      next();
    });
  } else { // we have a cookie
    // get cookie from header
    // get the hash from cookie
    // use hash to find session
    // get session.userId
    // if session.userId is not null
      // get username based on session.userId
    // else
      // don't attach any username info to session
    // sessionObj = { user.username, userId }
    // res.session = sessionObj
    var cookie = req.cookies;
    session.get({'hash': cookie.shortlyid})
      .then(sessionResolve => {
        // need to check if we actually found any session rows
        if (sessionResolve !== undefined) {
          if (sessionResolve.userId !== null) {
            // let userId = sessionResolve.userId;
            user.get({'id': sessionResolve.userId })
              .then(userResolve => {
                var sessionObj = {
                  'hash': userResolve.hash,
                  'user': {
                    'username': userResolve.username
                  },
                  'userId': userResolve.id
                };
                res.cookie('shortlyid', sessionResolve.hash);
                req.session = sessionObj;
                next();
              })
              .catch(userReject => {
                var sessionObj = {
                  'hash': cookie.shortlyid,
                  'user': {
                    'username': ''
                  },
                  'userId': ''
                };
                res.cookie('shortlyid', cookie.shortlyid);
                req.session = sessionObj;
                next();
              });
          } else { // when userId is NULL
            res.cookie('shortlyid', sessionResolve.hash);
            req.session = { 'hash': sessionResolve.hash };
            next();
          }
        } else {  // when no sessions were found
          res.cookie('shortlyid', cookie.shortlyid);
          req.session = { 'hash': cookie.shortlyid };
          next();
        }
      })
      .catch(sessionReject => {
        // maybe create a new session here as well...
        res.cookie('shortlyid', req.cookies.shortlyid);
        req.session = { 'hash': req.cookies.shortlyid };
        next();
      });
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/
