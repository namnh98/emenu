import React, {useState, useEffect} from 'react';
import {Dimensions, ScrollView} from 'react-native';
import WeekPicker from '../WeekPicker';
import {colors} from '../../../../assets';
import {ReportConstants} from './../../../../common';
import FormatMoment from '../../../../untils/FormatMoment';
import BarChartComponent from '../BarChartComponent';
import PieChartComponent from '../PieChartComponent';
import Accordion from './../Accordion';
import * as myConstClass from './styleSheet';
import ReportApi from './../../../../api/ReportApi';
import Loading from './Loading';
import moment from 'moment';
import {useSelector} from 'react-redux';
const {width, height} = Dimensions.get('screen');

const ReportWeek = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [totalGuestTable, setTotalGuestTable] = useState();
  const [totalRevenue, setTotalRevenue] = useState();
  const [totalStaffWork, setTotalStaffWork] = useState([]);

  const curDate = Date.now();

  const setTodate = ReportConstants.getDatesOfWeek(curDate);

  const [fromDate, setFromDate] = useState(setTodate[0]);
  const [toDate, setToDate] = useState(setTodate[6]);

  const partners = useSelector((state) => state.partners);
  const nameCurrency = partners.currency.name_vn;

  useEffect(() => {
    fetchApi().finally(() => setIsLoading(false));
  }, [fromDate]);

  const fetchApi = async () => {
    const fromD = moment(fromDate).format('YYYY-MM-DD HH:mm:ss');
    const toD = moment(toDate).format('YYYY-MM-DD HH:mm:ss');
    try {
      const [
        totalGuestTable,
        totalRevenue,
        totalStaffCheckin,
        totalStaffWork,
      ] = await Promise.all([
        ReportApi.GuestTableByDate(fromD, toD),
        ReportApi.RevenueByDate(fromD, toD),
        ReportApi.totalStaffCheckInByDate(fromD, toD),
        ReportApi.totalStaffWorkingByDate(fromD, toD),
      ]);

      setTotalGuestTable(totalGuestTable);
      setTotalRevenue(totalRevenue);
      setTotalStaffWork(totalStaffWork);

      if (totalStaffWork.length > 0) {
        const totalStaff = await formatDataStaff(
          totalStaffCheckin,
          totalStaffWork,
        );
        setTotalStaffWork(totalStaff);
      } else {
        setTotalStaffWork([]);
      }
    } catch (error) {
      console.log('@fetchApi', error);
      setTotalGuestTable([]);
      setTotalRevenue([]);
      setTotalStaffWork([]);
    }
  };

  /** Render t???ng s??? kh??ch v?? s??? b??n  */
  const blockItem = () => {
    const {total_guest_in_day, total_table_booking} = totalGuestTable;
    const {total_revenue_day} = totalRevenue;
    return (
      <myConstClass.BlockOutItems>
        <myConstClass.Item>
          <myConstClass.TextNormal>
            {ReportConstants.GuestAndTable[7]}
          </myConstClass.TextNormal>
          <myConstClass.SubText>
            {total_revenue_day
              ? FormatMoment.NumberWithCommas(Math.round(total_revenue_day))
              : '0'}{' '}
            {nameCurrency}
          </myConstClass.SubText>
        </myConstClass.Item>
        <myConstClass.Item>
          <myConstClass.TextNormal>
            {ReportConstants.GuestAndTable[6]}
          </myConstClass.TextNormal>
          <myConstClass.SubText>{total_guest_in_day}</myConstClass.SubText>
        </myConstClass.Item>
        <myConstClass.Item>
          <myConstClass.TextNormal>
            {ReportConstants.GuestAndTable[4]}
          </myConstClass.TextNormal>
          <myConstClass.SubText>{total_table_booking}</myConstClass.SubText>
        </myConstClass.Item>
      </myConstClass.BlockOutItems>
    );
  };

  /** Render s??? nh??n vi??n ??ang l??m vi???c */
  const _renderTotalWorkStaff = () => {
    const data = defineDataAccordion();
    return (
      <myConstClass.ChildScrollView>
        <myConstClass.WrapView>
          <myConstClass.TitleView>
            <myConstClass.TextModule>
              t???ng s??? nh??n vi??n l??m vi???c
            </myConstClass.TextModule>
          </myConstClass.TitleView>
          <Accordion source={data} />
        </myConstClass.WrapView>
      </myConstClass.ChildScrollView>
    );
  };

  //change date width
  const onChangeDate = (fD, tD) => {
    setFromDate(fD);
    setToDate(tD);
  };

  /** check staff Checkin hi???n t???i */
  const onCheckInCurrent = (arr) => {
    const newDate = moment().format('YYYY-MM-DD');
    const filterUser = arr.filter((item) => {
      const checkDate = moment(item.check_in_at.split('T')[0]).format(
        'YYYY-MM-DD',
      );
      if (moment(newDate).isSame(checkDate)) {
        return item;
      }
    });
    return filterUser.filter(
      (objUser, index, arr) =>
        arr.findIndex((t) => t.user_id === objUser.user_id) === index,
    );
  };

  /** check staff Checkin qu?? kh??? */
  const onCheckInPast = (arr, pDate) => {
    const dateParam = moment(new Date(pDate)).format('YYYY-MM-DD');
    const filterUser = arr.filter((item) => {
      const checkDate = moment(item.check_in_at.split('T')[0]).format(
        'YYYY-MM-DD',
      );
      if (moment(checkDate).isSame(dateParam)) {
        return item;
      }
    });
    return filterUser.filter(
      (objUser, index, arr) =>
        arr.findIndex((t) => t.user_id === objUser.user_id) === index,
    );
  };

  //Format data staff
  const formatDataStaff = (listCheckIn, listStaff) => {
    const dateNow = moment().format('YYYY-MM-DD'); // l???y ng??y hi???n
    const jsonArray = [];
    if (listCheckIn?.length > 0) {
      listStaff.map((user) => {
        const dateStaff = user.date_at.split('T')[0];
        if (moment(dateNow).isSame(dateStaff)) {
          const getStaffCurr = onCheckInCurrent(listCheckIn);
          let exist = getStaffCurr.find(
            (checkIn) => checkIn.user_id === user.user_id,
          );
          if (exist) {
            if (exist.check_out_at === null) {
              jsonArray.push({...user, status: 1});
            } else {
              jsonArray.push({...user, status: 0});
            }
          } else {
            jsonArray.push({...user, status: -1});
          }
        }
        if (moment(dateStaff).diff(dateNow)) {
          const getStaffpast = onCheckInPast(listCheckIn, dateStaff);
          let exist = getStaffpast.find(
            (checkIn) => checkIn.user_id === user.user_id,
          );
          if (exist) {
            jsonArray.push({...user, status: 0});
          } else {
            jsonArray.push({...user, status: -1});
          }
        }
      });
    } else {
      listStaff.map((item) => {
        jsonArray.push({...item, status: -1});
      });
    }
    return jsonArray;
  };

  //format data list accordion staff
  const defineDataAccordion = () => {
    let groupArrays = [];
    if (totalStaffWork.length > 0) {
      // this gives an object with dates as keys
      const groups = totalStaffWork.reduce((groups, item) => {
        const date = item.date_at.split('T')[0];
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(item);
        return groups;
      }, {});

      //Group bye date user
      groupArrays = Object.keys(groups).map((date) => {
        return {
          date,
          items: groups[date],
          isExpanded: false,
        };
      });
    }

    let jsonArray = [];

    [...Array(7)].map((v, index) => {
      if (index === 0) {
        jsonArray.push({...groupArrays[0], title: 'Ch??? nh???t'});
      }
      if (index === 1) {
        jsonArray.push({...groupArrays[1], title: 'Th??? hai'});
      }
      if (index === 2) {
        jsonArray.push({...groupArrays[2], title: 'Th??? ba'});
      }
      if (index === 3) {
        jsonArray.push({...groupArrays[3], title: 'Th??? t??'});
      }
      if (index === 4) {
        jsonArray.push({...groupArrays[4], title: 'Th??? n??m'});
      }
      if (index === 5) {
        jsonArray.push({...groupArrays[5], title: 'Th??? s??u'});
      }
      if (index === 6) {
        jsonArray.push({...groupArrays[6], title: 'Th??? b???y'});
      }
    });
    return jsonArray;
  };

  return (
    <myConstClass.Wrapper>
      <WeekPicker
        onChange={(fromDate, toDate) => onChangeDate(fromDate, toDate)}
        fromDate={fromDate}
        toDate={toDate}
      />
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {blockItem()}
          {_renderTotalWorkStaff()}
        </>
      )}
    </myConstClass.Wrapper>
  );
};

export default ReportWeek;
