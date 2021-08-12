import axios from 'axios';
import {users, lastLogin, userInfo} from '../stores';
import BaseUrl from './BaseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DeviceInfoToBase64} from '../common';


let USER;
const urlLogin = `${BaseUrl.URL_v1_1}/Account/Login`;
const urlCheckPass = `${BaseUrl.URL_v1_1}/Account/CheckPasswordStaff`;

// check username
const Login = async (user, device_info) => {
  try {
    const data = {
      username: user.name,
      device_info,
    };
    const headers = {
      headers: {
        'x-client-id': 'e9d698c3-c7fe-4a45-9559-0643a6295598',
        'x-client-secret': '3e9ffa3f04bdebaf',
      },
    };
    const resUser = await axios.post(urlLogin, data, headers);
    if (!resUser || !resUser.data.data) return null;

    return checkPassStaff(resUser.data.data, user.pass);
  } catch (error) {
    console.log('Err @login ', error);
    return null;
  }
};

const LogOut = async () => {
  try {
    const user = await users.getListUser();
    const url = `${BaseUrl.URL_v1_1}/Account/Logout?language=vi`;
    const data = {
      user_id: user.user_id,
      device_id: user.device_id,
    };
    const headers = {
      headers: {
        'x-client-id': 'e9d698c3-c7fe-4a45-9559-0643a6295598',
        'x-client-secret': '3e9ffa3f04bdebaf',
        Authorization: `Bearer ${user.token}`,
      },
    };
    const res = await axios.post(url, data, headers);
    return res;
  } catch (error) {
    console.log('Err @logOut ', error);
    return null;
  }
};

// check password
const checkPassStaff = async (resUser, password) => {
  try {
    USER = resUser;
    const {user_id, device_id, username} = resUser;
    const res = await axios.post(urlCheckPass, {
      user_id,
      username,
      password,
      device_id,
    });

    if (res.data.data) {
      const userInfo = res.data.data;
      if (userInfo.redirect === 1) {
        USER = userInfo;
        await users.setValueUser(userInfo); // save token by user

        await updateDevice(); // update device fcm
        await getUserInfo(); // update device subtopic
      }

      return userInfo;
    }
  } catch (error) {
    console.log('Err @checkPassStaff ', error);
    return null;
  }
};

/* REDIRECT 3 */
// get list device
const getDeviceById = async () => {
  try {
    const urlGetDevice = `${BaseUrl.URL_v1_1}/Account/${USER.user_id}/Device`;
    const res = await axios.get(urlGetDevice);

    if (res.data.data) {
      const old_device_id = res.data.data[0].device_id;
      // console.log('device_id', res.data.data[0].device_id)
      return deleteDevice(old_device_id);
    }
    // console.log('device_id', device_id)
  } catch (error) {
    // console.log('Err @getDeviceById ', error);
    return null;
  }
};
// delete device by id
const deleteDevice = async (old_device_id) => {
  try {
    const url = `${BaseUrl.URL_v1_1}/Account/${USER.user_id}/Device/${old_device_id}?language=vi&new_device_id=${USER.device_id}`;
    const res = await axios.delete(url);

    if (res || res.data.data) {
      const userInfo = res.data.data;
      USER = userInfo;

      await users.setValueUser(userInfo); // save token by user
      await updateDevice(); // update device fcm
      await getUserInfo(); // update device subtopic
    }

    return res;
  } catch (error) {
    console.log('Err @deleteDevice ', error);
    return null;
  }
};

/* POST DEVICE */
// get user info
const getUserInfo = async () => {
  try {
    const url = `${BaseUrl.URL_v1_0}/Account/InfoStaff?language=vi&user_id=${USER.user_id}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${USER.token}`,
      },
    });

    if (res.data.data) {
      const users = res.data.data;
      await lastLogin.setLastLogin(users); // save list user login
      await userInfo.setValueUser(users); // save user info as as fullName, id, birthday

      const {UserAreas} = users;
      if (UserAreas.length) {
        UserAreas.map(({area_id}) => {
          subTopicFcm(area_id, users.partner_id);
        });
      }
    }
  } catch (error) {
    console.log('Err @getUserInfo ', error);
    return null;
  }
};

// update device
const updateDevice = async () => {
  try {
    const urlGetDevice = `${BaseUrl.URL_v1_1}/Account/${USER.user_id}/Device`;
    const device_info = DeviceInfoToBase64();
    const token_fcm = await AsyncStorage.getItem('@fcmToken');

    const data = {
      device_info,
      device_id: USER.device_id,
      token_fcm,
    };
    const res = await axios.put(urlGetDevice, data, {
      headers: {
        Authorization: `Bearer ${USER.token}`,
        'x-client-id': 'e9d698c3-c7fe-4a45-9559-0643a6295598',
        'x-client-secret': '3e9ffa3f04bdebaf',
      },
    });

    if (res && res.status === 200) {
      console.log('@updateDevice ', res.status);
    }
  } catch (error) {
    console.log('Err @updateDevice ', error.message);
    return null;
  }
};

// sub topic
const subTopicFcm = async (area_id, partner_id) => {
  try {
    const topic = `area_${area_id}`;
    const topicPartner = `partner_${partner_id}`;
    const topicReport = `report_${partner_id}`;

    const urlSubTopic = `${BaseUrl.URL_v1_1}/Notification/SubTopic?language=vi`;

    await axios.post(
      urlSubTopic,
      {
        topic,
      },
      {
        headers: {
          Authorization: `Bearer ${USER.token}`,
        },
      },
    );

    await axios.post(
      urlSubTopic,
      {
        topic: topicPartner,
      },
      {
        headers: {
          Authorization: `Bearer ${USER.token}`,
        },
      },
    );

    await axios.post(
      urlSubTopic,
      {
        topic: topicReport,
      },
      {
        headers: {
          Authorization: `Bearer ${USER.token}`,
        },
      },
    );
  } catch (error) {
    console.log('Err @subTopic ', error.massage);
  }
};

// refresh token
const updateToken = async () => {
  try {
    const userStore = await users.getListUser();
    const url = `${BaseUrl.URL_v1_1}/Account/RefreshToken`;
    const headers = {
      headers: {
        'x-client-id': 'e9d698c3-c7fe-4a45-9559-0643a6295598',
        'x-client-secret': '3e9ffa3f04bdebaf',
      },
    };
    const res = await axios.post(url, {
      refresh_token: userStore.refreshToken,
      headers,
    });

    if (res.data.data) {
      const {token, refreshToken} = res.data.data;
      const newUser = {...userStore, token, refreshToken};
      USER = newUser;
      await users.setValueUser(newUser); // save token by user

      await updateDevice(); // update device fcm
      await getUserInfo(); // update device subtopic

      return newUser;
    }
    return null;
  } catch (error) {
    console.log('Err @updateToken ', error);
    return null;
  }
};

export default {
  Login,
  getDeviceById,
  updateDevice,
  getUserInfo,
  updateToken,
  LogOut,
};
