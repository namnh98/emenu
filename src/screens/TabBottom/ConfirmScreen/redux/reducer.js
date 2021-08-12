import Actions from './actions';

const initialState = {
  data: null,
  total: null,
  isLoading: true,
};

export const order = (state = initialState, action) => {
  switch (action.type) {
    case Actions.UPDATE_PROCESS: {
      const data = state.data.map((value) => {
        const isOrder = value.id === action.id ? value : null;
        const order_items = value.order_items.filter(
          ({ item_id }) => item_id !== action.item_id,
        );
        return isOrder ? { ...value, order_items } : value;
      });
      return { ...state, data };
    }
    case Actions.UPDATE_PROCESS_ALL: {
      const data = state.data.filter(({ id }) => id !== action.id);
      return { ...state, data };
    }
    case Actions.GET_ORDER:
      return { ...state, isLoading: true };
    case Actions.GET_ORDER_SUCCESS:
      return { data: action.data, total: action.total, isLoading: false };
    case Actions.GET_ORDER_FAIL:
      return { ...state, isLoading: false };
    case Actions.GET_ORDER_UNMOUNT:
      return { ...initialState };
    default:
      return state;
  }
};

export const orderProcess = (state = initialState, action) => {
  switch (action.type) {
    case Actions.ORDER_PROCESSING:
      return { ...state, isLoading: true };
    case Actions.ORDER_PROCESSING_SUCCESS:
      return { ...state, data: action.data, isLoading: false };
    case Actions.ORDER_PROCESSING_FAIL:
      return { ...state, isLoading: false };
    case Actions.ORDER_PROCESSING_UNMOUNT:
      return { ...initialState };
    default:
      return state;
  }
};

export const orderCancel = (state = initialState, action) => {
  switch (action.type) {
    case Actions.ORDER_CANCEL:
      return { ...state, isLoading: true };
    case Actions.ORDER_CANCEL_SUCCESS:
      return { ...state, data: action.data, isLoading: false };
    case Actions.ORDER_CANCEL_FAIL:
      return { ...state, isLoading: false };
    case Actions.ORDER_CANCEL_UNMOUNT:
      return { ...initialState };
    default:
      return state;
  }
};

export const notification = (state = initialState, action) => {
  switch (action.type) {
    case Actions.NOTIFICATION:
      return { ...state, isLoading: true };
    case Actions.NOTIFICATION_SUCCESS:
      return { ...state, data: action.data, isLoading: false };
    case Actions.NOTIFICATION_FAIL:
      return { ...state, isLoading: false };
    case Actions.NOTIFICATION_UNMOUNT:
      return { ...initialState };
    default:
      return state;
  }
};

const initialPrint = {
  data: null,
  isLoading: true,
}

export const printChickenBar = (state = initialPrint, action) => {
  switch (action.type) {
    case Actions.GET_PRINT_CHICKEN_BAR:
      return { ...state, isLoading: true };
    case Actions.GET_PRINT_CHICKEN_BAR_SUCCESS:
      return { ...state, data: action.data, isLoading: false };
    case Actions.GET_PRINT_CHICKEN_BAR_FAIL:
      return { ...state, isLoading: false };
    case Actions.GET_PRINT_CHICKEN_BAR_UNMOUNT:
      return { ...initialPrint };
    default:
      return state;
  }
};


export const printChickenBarById = (state = initialPrint, action) => {
  switch (action.type) {
    case Actions.GET_PRINT_CHICKEN_BAR_BY_ID:
      return { ...state, isLoading: true };
    case Actions.GET_PRINT_CHICKEN_BAR_BY_ID_SUCCESS:
      return { ...state, data: action.data, isLoading: false };
    case Actions.GET_PRINT_CHICKEN_BAR_BY_ID_FAIL:
      return { ...state, isLoading: false };
    case Actions.GET_PRINT_CHICKEN_BAR_BY_ID_UNMOUNT:
      return { ...initialPrint };
    default:
      return state;
  }
};


export const receiptCook = (state = initialPrint, action) => {
  switch (action.type) {
    case Actions.RECEIPT_COOK:
      return { ...state, isLoading: true };
    case Actions.RECEIPT_COOK_SUCCESS:
      return { ...state, data: action.data, isLoading: false };
    case Actions.RECEIPT_COOK_FAIL:
      return { ...state, isLoading: false };
    case Actions.RECEIPT_COOK_UNMOUNT:
      return { ...initialPrint };
    default:
      return state;
  }
};


export const OrderReducers = { order, orderProcess, orderCancel, notification, printChickenBar, printChickenBarById };
