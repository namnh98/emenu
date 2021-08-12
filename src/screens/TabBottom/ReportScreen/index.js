import React, {useEffect, useState, useRef} from 'react';
import {Dimensions, TouchableOpacity, View, Text, Image} from 'react-native';
import styled from 'styled-components/native';
import {colors, images} from '../../../assets';
import {HeaderComponent, PopUpTempContract} from '../../../components';
import ReportApi from '../../../api/ReportApi';
import {REPORT_DETAIL} from '../../../navigators/ScreenName';
import Votes from './../../../components/ChartComponent/SubComponent/Vote/Votes';
import FormatMoment from './../../../untils/FormatMoment';
import Loading from './Loading';
import {PartnerApi} from '../../../api';
import messaging from '@react-native-firebase/messaging';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {ReportConstants} from './../../../common';
import {partnerAction} from '../../../redux/actions';
import jwt_decode from 'jwt-decode';
import {users} from '../../../stores';

const ContentIfNoRole12 = () => (
  <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
    <View
      style={{
        width: '90%',
        paddingHorizontal: 15,
        paddingVertical: 30,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.WHITE,
        borderRadius: 10,
      }}>
      <Image source={images.WELCOME} style={{height: 100, width: 100}} />
      <Text style={{marginTop: 20, textAlign: 'center'}}>
        Bạn chưa được phân quyền quản lý doanh thu
      </Text>
      <Text>Vui lòng liên hệ với quản lý nhà hàng</Text>
    </View>
  </View>
);

const Report = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [reportList, setReportList] = useState([]);
  const [partnerSetting, setPartnerSetting] = useState();
  const [date, setDate] = useState();
  const newDate = moment(); //date hiện tại
  const dispatch = useDispatch();
  const {partners} = useSelector((state) => state);
  const [vote, setVote] = useState();
  const focused = useIsFocused();
  const [canUse, setCanUse] = useState(true);
  const _onGotoDetai = (id) => {
    if (partners?.contract_type_id === 1) {
      setPopUpVisible(true);
    } else navigation.navigate(REPORT_DETAIL, {option: id, partnerSetting});
  };
  const [popUpVisible, setPopUpVisible] = useState(false);

  useEffect(() => {
    getPartnerInfo();
    getTotalVotePartner();
  }, []);

  useEffect(() => {
    getRole();
    getReportRevenue();
  }, [focused]);

  //Gọi lại api khi nhận msg từ sv
  useEffect(() => {
    return messaging().onMessage(async (remoteMessage) => {
      const {action} = remoteMessage.data;
      if (action === 'finished_payment') {
        getReportRevenue();
      }
    }, []);
  });
  const getRole = async () => {
    const {token} = await users.getListUser();
    let decode = jwt_decode(token);
    const {role} = decode;
    if (!role.includes('role_12')) {
      setCanUse(false);
    }
  };

  /**
   * Gọi api báo cáo tổng quan
   * @returns
   */
  const getReportRevenue = async () => {
    if (!focused) return;
    const formatDate = moment(newDate).format('YYYY-MM-DD HH:mm');

    if (!date) {
      setDate(formatDate);
      try {
        const report = await ReportApi.getOverviewReport();
        setReportList(report);
        setLoading(false);
      } catch (error) {
        setReportList([]);
        setLoading(false);
        console.log('@getReportRevenue', error);
      }
      return;
    } else {
      const addDate = moment(date)
        .add(ReportConstants.TIMEUPDATEREPORT, 'minute')
        .format('YYYY-MM-DD HH:mm');
      if (formatDate > addDate) {
        try {
          const report = await ReportApi.getOverviewReport();
          setReportList(report);
          setLoading(false);
          setDate(formatDate);
        } catch (error) {
          setReportList([]);
          setLoading(false);
          console.log('@getReportRevenue', error);
        }
        return;
      }
    }
  };

  /**
   * Gọi api thông tin partner
   */
  const getPartnerInfo = async () => {
    try {
      const partnerSeting = await PartnerApi.getPartnerSetting();
      dispatch(partnerAction.success({currency: partnerSeting.currency}));
      setPartnerSetting(partnerSeting);
    } catch (error) {
      setPartnerSetting([]);
      setLoading(false);
      console.log('@getPartnerInfo', error);
    }
  };

  /**
   * Gọi api thông tin partner
   */
  const getTotalVotePartner = async () => {
    try {
      const totalVote = await ReportApi.totalVoteOfPartner();
      setVote(totalVote);
    } catch (error) {
      console.log('@getPartnerInfo', error);
    }
  };

  const _renderContentButton = () => {
    const {
      total_revenue_day,
      total_revenue_week,
      total_revenue_month,
      total_revenue_quarter,
      total_revenue_year,
    } = reportList;
    return (
      <>
        <TouchableOpacity activeOpacity={0.75} onPress={() => _onGotoDetai(1)}>
          <Button>
            <Icon source={images.DAY} />
            <SubText>
              {total_revenue_day
                ? FormatMoment.NumberWithCommas(Math.round(total_revenue_day))
                : 0}
              {partnerSetting?.currency.name_vn}
            </SubText>
            <TitleText>Theo ngày</TitleText>
          </Button>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.75} onPress={() => _onGotoDetai(2)}>
          <Button>
            <Icon source={images.WEEK} />
            <SubText>
              {total_revenue_week
                ? FormatMoment.NumberWithCommas(Math.round(total_revenue_week))
                : 0}
              {partnerSetting?.currency.name_vn}
            </SubText>
            <TitleText>Theo tuần</TitleText>
          </Button>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.75} onPress={() => _onGotoDetai(3)}>
          <Button>
            <Icon source={images.MONTH} />
            <SubText>
              {total_revenue_month
                ? FormatMoment.NumberWithCommas(Math.round(total_revenue_month))
                : 0}
              {partnerSetting?.currency.name_vn}
            </SubText>
            <TitleText>Theo tháng</TitleText>
          </Button>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.75} onPress={() => _onGotoDetai(4)}>
          <Button>
            <Icon source={images.QUATER} />
            <SubText>
              {total_revenue_quarter
                ? FormatMoment.NumberWithCommas(
                    Math.round(total_revenue_quarter),
                  )
                : 0}
              {partnerSetting?.currency.name_vn}
            </SubText>
            <TitleText>Theo quý</TitleText>
          </Button>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.75} onPress={() => _onGotoDetai(5)}>
          <Button>
            <Icon source={images.YEAR} />
            <SubText>
              {total_revenue_year
                ? FormatMoment.NumberWithCommas(Math.round(total_revenue_year))
                : 0}
              {partnerSetting?.currency.name_vn}
            </SubText>
            <TitleText>Theo năm</TitleText>
          </Button>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <Container>
      {partnerSetting !== undefined && partnerSetting.is_confirm_order_item ? (
        <HeaderComponent title="Báo cáo tổng quan" />
      ) : (
        <HeaderComponent title="Báo cáo tổng quan" isNotBack />
      )}
      {!canUse ? (
        <ContentIfNoRole12 />
      ) : loading ? (
        <Loading />
      ) : (
        <Wrapper>
          <ContentButton>{_renderContentButton()}</ContentButton>
          {vote &&<Votes vote={vote} />}
        </Wrapper>
      )}
      <PopUpTempContract
        visible={popUpVisible}
        onClosePopup={() => setPopUpVisible(false)}
      />
    </Container>
  );
};

export default Report;

const _width = Dimensions.get('screen').width;

const Container = styled.View`
  flex: 1;
`;
const Wrapper = styled.ScrollView`
  flex: 1;
  padding-bottom: 10px;
`;
const ContentButton = styled.View`
  flex: 1;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
  justify-content: space-between;
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
`;
const Button = styled.View`
  width: ${_width / 2.2}px;
  height: 120px;
  background: ${colors.WHITE};
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
`;
const Icon = styled.Image`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  margin-bottom: 6px;
`;
const SubText = styled.Text`
  color: ${colors.LIGHT_BLUE};
  font-size: 16px;
  font-weight: bold;
  line-height: 26px;
`;
const TitleText = styled.Text`
  color: ${colors.ORANGE};
  text-transform: uppercase;
`;
