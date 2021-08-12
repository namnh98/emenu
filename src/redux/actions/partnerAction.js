import {PARTNER, RESET_PARTNER} from '../action-types';

const success = (partners) => {
  return {
    type: PARTNER,
    partners,
  };
};
const reset = () => {
  return {
    type: RESET_PARTNER,
  };
};

export default {
  success,
  reset,
};
