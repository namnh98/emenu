
import {SET_AREA} from '../action-types';


const initialState = null ;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AREA:
      return action.id
    default:
      return state;
  }
};

export default reducer;
