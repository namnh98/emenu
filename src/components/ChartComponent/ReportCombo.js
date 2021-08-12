import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {Image, StyleSheet } from 'react-native';
import ReportDay from './SubComponent/Combo/ReportDay';
import ReportMonth from './SubComponent/Combo/ReportMonth';
import ReportQuater from './SubComponent/Combo/ReportQuater';
import ReportWeek from './SubComponent/Combo/ReportWeek';
import ReportYear from './SubComponent/Combo/ReportYear';
import { images } from '../../assets';

const Tab = createMaterialTopTabNavigator();
const ReportCombo = ({ selected, onChangeSelected }) => {

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
export default ReportCombo

const styles = StyleSheet.create({
  tabIcon: {
    width: 30,
    height: 30
  }
});