import axios from 'axios';
import BaseUrl from './BaseUrl';
import {userInfo, users} from '../stores';

const postOrderFood = async (
  tableName,
  table_id,
  area_id,
  order_items,
  order_id,
  customer_name,
) => {
  try {
    const {token} = await users.getListUser();

    const url = `${BaseUrl.URL_v1_1}/Notification`;
    const data = {
      title: 'Gọi món',
      content: tableName
        ? `Bàn ${tableName} vừa gọi món ăn`
        : `Khách hàng ${customer_name} vừa gọi món ăn mang về`,
      action: 'staff_order_item',
      type_notification: '1',
      link: '',
      body_data: {
        table_id,
        area_id,
        action: 'staff_order_item',
        order_items: JSON.stringify(order_items),
        order_id,
        customer_name,
      },
      topic: `area_${area_id}`,
      list_user: [],
      is_push_noti: '1',
    };
    const res = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.log('Err @postNotiOrderFood ', error);
    return null;
  }
};

const confirmFood = async (params) => {
  try {
    const {token} = await users.getListUser();
    const {partner_id} = await userInfo.getListUser();

    const {itemName, tableName, tableId, orderId, itemId, areaId} = params;

    const url = `${BaseUrl.URL_v1_1}/Notification`;
    const data = {
      title: 'Xác nhận món ăn',
      content: `Món ${itemName} của bàn ${tableName} vừa được xác nhận`,
      action: 'delivery_item',
      type_notification: '1',
      link: '',
      body_data: {
        table_id: tableId,
        order_id: orderId,
        item_id: itemId,
        action: 'delivery_item',
      },
      partner_id,
      table_id: tableId,
      area_id: areaId,
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
    console.log('Err @postShipFood ', error);
    return null;
  }
};
const postShipFood = async (params) => {
  try {
    const {token} = await users.getListUser();
    const {partner_id} = await userInfo.getListUser();

    const {itemName, tableName, tableId, orderId, itemId, areaId} = params;

    const url = `${BaseUrl.URL_v1_1}/Notification`;
    const data = {
      title: 'Giao món',
      content: `Món ${itemName} đã giao cho bàn ${tableName}`,
      action: 'delivery_item',
      type_notification: '1',
      link: '',
      body_data: {
        table_id: tableId,
        order_id: orderId,
        item_id: itemId,
        action: 'delivery_item',
      },
      partner_id,
      table_id: tableId,
      area_id: areaId,
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
    console.log('Err @postShipFood ', error);
    return null;
  }
};

const postDeleteFood = async (params) => {
  try {
    const {token} = await users.getListUser();
    const {partner_id} = await userInfo.getListUser();

    const {itemName, tableName, tableId, orderId, itemId, areaId} = params;

    const url = `${BaseUrl.URL_v1_1}/Notification`;
    const data = {
      title: 'Hủy món',
      content: `Bàn ${tableName} vừa thực hiện hủy món ${itemName}`,
      action: 'cancel_item',
      type_notification: '1',
      link: '',
      body_data: {
        table_id: tableId,
        order_id: orderId,
        item_id: itemId,
        action: 'cancel_item',
      },
      partner_id,
      table_id: tableId,
      area_id: areaId,
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
    console.log('Err @postDeleteFood ', error);
    return null;
  }
};

const updateQtyFood = async (params) => {
  try {
    const {token} = await users.getListUser();
    const {partner_id} = await userInfo.getListUser();

    const {itemName, tableName, tableId, orderId, itemId, areaId, itemQty} =
      params || {};
    const url = `${BaseUrl.URL_v1_1}/Notification`;
    const data = {
      title: 'Cập nhật số lượng món',
      content: `Bàn ${tableName} vừa thực hiện cập nhật số lượng món ${itemName}`,
      action: 'change_item',
      type_notification: '1',
      link: '',
      body_data: {
        table_id: tableId,
        order_id: orderId,
        item_id: itemId,
        qty: itemQty.toString(),
        action: 'change_item',
      },
      partner_id,
      table_id: tableId,
      area_id: areaId,
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
    console.log('Err @updateQtyFood ', error);
    return null;
  }
};

const postPayment = async (params) => {
  try {
    const {token} = await users.getListUser();
    const {partner_id} = await userInfo.getListUser();

    const {
      table_name,
      table_id,
      order_id,
      bill_id,
      area_id,
      isTakeAway,
      order_no,
    } = params || {};

    const url = `${BaseUrl.URL_v1_1}/Notification`;
    const data = {
      title: isTakeAway ? 'Thanh toán hóa đơn mang về' : 'Thanh toán',
      content: isTakeAway
        ? `Hóa đơn ${order_no} vừa được thanh toán`
        : `Bàn ${table_name} vừa thực hiện thanh toán thành công`,
      action: 'finished_payment',
      type_notification: '1',
      link: '',
      body_data: {
        table_id: table_id || '',
        order_id: order_id || '',
        bill_id: bill_id || '',
        action: 'finished_payment',
        order_no: order_no || '',
      },
      partner_id,
      area_id,
      topic: `area_${area_id}`,
      // topic: `partner_${partner_id}`,
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
    console.log('Err @postPayment ', error);
    return null;
  }
};

// tạo noti khi booking thành công
const pushNotiCreateBooking = async (partner_id, booking_id, content) => {
  try {
    const url = `${BaseUrl.URL_v1_1}/Notification`;
    const {token} = await users.getListUser();
    const data = {
      title: 'Đặt bàn',
      content,
      action: 'reservation',
      type_notification: '1',
      link: '',
      body_data: {
        action: 'reservation',
        booking_id,
      },
      partner_id,
      topic: `partner_${partner_id}`,
      list_user: [],
      is_push_noti: '1',
    };
    const res = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.log('Err @pushNotiCreateBooking ', error);
    return null;
  }
};

const postNotiConfirmUser = async (table_id, order_id, area_id, userId) => {
  try {
    const url = `${BaseUrl.URL_v1_1}/Notification`;
    const {token} = await users.getListUser();
    const {partner_id} = await userInfo.getListUser();
    const data = {
      title: 'Xác nhận vào bàn',
      content: 'Yêu cầu vào bàn đã được xác nhận',
      action: 'confirm_into_table',
      type_notification: '3',
      link: '',
      body_data: {
        action: 'confirm_into_table',
        table_id,
        order_id,
      },
      partner_id,
      table_id,
      area_id,
      topic: `area_${area_id}`,
      list_user_push_noti: [userId],
      is_push_noti: '1',
    };
    const res = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.log('Err @postNotiConfirmUser ', error);
    return null;
  }
};

const postConfirmOrderItem = async (params) => {
  try {
    const {token} = await users.getListUser();
    const {partner_id} = await userInfo.getListUser();

    const {itemName, tableName, tableId, orderId, itemId, areaId} = params;

    const url = `${BaseUrl.URL_v1_1}/Notification`;
    const data = {
      title: 'Xác nhận món khách hàng gọi',
      content: `Món ${itemName} ở bàn ${tableName} đã được xác nhận`,
      action: 'confirm_item',
      type_notification: '1',
      link: '',
      body_data: {
        table_id: tableId,
        order_id: orderId,
        item_id: itemId,
        action: 'confirm_item',
      },
      partner_id,
      table_id: tableId,
      area_id: areaId,
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
    console.log('Err @postDeleteFood ', error);
    return null;
  }
};

export default {
  postOrderFood,
  postShipFood,
  postDeleteFood,
  updateQtyFood,
  postPayment,
  pushNotiCreateBooking,
  postNotiConfirmUser,
  postConfirmOrderItem,
  confirmFood,
};
