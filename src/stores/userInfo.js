import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@userInfo';

const setValueUser = (value) => {
  AsyncStorage.setItem(KEY, JSON.stringify(value));
};

const getListUser = async () => {
  const user = await AsyncStorage.getItem(KEY);
  const userParse = JSON.parse(user);
  // console.log('user', userParse)
  return userParse;
};

const removeUser = () => {
  AsyncStorage.removeItem(KEY);
};

export default { setValueUser, getListUser, removeUser };
