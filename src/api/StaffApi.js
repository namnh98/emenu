import axios from 'axios';
import BaseUrl from './BaseUrl';
import {users, userInfo} from '../stores';

const gitShifts = async (staffId, fromDate, toDate) => {
  try {
    const {token} = await users.getListUser();
    const url = `${BaseUrl.URL_v1_1}/Calendar/User/${staffId}/?language=vi&from_date=${fromDate}&to_date=${toDate}`;
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(url, header);

    return res.data.data;
  } catch (error) {
    console.log('Err@GetShifts', error);
  }
};

const CheckIn = async (data) => {
  try {
    const {token} = await users.getListUser();
    const {partner_id} = await userInfo.getListUser();
    const url = `${BaseUrl.URL_v1_1}/Partner/${partner_id}/CheckInOut?language=vi`;
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.post(url, data, header);
    return res.data;
  } catch (error) {
    console.log('Err@CheckIn', error);
  }
};

const CheckInStatus = async (userId, shiftId, date) => {
  try {
    const {token} = await users.getListUser();
    const {partner_id} = await userInfo.getListUser();
    const url = `${BaseUrl.URL_v1_1}/Partner/${partner_id}/CheckInOut/Status?language=vi&user_id=${userId}&shift_id=${shiftId}&check_in_out_at=${date}`;
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(url, header);
    // console.log(url);
    return res.data.data;
  } catch (error) {
    console.log('Err@CheckInStatus', error);
  }
};

const getListShiftStatus = async (userId, date, pageSize) => {
  try {
    const {token} = await users.getListUser();
    const {partner_id} = await userInfo.getListUser();

    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `${BaseUrl.URL_v1_1}/Partner/${partner_id}/CheckInOut?language=vi&index=0&page_size=${pageSize}&user_id=${userId}&check_in_out_at=${date}`;
    const res = await axios.get(url, header);
    return res.data.data;
  } catch (error) {
    console.log('Err@GetListShiftStatus', error);
  }
};

export default {
  gitShifts,
  CheckIn,
  CheckInStatus,
  getListShiftStatus,
};
