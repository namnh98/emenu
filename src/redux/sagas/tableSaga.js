import {takeLatest, put} from 'redux-saga/effects';
import {TABLE_REQUEST} from '../action-types';
import TableApi from '../../api/TableApi';
import tableAction from '../actions/tableAction';

function* fetchAreas(action) {
  try {
    const statusTable = yield TableApi.updateStatusTable(action.tableId, true);
    if (statusTable.status === 200) {
      const response = yield TableApi.getListTable();
      yield put(tableAction.success(response));
    }
  } catch (error) {
    console.log('Err @fetchAreas ', error);
  }
}

function* mySaga() {
  yield takeLatest(TABLE_REQUEST, fetchAreas);
}

export default mySaga;
