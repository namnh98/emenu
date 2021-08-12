import {TABLE_SUCCESS, TABLE_FAIL, TABLE_REQUEST} from '../action-types';

const success = (tables = []) => {
  return {
    type: TABLE_SUCCESS,
    tables,
  };
};

const fail = (error) => {
  return {
    type: TABLE_FAIL,
    error,
  };
};

const request = (tableId) => {
  return {
    type: TABLE_REQUEST,
    tableId,
  };
};

export default {
  success,
  fail,
  request,
};
