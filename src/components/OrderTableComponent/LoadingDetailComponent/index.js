
import React from 'react';
import { View } from 'react-native';
import { Dimensions } from 'react-native'
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
function LoadingDetail() {
  let deviceWidth = Dimensions.get('window').width
  return <SkeletonPlaceholder >
    <SkeletonPlaceholder.Item alignItems='center' justifyContent='center' marginTop={15}>
      <SkeletonPlaceholder.Item width={deviceWidth - 30} height={10} marginTop={15} />
      <SkeletonPlaceholder.Item width={deviceWidth - 30} height={10} marginTop={15} />
      <SkeletonPlaceholder.Item width={deviceWidth - 30} height={10} marginTop={15} />
      <SkeletonPlaceholder.Item width={deviceWidth - 30} height={10} marginTop={15} />
      <SkeletonPlaceholder.Item flexDirection='row' width={deviceWidth - 30} justifyContent='space-between'>
        <SkeletonPlaceholder.Item width={100} height={10} marginTop={15} />
        <SkeletonPlaceholder.Item width={100} height={10} marginTop={15} />
      </SkeletonPlaceholder.Item>
      <SkeletonPlaceholder.Item flexDirection='row' width={deviceWidth - 30} justifyContent='space-between'>
        <SkeletonPlaceholder.Item width={100} height={10} marginTop={15} />
        <SkeletonPlaceholder.Item width={100} height={10} marginTop={15} />
      </SkeletonPlaceholder.Item>
      <SkeletonPlaceholder.Item width={deviceWidth-30} justifyContent="flex-start">
        <SkeletonPlaceholder.Item width={deviceWidth/2} height={10} marginTop={30} />
      </SkeletonPlaceholder.Item>
      <SkeletonPlaceholder.Item width={deviceWidth-30} justifyContent="flex-start">
        <SkeletonPlaceholder.Item width={deviceWidth/2} height={10} marginTop={15} />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder.Item>
  </SkeletonPlaceholder>
}

export default LoadingDetail;

