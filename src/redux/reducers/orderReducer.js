import {
  ADD_ORDER,
  REMOVE_ORDER,
  ADD_QTY_ORDER,
  NOTE_ORDER,
  ADD_ORDERS,
  RESET_ORDER,
  CHECK_FOOD_TAKE_AWAY,
} from '../action-types';

export default reducer = (state = [], action) => {
  switch (action.type) {
    case ADD_ORDER:
      let addFood;
      const itemPlus = state.find((value) => value.id === action.food.id);

      if (itemPlus) {
        return state.map((value) => {
          if (value.id === itemPlus.id) {
            return {...value, count: value.count + 1, is_takeaway: false};
          }
          return {...value, is_takeaway: false};
        });
      } else {
        addFood = {
          ...action.food,
          count: action.food.count + 1,
          is_takeaway: false,
        };
        return [...state, addFood];
      }

    case REMOVE_ORDER:
      let removeFood;
      const itemMinus = state.find((value) => value.id === action.food.id);

      if (itemMinus) {
        if (itemMinus.count === 1) {
          return state.filter((value) => value.id !== itemMinus.id);
        }
        return state.map((value) => {
          if (value.id === itemMinus.id) {
            return {...value, count: value.count - 1};
          }
          return value;
        });
      } else {
        removeFood = {...action.food, count: action.food.count - 1};
        return [...state, removeFood];
      }

    case NOTE_ORDER:
      const result = state.map((value) => {
        if (value.id === action.food.id) {
          return {...value, description: action.note};
        }
        return value;
      });
      return result;

    case ADD_QTY_ORDER:
      const itemQty = state.find((value) => value.id === action.food.id);
      let count = action.qty < 0 ? 1 : action.qty;
      if (+action.qty === 0) {
        return itemQty
          ? state.filter((value) => value.id !== itemQty.id)
          : state;
      }
      if (itemQty) {
        return state.map((value) =>
          value.id === itemQty.id
            ? {...value, count: count, price: action.price}
            : value,
        );
      }
      return [...state, {...action.food, count: count, price: action.price}];

    case ADD_ORDERS:
      return action.foods;
    case CHECK_FOOD_TAKE_AWAY:
      const itemFound = state.find((item) => item.id === action.food.id);
      if (!itemFound) return state;
      else
        return state.map((item) =>
          item.id === action.food.id
            ? {...item, is_takeaway: !item.is_takeaway}
            : item,
        );

    case RESET_ORDER:
      return [];

    default:
      return state;
  }
};
