const querystring = require('querystring');

const parseCookies = (req, res, next) => {
  let cookieHeader = req.headers.cookie;
  if (cookieHeader !== undefined) {
    let cookieHeaderStr = cookieHeader.replace(/; /g, '&');
    let cookieObj = querystring.parse(cookieHeaderStr);
    req.cookies = cookieObj;
  }
  next();
};

module.exports = parseCookies;
