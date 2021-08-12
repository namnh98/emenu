import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {BOTTOM_TAB, CHECK_IN_OUT} from './ScreenName';
import {CheckInOutScreen} from '../screens';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator();

export default function TabNavWithCheckInCheckOut() {
  return (
    <Stack.Navigator
      initialRouteName={CHECK_IN_OUT}
      headerMode="none"
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        gestureEnabled: false,
      }}>
      <Stack.Screen name={CHECK_IN_OUT} component={CheckInOutScreen} />
      <Stack.Screen name={BOTTOM_TAB} component={TabNavigator} />
    </Stack.Navigator>
  );
}
