import axios from 'axios';
import BaseUrl from './BaseUrl';
import {userInfo, users} from '../stores';

const getComboFoods = async () => {
  try {
    const url = `${BaseUrl.URL_v1_0}/Order/ComboItem?language=vi&page=1&limit=40`;
    const {token} = await users.getListUser();
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error) {
    console.log('Err @getComboFoods ', error);
    return [];
  }
};

const getComboItemById = async (combo_id) => {
  try {
    const url = `${BaseUrl.URL_v1_0}/Order/ComboItem/${combo_id}/Item`;
    const {token} = await users.getListUser();
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  } catch (error) {
    console.log('Err @getComboItemById ', error);
    return [];
  }
};

const getFoods = async () => {
  try {
    const {token} = await users.getListUser();
    const {partner_id} = await userInfo.getListUser();

    const url = `${BaseUrl.URL_v1_0}/Order/Item?partner_id=${partner_id}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error) {
    console.log('Err @getFoods ', error);
    return [];
  }
};

export default {getComboFoods, getComboItemById, getFoods};
