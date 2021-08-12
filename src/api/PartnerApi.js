import axios from 'axios';
import BaseUrl from './BaseUrl';
import {users, userInfo} from '../stores';

const getPartnerInfo = async () => {
  try {
    const {partner_id} = await userInfo.getListUser();
    const {token} = await users.getListUser();

    const url_table = `${BaseUrl.URL_v1_0}/Partner/${partner_id}`;
    const res = await axios.get(url_table, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.data.data) {
      return res.data.data;
    }
  } catch (error) {
    console.log('Err @getPartnerInfo ', error);
    return null;
  }
};

const getPartnerSetting = async () => {
  try {
    const {partner_id} = await userInfo.getListUser();
    const {token} = await users.getListUser();
    const url_table = `${BaseUrl.URL_v1_0}/Partner/${partner_id}/PartnerSetting`;
    const res = await axios.get(url_table, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.data.data) {
      return res.data.data;
    }
  } catch (error) {
    console.log('Err @PartnerSetting ', error);
    return null;
  }
};

export default {getPartnerInfo, getPartnerSetting};
