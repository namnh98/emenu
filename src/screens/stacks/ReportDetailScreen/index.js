import React, { useEffect, useState, useRef } from 'react';
import { Image, Text } from 'react-native';
import { PartnerApi } from '../../../api';
import { images } from '../../../assets';
import { HeaderComponent } from '../../../components';
import ReportCombo from './../../../components/ChartComponent/ReportCombo';
import ReportNoCombo from './../../../components/ChartComponent/ReportNoCombo';
import { Body, Container } from './styles';

function ReportDetailScreen({ navigation, route }) {
  const [selected, setSelected] = useState(route.params.option)
  const { partner_type } = route.params.partnerSetting

  /**
   * Load title header
   */
  const _onLoadTitle = (option) => {
    let title = "";
    switch (option) {
      case 1:
        return title = "Báo cáo theo ngày";
      case 2:
        return title = "Báo cáo theo tuần";

      case 3:
        return title = "Báo cáo theo tháng";

      case 4:
        return title = "Báo cáo theo quý";

      case 5:
        return title = "Báo cáo theo năm";
      default:
        break;
    }
  }

  const _renderBody = () => {
    if (partner_type === 2) {
      return <ReportCombo selected={selected} onChangeSelected={value => setSelected(value)}/>
    }
    return <ReportNoCombo selected={selected} onChangeSelected={value => setSelected(value)} />
  }

  return (
    <Container>
      <HeaderComponent title={_onLoadTitle(selected)} />
      <Body>
        {
          _renderBody()}
      </Body>
    </Container>
  );
};

export default ReportDetailScreen;
