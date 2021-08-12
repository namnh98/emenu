import {
  ADD_ONE_FOOD_TO_PAY,
  MINUS_ONE_FOOD_TO_PAY,
  SET_QTY_FOOD_TO_PAY, 
  CHECK_FOOD_TO_PAY, 
  RESET_PAYMENT
} from '../action-types';

const resetPayment = () =>{
  return{
    type: RESET_PAYMENT,
  }
}

const checkFood = (food) => {
  return{
    type: CHECK_FOOD_TO_PAY,
    food,
  }
}

const addOneItem = (food) => {
  return{
    type: ADD_ONE_FOOD_TO_PAY,
    food
  }
}


const minusOneItem = (food) => {
  return{
    type: MINUS_ONE_FOOD_TO_PAY,
    food
  }
}

const setQtyPay = (food, qty) => {
  return{
    type: SET_QTY_FOOD_TO_PAY,
    food,
    qty
  }
}

export default {
  resetPayment, 
  checkFood, 
  addOneItem,
  minusOneItem, 
  setQtyPay
}
