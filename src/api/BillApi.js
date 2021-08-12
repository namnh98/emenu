import axios from 'axios';
import BaseUrl from './BaseUrl';
import {users, userInfo} from '../stores';

/**
 *
 * Danh sách bill
 */
const getListBill = async (table_id) => {
  try {
    const {token} = await users.getListUser();
    const {partner_id} = await userInfo.getListUser();
    const url = `${BaseUrl.URL_v1_0}/Bill?language=vi&partner_id=${partner_id}&table_id=${table_id}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  } catch (error) {
    console.log('Err @getBill', error);
    return [];
  }
};

const deleteBillById = async (billId, value) => {
  try {
    const {token} = await users.getListUser();
    const url = `${BaseUrl.URL_v1_0}/Bill/${billId}/canceled?language=vi`;
    const data = {reason: value};
    const res = await axios.put(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.log('Err @deleteOrder ', error);
    return null;
  }
};

const pushNotiDelBill = async (table_id, tableName, id, area_id) => {
  try {
    const url = `${BaseUrl.URL_v1_1}/Notification`;
    const {token, partner_id} = await users.getListUser();
    const data = {
      title: 'Hủy Thanh toán ',
      content: `Bàn ${tableName} vừa thực hiện hủy thanh toán`,
      action: 'cancel_payment',
      type_notification: '1',
      link: '',
      body_data: {
        table_id,
        id,
        action: 'cancel_payment',
      },
      partner_id,
      table_id,
      area_id,
      topic: `area_${area_id}`,
      list_user_push_noti: [],
      is_push_noti: '1',
    };
    const res = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.log('Err @pushNotiDelBill ', error);
    return null;
  }
};

const getBillByOrderId = async (id) => {
  try {
    const {token} = await users.getListUser();
    const url = `${BaseUrl.URL_v1_0}/Bill?language=vi&order_id=${id}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error) {
    console.log('Err when get bill by orderId:', error);
  }
};

const getReceiptString = async (billId, printerId) => {
  try {
    const {token} = await users.getListUser();
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `${BaseUrl.URL_v1_0}/Bill/${billId}/receipt?language=vi&printer_id=${printerId}`;
    const res = await axios.get(url, headers);
    return res.data;
  } catch (error) {
    console.log('Err @GetReceiptFormat', error);
  }
};

const getPrinters = async (area_id) => {
  try {
    const {token} = await users.getListUser();
    const {UserAreas, partner_id} = await userInfo.getListUser();
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `${BaseUrl.URL_v1_0}/PrinterBill?partner_id=${partner_id}&area_id=${area_id}&language=vi`;
    const res = await axios.get(url, headers);
    return res.data.data;
  } catch (error) {
    console.log('Err @GetListPrinters', error);
  }
};

export default {
  getListBill,
  deleteBillById,
  pushNotiDelBill,
  getBillByOrderId,
  getReceiptString,
  getPrinters,
};
