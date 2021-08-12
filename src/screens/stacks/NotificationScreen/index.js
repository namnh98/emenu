import React from 'react';
import {View} from 'react-native';

import {HeaderComponent} from '../../../components';
import I18n from '../../../i18n';
import styles from './styles';

import Tab from './Tab';

const Notification = () => {
  return (
    <View style={styles.container}>
      <HeaderComponent title={I18n.t('notification.title')} />
      <Tab />
    </View>
  );
};

export default Notification;
