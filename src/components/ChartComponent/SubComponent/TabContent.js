import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors } from './../../../assets';

import styled from 'styled-components/native';

export default function TabContent({ contents, tabs, loading = false, selected, onChangeSelect }) {
  const styleLoadding = style => {
    return loading ? style : {};
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.tabNav}>
        {tabs.map((tab, index) => {
          return (
            <View
              key={index}
              style={index === selected - 1 ? styles.styleTouch :null }
            >
              <TouchableOpacity
                onPress={() => {
                  onChangeSelect(index);
                }}>
                <Image source={index === selected - 1 ? tab.icon_active : tab.icon} style={styles.tabIcon}/>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
      <View style={{flex: 1}}>
        {contents.map((value, index) => index === selected - 1 ? value : null)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabNav: {
    backgroundColor: `${colors.DARK_WHITE}`,
    borderTopWidth: 2,
    borderTopColor: '#DDD',
    paddingHorizontal: 10,
    flexDirection: 'row',
    paddingTop:10,
    justifyContent: 'space-between',
    backgroundColor:'#fff',
  },
  styleTouch: {
    alignItems: "center",
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    paddingBottom: 10,
    borderBottomColor: `${colors.ORANGE}`,
  },
  tabLinkSelected: {
    borderBottomWidth: 2,
    borderBottomColor: `${colors.ORANGE}`,
    marginBottom: 10,
  },
  tabIcon:{
    width:30,
    height:30
  }

});
