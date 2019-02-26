import request from 'request';

const sendTwitterUser = (req, res, next) => {
  request.post({
    url: 'https://api.twitter.com/oauth/request_token',
    oauth: {
      oauth_callback: 'http%3A%2F%2Flocalhost%3A8080%2Ftwitter-callback',
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET
    }
  }, (err, r, body) => {
    if (err) {
      const error = new Error(err.message);
      error.status = 500;
      return next(error);
    }

    const jsonStr = `{ "${body.replace(/&/g, '", "').replace(/=/g, '": "')}"}`;
    res.send(JSON.parse(jsonStr));
  });
};

const getTwitterUser = (req, res, next) => {
  request.post({
    url: 'https://api.twitter.com/oauth/access_token?oauth_verifier',
    oauth: {
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      token: req.query.oauth_token
    },
    form: { oauth_verifier: req.query.oauth_verifier }
  }, (err, r, body) => {
    if (err) {
      const error = new Error(err.message);
      error.status = 500;
      return next(error);
    }

    const bodyString = `{ "${body.replace(/&/g, '", "')
      .replace(/=/g, '": "')}"}`;
    const parsedBody = JSON.parse(bodyString);

    req.body.oauth_token = parsedBody.oauth_token;
    req.body.oauth_token_secret = parsedBody.oauth_token_secret;
    req.body.user_id = parsedBody.user_id;

    next();
  });
};

export default { sendTwitterUser, getTwitterUser };
