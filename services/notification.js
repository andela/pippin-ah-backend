import Pusher from 'pusher';

export default new Pusher({
  appId: process.env.PUSHER_APPID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRETE,
  cluster: 'eu',
  encrypted: true
});
