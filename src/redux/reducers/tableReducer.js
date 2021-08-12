import {TABLE_SUCCESS, TABLE_FAIL, UPDATE_TABLE} from '../action-types';

const initialState = {
  tables: null,
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TABLE_SUCCESS:
      return {tables: action.tables, error: null};
    case TABLE_FAIL:
      return {tables: null, error: action.error};
    default:
      return state;
  }
};

export default reducer;
