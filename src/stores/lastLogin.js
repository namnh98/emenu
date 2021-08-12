import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@lastLogin';

const setLastLogin = async (value) => {
  try {
    let newValue = [];
    const listLast = await getListLogin(); // token, refreshToken, user_id

    if (listLast && listLast.length) {
      const arrCurrent = listLast.filter((user) => user.id !== value.id);
      newValue = [...arrCurrent, value];
    } else {
      newValue.push(value);
    }

    AsyncStorage.setItem(KEY, JSON.stringify(newValue));
  } catch (error) {
    console.log('Err @setLastLogin ', error);
    AsyncStorage.setItem(KEY, JSON.stringify(value));
  }
};

const getListLogin = async () => {
  try {
    const user = await AsyncStorage.getItem(KEY);
    if (user) {
      const userParse = JSON.parse(user);
      return userParse;
    }
    return null;
  } catch (error) {
    console.log('Err @getListLogin ', error);
    return null;
  }
};

const removeListLogin = async (user_id) => {
  try {
    const listLogin = await getListLogin();
    const result = listLogin.filter((value) => value.user_id !== user_id);
    await AsyncStorage.setItem(KEY, JSON.stringify(result));
    return result;
  } catch (error) {
    console.log('Err @removeListLogin ', error);
  }
};

export default {setLastLogin, getListLogin, removeListLogin};
