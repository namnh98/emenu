import React from 'react';
import { LogBox, YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import { RootNavigator } from './src/navigators';
import store from './src/redux';
import codePush from 'react-native-code-push';

LogBox.ignoreAllLogs();

const AppCustom = () => {
  console.YellowBox = true
  return (
    < Provider store={store} >
      <RootNavigator />
    </Provider >
  );
};

let codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  updateDialog: true,
  installMode: codePush.InstallMode.IMMEDIATE,
};

export default App = codePush(codePushOptions)(AppCustom);
