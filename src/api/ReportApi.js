import axios from 'axios';
import BaseUrl from './BaseUrl';
import { users, userInfo } from '../stores';

/** Báo cáo tổng quan */
const getOverviewReport = async () => {
  const { partner_id } = await userInfo.getListUser();
  const { token } = await users.getListUser();
  const url_table = `${BaseUrl.URL_v1_0}/Report/RevenueByGeneral?partner_id=${partner_id}`;
  const res = await axios.get(url_table, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data
};

/** Báo cáo số khách và bàn ngày hiện tại */
const GuestTableByCurrentDate = async () => {
  const { partner_id } = await userInfo.getListUser();
  const { token } = await users.getListUser();
  const url = `${BaseUrl.URL_v1_0}/Report/GuestTableByCurrentDate?partner_id=${partner_id}`;
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data
};

/** Báo cáo thống kê khách và bàn từ ngày tới ngày*/
const GuestTableByDate = async (from_date, to_date) => {
  const { partner_id } = await userInfo.getListUser();
  const { token } = await users.getListUser();
  const url = `${BaseUrl.URL_v1_0}/Report/GuestTableByDate?partner_id=${partner_id}&from_date=${from_date}&to_date=${to_date}&language=vi`;
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data
};

/** Báo cáo thống kê doanh thu trong ngày*/
const RevenueByDate = async (from_date, to_date) => {
  const { partner_id } = await userInfo.getListUser();
  const { token } = await users.getListUser();
  const url = `${BaseUrl.URL_v1_0}/Report/RevenueByDate?partner_id=${partner_id}&from_date=${from_date}&to_date=${to_date}&language=vi`;
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data
};

/** Top 5 đồ ăn doanh thu trong ngày */
const RevenueTopFoodByDate = async (from_date, to_date) => {
  const { partner_id } = await userInfo.getListUser();
  const { token } = await users.getListUser();
  const url = `${BaseUrl.URL_v1_0}/Report/RevenueTopFoodByDate?partner_id=${partner_id}&from_date=${from_date}&to_date=${to_date}&language=vi`;

  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data
};

/** Top 5 đồ uống doanh thu trong ngày */
const RevenueTopDrinkByDate = async (from_date, to_date) => {
  const { partner_id } = await userInfo.getListUser();
  const { token } = await users.getListUser();
  const url = `${BaseUrl.URL_v1_0}/Report/RevenueTopDrinkByDate?partner_id=${partner_id}&from_date=${from_date}&to_date=${to_date}&language=vi`;
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data
};

/** Thông kê danh sách nhân viên checkin  */
const totalStaffCheckInByDate = async (from_date, to_date) => {
  const { partner_id } = await userInfo.getListUser();
  const { token } = await users.getListUser();
  const url = `${BaseUrl.URL_v1_0}/Report/TotalStaffCheckInByDate?partner_id=${partner_id}&from_date=${from_date}&to_date=${to_date}&language=vi`;
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data
};

/** Thông kê danh sách nhân viên đang làm việc trong tuần */
const totalStaffWorkingByDate = async (from_date, to_date) => {
  const { partner_id } = await userInfo.getListUser();
  const { token } = await users.getListUser();
  const url = `${BaseUrl.URL_v1_0}/Report/TotalStaffWorkingByDate?partner_id=${partner_id}&from_date=${from_date}&to_date=${to_date}&language=vi`;
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data
};

/** Doanh thu các ngày trong tháng */
const revenueByMonth = async (from_date, to_date) => {
  const { partner_id } = await userInfo.getListUser();
  const { token } = await users.getListUser();
  const url = `${BaseUrl.URL_v1_0}/Report/RevenueByMonth?partner_id=${partner_id}&from_date=${from_date}&to_date=${to_date}&language=vi`;
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data
};

/** Doanh thu các tháng trong năm*/
const revenueByYear = async (from_date, to_date) => {
  const { partner_id } = await userInfo.getListUser();
  const { token } = await users.getListUser();
  const url = `${BaseUrl.URL_v1_0}/Report/revenueByYear?partner_id=${partner_id}&from_date=${from_date}&to_date=${to_date}&language=vi`;
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data
};

/** Báo cáo tổng quan */
const totalVoteOfPartner= async () => {
  const { partner_id } = await userInfo.getListUser();
  const { token } = await users.getListUser();
  const url_table = `${BaseUrl.URL_v1_0}/Report/TotalVote?partner_id=${partner_id}&language=vi`;
  const res = await axios.get(url_table, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data
};



export default {
  getOverviewReport,
  RevenueByDate,
  GuestTableByDate,
  GuestTableByCurrentDate,
  RevenueTopFoodByDate,
  RevenueTopDrinkByDate,
  totalStaffCheckInByDate,
  totalStaffWorkingByDate,
  revenueByMonth,
  revenueByYear,
  totalVoteOfPartner
};