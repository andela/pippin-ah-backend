import { googleStrategy, twitterStrategy } from './strategies';

export default () => {
  googleStrategy.init();
  twitterStrategy.init();
};
