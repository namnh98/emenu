import {PARTNER, RESET_PARTNER} from '../action-types';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case PARTNER:
      return {...action.partners, ...state};
    case RESET_PARTNER:
      return {};
    default:
      return state;
  }
};

export default reducer;
