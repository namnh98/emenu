import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@users';

const setValueUser = (value) => {
  AsyncStorage.setItem(KEY, JSON.stringify(value));
};

const getListUser = async () => {
  try {
    const user = await AsyncStorage.getItem(KEY);
    if (user) {
      const userParse = JSON.parse(user);
      return userParse;
    }
    return null;
  } catch (error) {
    console.log('Err @getListUser ', error);
    return null;
  }
};

const removeUser = () => {
  AsyncStorage.removeItem(KEY);
};

export default {setValueUser, getListUser, removeUser};
