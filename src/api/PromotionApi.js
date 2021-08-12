import axios from 'axios';
import {users, userInfo} from '../stores';
import BaseUrl from './BaseUrl';

const getPromotionCategory = async (partnerId) => {
  try {
    const urlApi = `${BaseUrl.URL_v1_0}/Promotion/PromotionComboItem?partner_id=${partnerId}`;
    const {token} = await users.getListUser();
    const res = await axios.get(urlApi, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error) {
    console.log('Err, @getPromotionCategory ', error);
    return [];
  }
};

const getPromotionFood = async () => {
  try {
    const {token} = await users.getListUser();
    const {partner_id} = await userInfo.getListUser();
    const urlApi = `${BaseUrl.URL_v1_0}/Promotion/PromotionItem?partner_id=${partner_id}`;
    const res = await axios.get(urlApi, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error) {
    console.log('Err, @getPromotionFood ', error);
    return [];
  }
};

export default {getPromotionCategory, getPromotionFood};
