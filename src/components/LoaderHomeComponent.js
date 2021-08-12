import React from 'react';
import { View, Dimensions } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
const { width, height } = Dimensions.get('window');
const Item = () => {
  return (
    <SkeletonPlaceholder>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          marginTop: height * 0.1 / 12,
        }}>
        <View style={{ width: width / 3.42, height: height * 0.17, borderRadius: 5 }} />
        <View style={{ width: width / 3.42, height: height * 0.17, borderRadius: 5 }} />
        <View style={{ width: width / 3.42, height: height * 0.17, borderRadius: 5 }} />
      </View>
    </SkeletonPlaceholder>
  );
};
const LoaderHomeComponent = () => {
  return (
    <>
      <Item />
      <Item />
      <Item />
      <Item />
      <Item />
    </>
  );
};

export default LoaderHomeComponent;
