import {SET_SHIFT, RESET_SHIFT} from '../action-types';

export default reducer = (state = {}, action) => {
  switch (action.type) {
    case SET_SHIFT:
      return action.shift;
    case RESET_SHIFT:
      return {};
    default:
      return state;
  }
};
