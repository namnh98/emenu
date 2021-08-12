import {takeLatest, call, put} from 'redux-saga/effects';
import axios from 'axios';

import {LOGIN_REQUEST} from '../action-types';
import {loginAction} from '../actions';
import {users} from '../../stores';
import BaseUrl from '../../api/BaseUrl';

const fetchProduct = async () => {
  const {refreshToken} = await users.getListUser();
  const url = `${BaseUrl.URL_v1_1}/Account/RefreshToken`;
  return axios({
    method: 'POST',
    url,
    data: {
      refresh_token: refreshToken,
    },
  });
};

function* workerSaga() {
  try {
    const userInfo = yield users.getListUser();
    const response = yield call(fetchProduct);

    const data = response.data.data;
    const newData = {
      ...userInfo,
      refreshToken: data.refreshToken,
      token: data.token,
    };

    yield users.setValueUser(newData); // save token by user
    yield put(loginAction.success(newData));
  } catch (error) {
    // dispatch a failure action to the store with the error
    console.log('Err @loginSaga ', error);
    yield put(loginAction.fail(error));
  }
}

function* loginAsync() {
  yield takeLatest(LOGIN_REQUEST, workerSaga);
}

export {loginAsync};
