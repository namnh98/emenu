import {LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAIL} from '../action-types';

const initialState = {
  fetching: false,
  users: null,
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {...state, fetching: true};
    case LOGIN_SUCCESS:
      return {...state, fetching: false, users: action.users};
    case LOGIN_FAIL:
      return {...state, fetching: false, users: null, error: action.error};
    default:
      return state;
  }
};

export default reducer;
