
import React from 'react';
import { View } from 'react-native';
import { Dimensions } from 'react-native'
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
function LazyLoading() {
  let deviceWidth = Dimensions.get('window').width
  return [1, 1].map((_, index) => <View key={index} style={{ backgroundColor: '#ffffff', marginTop: 15, paddingBottom: 20, borderRadius: 5 }}>
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item alignItems='center' justifyContent='center' marginTop={15}>
        <SkeletonPlaceholder.Item width={200} height={10} marginTop={10} />
        <SkeletonPlaceholder.Item width={200} height={10} marginTop={10} />
        <SkeletonPlaceholder.Item width={deviceWidth - 60} height={10} marginTop={25} />
        <SkeletonPlaceholder.Item width={deviceWidth - 60} height={10} marginTop={15} />
        <SkeletonPlaceholder.Item width={deviceWidth - 60} height={10} marginTop={15} />
        <SkeletonPlaceholder.Item width={deviceWidth - 60} height={10} marginTop={15} />
        <SkeletonPlaceholder.Item width={deviceWidth - 60} height={10} marginTop={15} />
        <SkeletonPlaceholder.Item width={80} height={40} marginTop={25} borderRadius={5} />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder></View>)
}
export default LazyLoading;

