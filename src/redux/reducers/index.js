import {combineReducers} from 'redux';
import userInfo from './loginReducer';
import tables from './tableReducer';
import partners from './partnerReducer';
import orders from './orderReducer';
import payment from './paymentReducer';
import shift from './shiftReducer';
import area from './areaReducer'
import {OrderReducers} from '../../screens/TabBottom/ConfirmScreen/redux/reducer';

const rootReducer = combineReducers({
  userInfo,
  tables,
  partners,
  orders,
  payment,
  shift,
  area,
  ...OrderReducers,
});

export default rootReducer;
