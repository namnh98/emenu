import {
  ADD_ORDER,
  REMOVE_ORDER,
  NOTE_ORDER,
  ADD_QTY_ORDER,
  ADD_ORDERS,
  RESET_ORDER,
  CHECK_FOOD_TAKE_AWAY,
} from '../action-types';

const addFood = (food) => {
  return {
    type: ADD_ORDER,
    food,
  };
};

const removeFood = (food) => {
  return {
    type: REMOVE_ORDER,
    food,
  };
};

const noteFood = (food, note) => {
  return {
    type: NOTE_ORDER,
    food,
    note,
  };
};

const addQtyFood = (food, qty, price) => {
  return {
    type: ADD_QTY_ORDER,
    food,
    qty,
    price,
  };
};

const addOrders = (foods) => {
  return {
    type: ADD_ORDERS,
    foods,
  };
};

const resetFood = () => {
  return {
    type: RESET_ORDER,
  };
};

const checkTakeAway = (food) => {
  return {
    type: CHECK_FOOD_TAKE_AWAY,
    food,
  };
};

export default {
  addFood,
  removeFood,
  noteFood,
  addQtyFood,
  addOrders,
  resetFood,
  checkTakeAway,
};
