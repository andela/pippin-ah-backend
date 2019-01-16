import { googleStrategy, facebookStrategy } from './strategies';


export default () => {
  googleStrategy.init();
  facebookStrategy.init();
};
