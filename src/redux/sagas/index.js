import {all, fork} from 'redux-saga/effects';
import {loginAsync} from './loginSaga';
import tableSaga from './tableSaga';
import {watchOrderSagas} from '../../screens/TabBottom/ConfirmScreen/redux/saga';

export default function* rootSaga() {
  yield all([loginAsync(), tableSaga(), fork(watchOrderSagas)]);
}
