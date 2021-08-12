import {SET_AREA} from '../action-types';

const set = (id) => {
  return {
    type: SET_AREA,
    id,
  };
};


export default {
  set
};
