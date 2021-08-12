import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Image, StyleSheet } from 'react-native';
import ReportDay from './SubComponent/NoCombo/ReportDay';
import ReportMonth from './SubComponent/NoCombo/ReportMonth';
import ReportQuater from './SubComponent/NoCombo/ReportQuater';
import ReportWeek from './SubComponent/NoCombo/ReportWeek';
import ReportYear from './SubComponent/NoCombo/ReportYear';
import { images } from '../../assets';

const Tab = createMaterialTopTabNavigator();
const ReportNoCombo = ({ selected, onChangeSelected }) => {

  const onInitScreen = (initNum) => {
    let routeName = '';
    switch (initNum) {
      case 1:
        return routeName = 'Day';
      case 2:
        return routeName = 'Week';
      case 3:
        return routeName = 'Month';
      case 4:
        return routeName = 'Quater';
      case 5:
        return routeName = 'Year';
      default:
        break;
    }
  }

  return (
    <Tab.Navigator
      tabBarPosition="top"
      lazy
      swipeEnabled={false}
      tabBarOptions={{
        showIcon: true,
        showLabel: false,
        indicatorStyle: { backgroundColor: 'orange' }
      }}
      initialRouteName={onInitScreen(selected)}
    >
      <Tab.Screen
        name='Day'
        component={ReportDay}
        options={{
          tabBarIcon: ({ focused, color }) => {
            return (
              <>
                {focused ?
                  <Image source={images.DAY} style={styles.tabIcon} /> :
                  <Image source={images.DAY_INACTIVE} style={styles.tabIcon} />
                }
              </>
            );
          },
        }}
        listeners={{
          tabPress: e => {
            onChangeSelected(1)
          },
        }}
      />

      <Tab.Screen
        name='Week'
        component={ReportWeek}
        options={{
          tabBarIcon: ({ focused, color }) => {
            return (
              <>
                {focused ?
                  <Image source={images.WEEK} style={styles.tabIcon} /> :
                  <Image source={images.WEEK_INACTIVE} style={styles.tabIcon} />
                }
              </>
            );
          },

        }}
        listeners={{
          tabPress: e => {
            onChangeSelected(2)
          },
        }}
      />
      <Tab.Screen
        name='Month'
        component={ReportMonth}
        options={{
          tabBarIcon: ({ focused, color }) => {
            return (
              <>
                {focused ?
                  <Image source={images.MONTH} style={styles.tabIcon} /> :
                  <Image source={images.MONTH_INACTIVE} style={styles.tabIcon} />
                }
              </>
            );
          },
        }}
        listeners={{
          tabPress: e => {
            onChangeSelected(3)
          },
        }}
      />

      <Tab.Screen
        name='Quater'
        component={ReportQuater}
        options={{
          tabBarIcon: ({ focused, color }) => {
            return (
              <>
                {focused ?
                  <Image source={images.QUATER} style={styles.tabIcon} /> :
                  <Image source={images.QUATER_INACTIVE} style={styles.tabIcon} />
                }
              </>
            );
          },
        }}
        listeners={{
          tabPress: e => {
            onChangeSelected(4)
          },
        }}
      />
      {/* {props => <ReportQuater {...props} nameCurrency={currency} />}
      </Tab.Screen> */}
      <Tab.Screen
        name='Year'
        component={ReportYear}
        options={{
          tabBarIcon: ({ focused, color }) => {
            return (
              <>
                {focused ?
                  <Image source={images.YEAR} style={styles.tabIcon} /> :
                  <Image source={images.YEAR_INACTIVE} style={styles.tabIcon} />
                }
              </>
            );
          },
        }}
        listeners={{
          tabPress: e => {
            onChangeSelected(5)
          },
        }}
      />
    </Tab.Navigator>
  );
};
export default ReportNoCombo

const styles = StyleSheet.create({
  tabIcon: {
    width: 30,
    height: 30
  }
});