import React from 'react';
import { Dimensions } from 'react-native'
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

function Loading() {
  let deviceWidth = Dimensions.get('window').width
  return <SkeletonPlaceholder>
    <SkeletonPlaceholder.Item justifyContent='space-between' marginTop={10}>
      <SkeletonPlaceholder.Item width={deviceWidth - 20} height={300} marginLeft={10} borderRadius={5} />
    </SkeletonPlaceholder.Item>
    <SkeletonPlaceholder.Item justifyContent='space-between' flexDirection="row" marginTop={10}>
      <SkeletonPlaceholder.Item width={deviceWidth / 2 - 15} height={deviceWidth / 2 - 30} marginLeft={10} borderRadius={5} />
      <SkeletonPlaceholder.Item width={deviceWidth / 2 - 15} height={deviceWidth / 2 - 30} marginRight={10} borderRadius={5} />
    </SkeletonPlaceholder.Item>
    <SkeletonPlaceholder.Item justifyContent='space-between' flexDirection="row" marginTop={10}>
      <SkeletonPlaceholder.Item width={deviceWidth / 2 - 15} height={deviceWidth / 2 - 30} marginLeft={10} borderRadius={5} />
      <SkeletonPlaceholder.Item width={deviceWidth / 2 - 15} height={deviceWidth / 2 - 30} marginRight={10} borderRadius={5} />
    </SkeletonPlaceholder.Item>
  </SkeletonPlaceholder>
}
export default Loading;
