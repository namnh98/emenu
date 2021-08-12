import {HOME, NOTIFICATION} from './ScreenName';

const config = {
  screens: {
    HOME: {
      path: 'home',
    },
    NOTIFICATION: {
      path: 'notification',
    },
  },
};

const linking = {
  prefixes: ['omenu://'],
  config,
};

export default linking;
