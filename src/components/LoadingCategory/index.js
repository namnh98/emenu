import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const LoadingCategory = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '48%',
            padding: 15,
          }}>
          <View style={{width: 60, height: 60, borderRadius: 50}} />
          <View
            style={{width: 120, height: 20, borderRadius: 4, marginTop: 15}}
          />
        </View>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '48%',
            padding: 15,
            marginLeft: 10,
          }}>
          <View style={{width: 60, height: 60, borderRadius: 50}} />
          <View
            style={{width: 120, height: 20, borderRadius: 4, marginTop: 15}}
          />
        </View>
      </View>

      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '48%',
            padding: 15,
          }}>
          <View style={{width: 60, height: 60, borderRadius: 50}} />
          <View
            style={{width: 120, height: 20, borderRadius: 4, marginTop: 15}}
          />
        </View>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '48%',
            padding: 15,
            marginLeft: 10,
          }}>
          <View style={{width: 60, height: 60, borderRadius: 50}} />
          <View
            style={{width: 120, height: 20, borderRadius: 4, marginTop: 15}}
          />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export default LoadingCategory;
