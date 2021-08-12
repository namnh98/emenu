import axios from 'axios';
import BaseUrl from './BaseUrl';
import {users, userInfo} from '../stores';

/**
 *
 * Danh sách dat ban
 */
const getListBooking = async (params) => {
  try {
    const {
      index,
      page_size,
      status,
      guest_name,
      phone_number,
      from_date,
      to_date,
    } = params;

    const {token} = await users.getListUser();
    const {partner_id} = await userInfo.getListUser();
    // let url = `${BaseUrl.URL_v1_0}/Booking?Booking?language=vi&partner_id=${partner_id}&index=${index}&page_size=${page_size}`;
    let url = `${BaseUrl.URL_v1_0}/Booking?language=vi&index=${index}&page_size=${page_size}`;

    if (status != '') {
      url += `&status=${status}`;
    }
    if (guest_name != '') {
      url += `&guest_name=${guest_name}`;
    }
    if (phone_number != '') {
      url += `&phone_number=${phone_number}`;
    }
    if (from_date != '') {
      url += `&from_date=${from_date}`;
    }
    if (to_date != '') {
      url += `&to_date=${to_date}`;
    }
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log('Err @getListBooking', error);
    return [];
  }
};

/**
 *
 * Booking by id
 */
const getBookingById = async (id) => {
  try {
    const {token} = await users.getListUser();
    let url = `${BaseUrl.URL_v1_0}/Booking/${id}?language=vi`;

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error) {
    console.log('Err @getBookingById', error);
    return [];
  }
};

/** tạo mới booking */
const createBookingTable = async (data) => {
  try {
    const {token} = await users.getListUser();
    const url = `${BaseUrl.URL_v1_0}/Booking?language=vi`;
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.post(url, data, header);
    return res.data.data;
  } catch (error) {
    console.log('Err @createBookingTable', error);
  }
};

/** update booking */
const updateBookingTable = async (booking_id, data) => {
  try {
    const {token} = await users.getListUser();
    const url = `${BaseUrl.URL_v1_0}/Booking/${booking_id}?language=vi`;
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.put(url, data, header);
    return res.data.data;
  } catch (error) {
    console.log('Err @updateBookingTable', error);
  }
};

/** update trạng thái booking */
const updateStatusBooking = async (booking_id, status, note_update_status) => {
  try {
    const {token} = await users.getListUser();
    const url = `${BaseUrl.URL_v1_0}/Booking/${booking_id}/Status?language=vi`;
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const data = {status, note_update_status};
    const res = await axios.put(url, data, header);
    return res.data.data;
  } catch (error) {
    console.log('Err @updateStatusBooking', error);
  }
};

/**
 *
 * Danh sách bàn của booking
 */
const getListTableOfBooking = async (booking_id) => {
  try {
    const {token} = await users.getListUser();
    let url = `${BaseUrl.URL_v1_0}/Booking/${booking_id}/BookingTable?language=vi`;

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error) {
    console.log('Err @getListTableOfBooking', error);
  }
};

/** Sắp xếp bàn cho booking*/
const sortTableOfBooking = async (booking_id, table_ids) => {
  try {
    const {token} = await users.getListUser();
    const {partner_id} = await userInfo.getListUser();
    const url = `${BaseUrl.URL_v1_0}/Booking/${booking_id}/BookingTable?language=vi`;
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const data = {
      table_ids: table_ids,
      partner_id,
    };
    const res = await axios.post(url, data, header);
    return res.data.data;
  } catch (error) {
    console.log('Err @sortTableOfBooking', error);
  }
};

const pushNotiConfirmOrCancelBooking = async (
  isCancel,
  id,
  customer_name,
  area_id,
  customer_tel,
  reason,
) => {
  try {
    const url = `${BaseUrl.URL_v1_1}/Notification`;
    const {token} = await users.getListUser();
    const {partner_id} = await userInfo.getListUser();
    const data = {
      title: isCancel ? 'Huỷ đặt bàn' : 'Xác nhận đặt bàn',
      content: isCancel
        ? `Khách hàng ${customer_name} vừa huỷ đặt bàn`
        : `Nhân viên vừa xác nhận đơn đặt bàn của khách hàng ${customer_name}`,
      action: isCancel ? 'cancel_booking_table' : 'confirm_booking_table',
      type_notification: '1',
      link: '',
      body_data: {
        id,
        customer_name,
        action: isCancel ? 'cancel_booking_table' : 'confirm_booking_table',
        area_id,
        customer_tel,
        reason,
      },
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
    console.log('Err@ pushNotiConfirmOrCancelBooking', error);
  }
};
const pushNotiConfirmCustIntoTable = async (
  id,
  customer_name,
  customer_tel,
  tables,
) => {
  try {
    const url = `${BaseUrl.URL_v1_1}/Notification`;
    const {token} = await users.getListUser();
    const {partner_id} = await userInfo.getListUser();
    const data = {
      title: 'Khách đã vào bàn',
      content: `Khách hàng ${customer_name} đã vào bàn ${tables[0].name} đã đặt`,
      action: 'confirm_reservation_into_table',
      type_notification: '1',
      link: '',
      body_data: {
        booking_id: id,
        action: 'confirm_reservation_into_table',
        customer_name,
        customer_tel,
        tables: JSON.stringify(tables),
      },
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
    console.log('Err@ pushNotiConfirmCustIntoTable', error);
  }
};

export default {
  getListBooking,
  getBookingById,
  createBookingTable,
  updateBookingTable,
  updateStatusBooking,
  getListTableOfBooking,
  sortTableOfBooking,
  pushNotiConfirmOrCancelBooking,
  pushNotiConfirmCustIntoTable,
};
