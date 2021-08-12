import axios from 'axios';
import BaseUrl from './BaseUrl';
import { users, userInfo } from '../stores';

const putPartnerSetting = async (data) => {
  try {
    const { partner_id } = await userInfo.getListUser();
    const { token } = await users.getListUser();
    const url = `${BaseUrl.URL_v1_0}/Partner/${partner_id}/PartnerSetting`;

    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axios.put(url, data, header);
    return res.data.data;

  } catch (error) {
    console.log('Err @putPartnerSetting ', error);
    return null;
  }
};

export default { putPartnerSetting };