import axios from 'axios';
import BaseUrl from './BaseUrl';
import { users } from '../stores';

const getListNotify = async (
  index,
  size,
  action,
  status_action,
  topic,
  status,
) => {
  try {
    const user = await users.getListUser();
    let url = `${BaseUrl.URL_v1_1}/Notification?language=vi&index=${index}&page_size=${size}`;
    if (action) {
      url += `&action=${action}`;
    }
    if (status_action) {
      url += `&status_action=${status_action}`;
    }
    if (status) {
      url += `&status=${status}`;
    }
    if (topic) {
      url += `&topic=${topic}`;
    }
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    if (res.data) {
      return res.data;
    }
  } catch (error) {
    console.log('error', error);
    return null;
  }
};

const changeStatusNotify = async (notify_id, status) => {
  try {
    const url = `${BaseUrl.URL_v1_1}/Notification/${notify_id}/ChangeStatus?language=vi&status=${status}&is_topic=true`;
    const user = await users.getListUser();
    const res = await axios.put(url, null, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    return res;
  } catch (error) {
    console.log('Err @ChangeStatus ', error);
    return null;
  }
};

const deleteNotify = async (notify_id) => {
  try {
    const url = `${BaseUrl.URL_v1_1}/Notification/${notify_id}`;
    const user = await users.getListUser();
    const res = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    return res;
  } catch (error) {
    console.log('Err @DeleteNotify ', error);
    return null;
  }
};

//https://api-stg.omenu.vn/api/v1.1/Notification/0e7e989f-403c-4ff6-949e-969a6d700801/ChangeActionStatus?language=vi&status_action=2&is_topic=false

const updateHandledStatusNoti = async (id, status) => {
  try {
    const { token } = await users.getListUser();
    const url = `${BaseUrl.URL_v1_1}/Notification/${id}/ChangeActionStatus?language=vi&status_action=${status}&is_topic=true`;
    const res = await axios.put(url, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log('Err@ChangeHandledStatusNoti ', error);
  }
};

export default {
  getListNotify,
  changeStatusNotify,
  deleteNotify,
  updateHandledStatusNoti,
};
