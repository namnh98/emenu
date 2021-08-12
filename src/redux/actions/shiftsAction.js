import {SET_SHIFT, RESET_SHIFT} from '../action-types';

const setShift = (shift) => {
  return {
    type: SET_SHIFT,
    shift,
  };
};

const reset = () => {
  return {
    type: RESET_SHIFT,
  };
};

export default {
  setShift,
  reset,
};
