import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const LoadingFood = () => {
  return [1, 2, 3].map((item) => (
    <SkeletonPlaceholder key={item}>
      <SkeletonPlaceholder.Item width={'100%'} height={30} borderRadius={5} />
      <SkeletonPlaceholder.Item
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        marginTop={5}
        marginBottom={10}>
        <SkeletonPlaceholder.Item
          width={120}
          height={120}
          borderRadius={5}
          marginRight={10}
        />
        <SkeletonPlaceholder.Item
          width={120}
          height={120}
          borderRadius={5}
          marginRight={10}
        />
        <SkeletonPlaceholder.Item
          width={120}
          height={120}
          borderRadius={5}
          marginRight={10}
        />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  ));
};

export default LoadingFood;
