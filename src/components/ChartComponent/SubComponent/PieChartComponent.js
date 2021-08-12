import React from 'react';
import Pie from 'react-native-pie'
export default function PieChartComponent({ dataSource }) {
  return (
    <Pie
      radius={113}
      innerRadius={50}
      sections={dataSource}
      strokeCap={'butt'}
    />
  )
}