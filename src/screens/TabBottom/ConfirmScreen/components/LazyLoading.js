/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Dimensions, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const LazyLoading = () => {
  let deviceWidth = Dimensions.get('window').width;
  return [1, 1].map((_, index) => (
    <View
      key={index}
      style={{
        backgroundColor: '#ffffff',
        marginTop: 15,
        paddingBottom: 20,
        borderRadius: 5,
      }}>
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          paddingLeft={20}
          paddingRight={20}
          justifyContent="space-between">
          <SkeletonPlaceholder.Item width={80} height={10} marginTop={20} />
          <SkeletonPlaceholder.Item width={80} height={10} marginTop={20} />
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          paddingLeft={20}
          paddingRight={20}
          justifyContent="space-between">
          <SkeletonPlaceholder.Item width={80} height={10} marginTop={20} />
          <SkeletonPlaceholder.Item width={80} height={10} marginTop={20} />
        </SkeletonPlaceholder.Item>

        <SkeletonPlaceholder.Item alignItems="center" justifyContent="center">
          <SkeletonPlaceholder.Item
            width={deviceWidth - 60}
            height={15}
            marginTop={25}
          />
          <SkeletonPlaceholder.Item
            width={deviceWidth - 60}
            height={15}
            marginTop={15}
          />
          <SkeletonPlaceholder.Item
            width={deviceWidth - 60}
            height={15}
            marginTop={15}
          />
          <SkeletonPlaceholder.Item
            width={deviceWidth - 60}
            height={15}
            marginTop={15}
          />
          <SkeletonPlaceholder.Item
            width={deviceWidth - 60}
            height={15}
            marginTop={15}
          />
          <SkeletonPlaceholder.Item
            width={deviceWidth - 60}
            height={15}
            marginTop={15}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  ));
};
export default LazyLoading;
