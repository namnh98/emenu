import React from 'react';
import {LineChart} from 'react-native-chart-kit';
import {colors} from '../../../assets';
import FormatMoment from '../../../untils/FormatMoment';
export default function LineChartComponent({dataSource, unit}) {
  const chartConfig = {
    backgroundColor: '#ff0000',
    backgroundGradientFrom: '#eff3ff',
    backgroundGradientTo: '#efefef',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForDots: {
      r: '3',
    },
  }


  return (
    <LineChart
      yLabelsOffset={0}
      data={dataSource}
      width={800}
      height={270}
      yAxisSuffix={unit ? unit : ''}
      chartConfig={chartConfig}
      fromZero={true}
      segments={5}
      withDots={true}
      formatYLabel={(str)=>FormatMoment.NumberWithCommas(str)}
    />
  );
}
