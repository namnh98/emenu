import React from "react";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default ({open}) => {
  return <MaterialCommunityIcons name={open ? "chevron-down" : "chevron-up"} color="white" size={24} />
};