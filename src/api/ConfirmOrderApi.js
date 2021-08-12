import axios from 'axios';
import BaseUrl from './BaseUrl';
import { users, userInfo } from '../stores';

/**
 *
 * Get list getOrderKickenBar
 */
const getOrderKickenBar = async (statusId) => {
  try {
    const { token } = await users.getListUser();
    const { partner_id } = await userInfo.getListUser();
    let url = `${BaseUrl.URL_v1_0}/Order/KitchenBar?partner_id=${partner_id}&order_item_status_id=${statusId}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error) {
    console.log('Err @getOrderKickenBar', error);
    return [];
  }
};

/** update booking */
const updateProcessingItems = async (orderId, data) => {
  try {
    const { token } = await users.getListUser();
    const url = `${BaseUrl.URL_v1_0}/Order/${orderId}/OrderItem/processing?language=vi`;
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.put(url, data, header);
    return res.data.data;
  } catch (error) {
    console.log('Err @updateProcessingItems', error);
  }
};

/** getPrintChickenBar */
const getPrintChickenBar = async (area_id) => {
  try {    
    const { token } = await users.getListUser();
    const { partner_id } = await userInfo.getListUser();
    const url = `${BaseUrl.URL_v1_0}/PrinterChickenBar?partner_id=${partner_id}&area_id=${area_id}`;   
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error) {
    console.log('Err @getPrintChickenBar', error);
  }
};

/** postReceiptCook */
const postReceiptCook = async (orderId, data) => {
  try {
    const { token } = await users.getListUser();
    const url = `${BaseUrl.URL_v1_0}/Order/${orderId}/ReceiptCook?language=vi`;
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.post(url, data, header);
    return res.data.data;
  } catch (error) {
    console.log('Err @postReceiptCook', error);
  }
};


export default {
  getOrderKickenBar,
  updateProcessingItems,
  getPrintChickenBar,
  postReceiptCook
};
