import axios from 'axios';
import BaseUrl from './BaseUrl';
import {users, userInfo} from '../stores';
import {NotifyApi} from '.';

const addOrderFood = async (table_id, order_items = [], _order) => {
  // chinh sua phan order takeaway
  try {
    const {token} = await users.getListUser();
    const {id, partner_id} = await userInfo.getListUser();
    const url = `${BaseUrl.URL_v1_0}/Order`;
    const data = {
      order: {
        user_order_id: id,
        guest_number: 0,
        customer_name: '',
        customer_tel: '',
        note: '',
        table_id,
        partner_id,
        ..._order,
      },
      order_items,
    };
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.post(url, data, header);
    return res.data.data;
  } catch (error) {
    console.log('Err @addOrderFood ', error);
    return null;
  }
};

const addOrderFoodById = async (order_id, priceFoods = [], foods = []) => {
  try {
    const {token} = await users.getListUser();

    const url = `${BaseUrl.URL_v1_0}/Order/${order_id}`;
    const data = {
      order_combo_items: priceFoods,
      order_items: foods,
    };
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axios.post(url, data, header);
    return res;
  } catch (error) {
    console.log('Err @addOrderFoodById ', error);
    return null;
  }
};

const getOrdered = async (
  tableId,
  partnerId,
  pageSize,
  pageIndex,
  otherParams,
) => {
  // console.log(pageIndex);
  try {
    const {token} = await users.getListUser();
    const {partner_id} = await userInfo.getListUser();
    const params = tableId
      ? `table_id=${tableId}`
      : `partner_id=${partner_id}&is_takeaway=true&page=${pageIndex}&limit=${pageSize}`;

    let url = `${BaseUrl.URL_v1_0}/Order?language=vi&${params}`;
    if (otherParams) {
      const {
        order_no,
        customer_name,
        customer_tel,
        order_status_id,
      } = otherParams;
      if (order_no !== '') {
        url += `&order_no=${order_no}`;
      }
      if (customer_name != '') {
        url += `&customer_name=${customer_name}`;
      }
      if (customer_tel != '') {
        url += `&customer_tel=${customer_tel}`;
      }
      if (order_status_id) {
        let list = order_status_id;
        if (order_status_id.includes(35)) {
          url += `&is_delivery_completed=true`;
          list = order_status_id.filter((item) => item != 35);
        }
        url += `&order_status_id=${JSON.stringify(list)}`;
      }
    }
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data; /// Sửa đổi từ res.data.data => res.data để lấy trường total. Những màn hình nào dùng api này thì truy xuất thêm 1 cấp để lấy array data
  } catch (error) {
    console.log('Err @getOrdered ', error);
    return [];
  }
};

const getOrderedById = async (orderId) => {
  try {
    const {token} = await users.getListUser();
    // console.log('token', token);
    const url = `${BaseUrl.URL_v1_0}/Order/${orderId}?language=vi`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error) {
    console.log('Err @getOrderedById ', error);
    return [];
  }
};

/**
 * detlet order by Id
 * @param {*} orderId
 */
const deleteOrderById = async (orderId, value) => {
  try {
    const {token} = await users.getListUser();
    const data = {reason: value};
    const url = `${BaseUrl.URL_v1_0}/Order/${orderId}/canceled?language=vi`;
    const res = await axios.put(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.log('Err @deleteOrderById ', error);
    return null;
  }
};

/**
 * detlet order by Id
 * @param {*} orderId
 */
const deletePaymentOrderById = async (orderId, paymentId) => {
  try {
    const {token} = await users.getListUser();
    const url = `${BaseUrl.URL_v1_0}/Order/${orderId}/PaymentRequest/${paymentId}`;
    const res = await axios.delete(url, {
      data: {
        reason: '',
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.log('Err @deletePayment ', error);
    return null;
  }
};

const deleteFood = async (orderId, itemId, params) => {
  try {
    const {token} = await users.getListUser();
    const url = `${BaseUrl.URL_v1_0}/Order/${orderId}/OrderItem/${itemId}/canceled`;
    const res = await axios.put(url, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res.status === 200 && NotifyApi.postDeleteFood(params);

    return res;
  } catch (error) {
    console.log('Err @deleteFood ', error);
    return null;
  }
};

const updateFood = async (orderId, item, params) => {
  try {
    const {token} = await users.getListUser();
    const url = `${BaseUrl.URL_v1_0}/Order/${orderId}/OrderItem/${item.id}`;
    const res = await axios.put(
      url,
      {
        qty: item.qty,
        price: item.price,
        note: item.note,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    res.status === 200 && NotifyApi.updateQtyFood(params);

    return res;
  } catch (error) {
    console.log('Err @updateFood ', error);
    return null;
  }
};

const updateShipFood = async (orderId, itemId, params) => {
  try {
    const {token} = await users.getListUser();
    const url = `${BaseUrl.URL_v1_0}/Order/${orderId}/OrderItem/completed`;
    const data = [
      {
        order_item_id: itemId,
      },
    ];
    const res = await axios.put(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res.status === 200 && NotifyApi.postShipFood(params);

    return res;
  } catch (error) {
    console.log('Err @updateShipFood ', error);
    return null;
  }
};
const confirmFood = async (orderId, itemId, params) => {
  try {
    const {token} = await users.getListUser();
    const url = `${BaseUrl.URL_v1_0}/Order/${orderId}/OrderItem/processing`;
    const data = [
      {
        order_item_id: itemId,
      },
    ];
    const res = await axios.put(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res.status === 200 && NotifyApi.confirmFood(params);

    return res;
  } catch (error) {
    console.log('Err @updateShipFood ', error);
    return null;
  }
};

const checkVoucher = async (voucherCode) => {
  try {
    const {token} = await users.getListUser();
    const {partner_id} = await userInfo.getListUser();
    const url = `${BaseUrl.URL_v1_0}/Promotion/CheckVoucher?partner_id=${partner_id}&voucher_code=${voucherCode}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.log('Err @checkVoucher ', error);
    return null;
  }
};

const postPayment = async (orderId, order, order_items) => {
  try {
    const {token} = await users.getListUser();
    const url = `${BaseUrl.URL_v1_0}/Order/${orderId}/Payment`;
    const data = {
      order,
      order_items,
    };
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.post(url, data, config);
    return res;
  } catch (error) {
    console.log('Err @postPayment ', error);
    return null;
  }
};

const pushNotiRollbackOrder = async (
  order_no,
  order_id,
  area_id,
  tableId,
  tableName,
) => {
  try {
    const url = `${BaseUrl.URL_v1_1}/Notification`;
    const {token, partner_id} = await users.getListUser();
    const data = {
      title: 'Khôi phục order',
      content: `Order ${order_no}${
        tableId ? ` của bàn ${tableName}` : ''
      } vừa khôi phục thành công`,
      action: 'rollback_order',
      type_notification: '3',
      link: '',
      body_data: {
        order_id,
        order_no,
        action: 'rollback_order',
      },
      partner_id,
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
    console.log('Err@PushNotiRollBack', error);
  }
};

const pushNotiDelOrder = async (
  table_id,
  tableName,
  order_id,
  area_id,
  order_no,
  staff,
) => {
  try {
    console.log(table_id);
    const url = `${BaseUrl.URL_v1_1}/Notification`;
    const {token, partner_id} = await users.getListUser();
    const data = {
      title: tableName ? 'ĐÃ HỦY' : 'Huỷ hoá đơn mang về',
      content: tableName
        ? `Bàn ${tableName} vừa thực hiện hủy order`
        : `Hoá đơn mang về số ${order_no} vừa được huỷ`,
      action: 'cancel_order',
      type_notification: '1',
      link: '',
      body_data: {
        table_id,
        order_id,
        action: 'cancel_order',
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
    console.log('Err @pushNotiDelOrder ', error);
    return null;
  }
};
const pushNotiChangeTable = async (
  orderId,
  orderNo,
  tableName1,
  tableName2,
  areaId,
) => {
  try {
    const url = `${BaseUrl.URL_v1_1}/Notification`;
    const {token, partner_id} = await users.getListUser();
    const data = {
      title: 'Chuyển bàn',
      content: `Order số ${orderNo} của bàn ${tableName2} vừa được chuyển sang bàn ${tableName1}`,
      action: 'tranfer_table',
      type_notification: '1',
      link: '',
      body_data: {
        orderId,
        orderNo,
        action: 'tranfer_table',
      },
      partner_id,
      areaId,
      topic: `area_${areaId}`,
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
    console.log('Err @pushNotiDelOrder ', error);
    return null;
  }
};

const deliveryOrder = async (orderId) => {
  try {
    const {token} = await users.getListUser();
    const url = `${BaseUrl.URL_v1_0}/Order/${orderId}/DeliveryConfirm`;
    const res = await axios.put(url, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.log('Err @deliveryOrder ', error);
    return null;
  }
};

const checkedPayment = async (orderId, listCheckedFood = []) => {
  try {
    const {token} = await users.getListUser();
    const {partner_id} = await userInfo.getListUser();

    const url = `${BaseUrl.URL_v1_0}/Order/CheckPayment/?partner_id=${partner_id}&language=vi`;
    const res = await axios.post(url, listCheckedFood, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  } catch (error) {
    console.log('@Err @CheckedPayment ', error);
  }
};

const rollbackOrder = async (orderId) => {
  try {
    const {token} = await users.getListUser();
    const url = `${BaseUrl.URL_v1_0}/Order/${orderId}/rollback`;
    const res = await axios.put(url, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log('Err@RollBackOrder', error);
  }
};
const changeTable = async (orderId, table) => {
  try {
    const url = `${BaseUrl.URL_v1_0}/Order/${orderId}/TableChanged`;
    const {token} = await users.getListUser();
    const res = await axios.put(url, table, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log('Err@Chagetable', error);
  }
};

const getReceiptString = async (orderId, printerId) => {
  try {
    const {token} = await users.getListUser();
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `${BaseUrl.URL_v1_0}/Order/${orderId}/Receipt?language=vi&printer_id=${printerId}`;
    const res = await axios.get(url, headers);
    return res.data;
  } catch (error) {
    console.log('Err @GetReceiptFormat', error);
  }
};
export default {
  addOrderFood,
  addOrderFoodById,
  getOrdered,
  getOrderedById,
  deleteOrderById,
  deletePaymentOrderById,
  deleteFood,
  updateFood,
  updateShipFood,
  checkVoucher,
  postPayment,
  pushNotiDelOrder,
  deliveryOrder,
  checkedPayment,
  rollbackOrder,
  pushNotiRollbackOrder,
  changeTable,
  pushNotiChangeTable,
  confirmFood,
  getReceiptString,
};
