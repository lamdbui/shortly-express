const models = require('../models');
const Promise = require('bluebird');
const session = models.Sessions;
const user = models.Users;

module.exports.createSession = (req, res, next) => {
  console.log('**** create sessions');
  console.log('COOKIE:', req);
  if (req.cookies === undefined || Object.keys(req.cookies).length === 0) {
    session.create().then(resolve => {
      console.log('*** this is resolve:', resolve);
      var sessionId = resolve.insertId;
      session.get({ id: sessionId }).then(sessionObj => {
        //attach to the response
        console.log('SUCCESS');
        //res.cookie('sessionId', sessionObj.hash);
        //session.hash
        req.session = { 'hash': sessionObj.hash };
        res.cookie('shortlyid', sessionObj.hash);
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
    console.log('%%% COOKIE:', cookie);
    console.log('%%% COOKIE HASH:', cookie.shortlyid);
    session.get({'hash': cookie.shortlyid})
      .then(sessionResolve => {
        console.log('+++ RESOLVE:', sessionResolve);
        // need to check if we actually found any session rows
        if (sessionResolve !== undefined) {
          if (sessionResolve.userId !== null) {
            // let userId = sessionResolve.userId;
            user.get({'id': sessionResolve.userId })
              .then(userResolve => {
                console.log('^^^ USER_RESOLVE:', userResolve);
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
                // res.cookie('shortlyid', sessionResolve.hash);
                // req.session = { 'hash': sessionResolve.hash };
                console.log('^^^ USER_REJECT:', userReject);
                var sessionObj = {
                  'hash': cookie.shortlyid,
                  'user': {
                    'username': ''
                  },
                  'userId': ''
                };
                console.log('SESSION_OBJ:', sessionObj);
                res.cookie('shortlyid', cookie.shortlyid);
                req.session = sessionObj;
                console.log('###SESSION:', req.session);
                console.log('###SESSION TYPE:', typeof req.session);
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
        // console.log('+++ REJECT:', sessionReject);
        console.log('+++ REJECT COOKIE:', req.cookies);
        console.log('--- ', typeof req.cookies);
        res.cookie('shortlyid', req.cookies.shortlyid);
        req.session = { 'hash': req.cookies.shortlyid };
        next();
      });
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/
