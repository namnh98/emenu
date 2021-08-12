import {
  ADD_ONE_FOOD_TO_PAY,
  CHECK_FOOD_TO_PAY,
  MINUS_ONE_FOOD_TO_PAY,
  SET_QTY_FOOD_TO_PAY,
  RESET_PAYMENT,
} from '../action-types';

export default reducer = (state = [], action) => {
  switch (action.type) {
    case RESET_PAYMENT:
      return [];
    case CHECK_FOOD_TO_PAY:
      if (state.find((item) => item.id === action.food.id)) {
        return state.filter((item) => item.id != action.food.id);
      } else {
        return [...state, action.food].map((item) => {
          if (item.id === action.food.id) {
            return {...item, qty: item.qty - item.qty_completed};
          }
          return item;
        });
      }
    case SET_QTY_FOOD_TO_PAY:
      return state.map((item) => {
        if (item.id === action.food.id) {
          return {
            ...item,
            qty:
              action.qty <= item.qty && action.qty > 1
                ? action.qty
                : action.qty <= 1
                ? 1
                : item.qty,
          };
        } else {
          return item;
        }
      });
    case ADD_ONE_FOOD_TO_PAY:
      return state.map((item) => {
        if (item.id === action.food.id) {
          return {
            ...item,
            qty:
              item.qty < action.food.qty - action.food.qty_completed
                ? item.qty + 1
                : item.qty,
          };
        } else {
          return item;
        }
      });
    case MINUS_ONE_FOOD_TO_PAY:
      return state.map((item) => {
        if (item.id === action.food.id) {
          return {...item, qty: item.qty > 1 ? item.qty - 1 : item.qty};
        } else {
          return item;
        }
      });
    default:
      return state;
  }
};
