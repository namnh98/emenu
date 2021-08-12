import React from 'react';
import {Image, Modal, StyleSheet, View} from 'react-native';
import {images} from '../assets';

const LoadingComponent = ({isLoading}) => {
  return (
    <Modal visible={isLoading} statusBarTranslucent transparent>
      <View style={styles.container}>
        <Image style={styles.image} source={images.LOADING} />
      </View>
    </Modal>
  );
};

export default LoadingComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(52,52,52,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
  },
});
