import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';
import BaseUrl from '../../../../api/BaseUrl';
import { userInfo, users } from '../../../../stores';
import Actions from './actions';

function* getOrder(actions) {
  try {
    const { token } = yield users.getListUser();
    const url = `${BaseUrl.URL_v1_0}/Order/OrderItem`;
    const res = yield axios.get(url, {
      headers: {
        get: {
          Authorization: `Bearer ${token}`,
        },
      },
      params: actions.params,
    });
    yield put({
      type: Actions.GET_ORDER_SUCCESS,
      data: res.data.data,
      total: res.data.total,
    });

  } catch (error) {
    yield put({ type: Actions.GET_ORDER_FAIL });
  }
}

function* putOrderProcess(actions) {
  try {
    const { token } = yield users.getListUser();
    const { partner_id } = yield userInfo.getListUser();
    const url = `${BaseUrl.URL_v1_0}/Order/${actions.order_id}/OrderItem/processing`;
    const res = yield axios.put(url, actions.body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const {
      item_name,
      table_name,
      table_id,
      order_id,
      item_id,
      area_id,
      customer_name,
      items,
    } = actions.notification;

    yield put({
      type: Actions.ORDER_PROCESSING_SUCCESS,
      data: res.data.data,
    });


    if (actions.order_item_id) {
      yield put({
        type: Actions.UPDATE_PROCESS,
        id: actions.order_id,
        item_id: actions.order_item_id,
      });

      yield put({
        type: Actions.NOTIFICATION,
        body: {
          title: 'Xác nhận món khách hàng gọi',
          content: `Món ${item_name} do khách hàng ${customer_name} yêu cầu tại bàn ${table_name} đã được xác nhận`,
          action: 'confirm_item',
          type_notification: '1',
          link: '',
          body_data: {
            table_id,
            order_id,
            item_id,
            action: 'confirm_item',
            area_id
          },
          partner_id,
          table_id,
          area_id,
          topic: `area_${area_id}`,
          list_user_push_noti: [],
          is_push_noti: '1',
        },
      });

    } else {
      yield put({
        type: Actions.UPDATE_PROCESS_ALL,
        id: actions.order_id,
      });
      yield put({
        type: Actions.NOTIFICATION,
        body: {
          title: 'Xác nhận món khách hàng gọi',
          content: `Các món do khách hàng ${customer_name} yêu cầu tại bàn ${table_name} đã được xác nhận`,
          action: 'confirm_item',
          type_notification: '1',
          link: '',
          body_data: {
            table_id,
            order_id,
            items,
            action: 'confirm_item',
            area_id
          },
          partner_id,
          table_id,
          area_id,
          topic: `area_${area_id}`,
          list_user_push_noti: [],
          is_push_noti: '1',
        },
      });
    }

  } catch (error) {
    yield put({ type: Actions.ORDER_PROCESSING_FAIL });
  }
}

function* putOrderCancel(actions) {
  try {
    const { token } = yield users.getListUser();
    const { partner_id } = yield userInfo.getListUser();
    const url = `${BaseUrl.URL_v1_0}/Order/${actions.order_id}/OrderItem/${actions.order_item_id}/canceled`;
    const res = yield axios.put(url, actions.body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put({
      type: Actions.ORDER_CANCEL_SUCCESS,
      data: res.data.data,
    });
    yield put({
      type: Actions.UPDATE_PROCESS,
      id: actions.order_id,
      item_id: actions.item_id,
    });
    const {
      item_name,
      table_name,
      table_id,
      order_id,
      item_id,
      area_id,
    } = actions.notification;
    yield put({
      type: Actions.NOTIFICATION,
      body: {
        title: 'Hủy món',
        content: `Món ${item_name} ở bàn ${table_name} đã được hủy`,
        action: 'confirm_item',
        type_notification: '1',
        link: '',
        body_data: {
          table_id,
          order_id,
          item_id,
          action: 'confirm_item',
        },
        partner_id,
        table_id,
        area_id,
        topic: `area_${area_id}`,
        list_user_push_noti: [],
        is_push_noti: '1',
      },
    });
  } catch (error) {
    yield put({ type: Actions.ORDER_CANCEL_FAIL });
  }
}

function* putNotification(actions) {
  try {
    const { token } = yield users.getListUser();
    const url = `${BaseUrl.URL_v1_1}/Notification`;
    const res = yield axios.post(url, actions.body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put({
      type: Actions.NOTIFICATION_SUCCESS,
      data: res.data.data,
    });

  } catch (error) {
    yield put({ type: Actions.NOTIFICATION_FAIL });
  }
}

function* getPrintChickenBar(actions) {
  try {
    const { token } = yield users.getListUser();
    const url = `${BaseUrl.URL_v1_0}/PrinterChickenBar`;

    const { partner_id } = yield userInfo.getListUser();
    const res = yield axios.get(url, {
      headers: {
        get: {
          Authorization: `Bearer ${token}`,
        },
      },
      params: { partner_id, ...actions.params },
    });

    yield put({
      type: Actions.GET_PRINT_CHICKEN_BAR_SUCCESS,
      data: res.data.data,
    });

   // let dataReceip = action.dataReceipCook;
    // dataReceip={
    //   ...dataReceip,
    //   body: {
    //     ...dataReceip.body,
    //     printer_id: res.data.data[0].printer_chicken_bars[0].id,
    //   }
    // }
   // console.log(dataReceip)

  } catch (error) {
    yield put({ type: Actions.GET_PRINT_CHICKEN_BAR_FAIL });
  }
}

function* getPrintChickenBarById(actions) {
  try {
    const { token } = yield users.getListUser();
    const url = `${BaseUrl.URL_v1_0}/PrinterChickenBar`;
    const res = yield axios.get(url, {
      headers: {
        get: {
          Authorization: `Bearer ${token}`,
        },
      },
      params: actions.params,
    });
    yield put({
      type: Actions.GET_PRINT_CHICKEN_BAR_BY_ID_SUCCESS,
      data: res.data.data,
    });
  } catch (error) {
    yield put({ type: Actions.GET_PRINT_CHICKEN_BAR_BY_ID_FAIL });
  }
}


function* postReceiptCook(actions) {
  try {
    const { token } = yield users.getListUser();
    const url = `${BaseUrl.URL_v1_0}/Order/${actions.order_id}/ReceiptCook`;
    const res = yield axios.put(url, actions.body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    yield put({
      type: Actions.RECEIPT_COOK_SUCCESS,
      data: res.data.data,
    });
  } catch (error) {
    yield put({ type: Actions.RECEIPT_COOK_FAIL });
  }
}

export function* watchOrderSagas() {
  yield takeLatest(Actions.GET_ORDER, getOrder);
  yield takeLatest(Actions.ORDER_PROCESSING, putOrderProcess);
  yield takeLatest(Actions.ORDER_CANCEL, putOrderCancel);
  yield takeLatest(Actions.NOTIFICATION, putNotification);
  yield takeLatest(Actions.GET_PRINT_CHICKEN_BAR, getPrintChickenBar);
  yield takeLatest(Actions.GET_PRINT_CHICKEN_BAR_BY_ID, getPrintChickenBarById);
  yield takeLatest(Actions.RECEIPT_COOK, postReceiptCook);
}
