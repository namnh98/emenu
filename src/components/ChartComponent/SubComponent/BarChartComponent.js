import React from 'react';
import {BarChart} from 'react-native-chart-kit';
import {Dimensions, Text, View} from 'react-native';
import FormatMoment from '../../../untils/FormatMoment';
import {formatMoney} from '../../../untils/index';
const {width, height} = Dimensions.get('screen');

export default function BarChartComponent({dataSource, unit}) {
  /**
   * config style chart
   */

  const barCharConfig = {
    fillShadowGradient: '#2699FB',
    fillShadowGradientOpacity: 1,
    backgroundColor: '#1cc910',
    backgroundGradientFrom: '#eff3ff',
    backgroundGradientTo: '#efefef',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    formatYLabel: formatMoney,
  };

  return (
      <BarChart
        yLabelsOffset={-5}
        data={dataSource}
        width={500}
        height={320}
        chartConfig={barCharConfig}
        showValuesOnTopOfBars={true}
        fromZero={true}
        verticalLabelRotation={15}
        withHorizontalLabels={true}
        yAxisSuffix={unit ? unit : ''}
        withHorizontalLabels={200}
        style={{
          borderRadius: 10,
        }}
      />
  );
}
