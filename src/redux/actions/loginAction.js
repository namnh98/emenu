import {LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAIL} from '../action-types';

const request = () => {
  return {
    type: LOGIN_REQUEST,
  };
};

const success = (users) => {
  return {
    type: LOGIN_SUCCESS,
    users,
  };
};

const fail = (error) => {
  return {
    type: LOGIN_FAIL,
    error,
  };
};

export default {
  request,
  success,
  fail,
};
