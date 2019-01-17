
import {
  googleStrategy, facebookStrategy, twitterStrategy,
} from './strategies';

export default () => {
  googleStrategy.init();
  facebookStrategy.init();
  twitterStrategy.init();
};
