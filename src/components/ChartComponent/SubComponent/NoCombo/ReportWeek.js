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
import {useIsFocused} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import {useSelector} from 'react-redux';

const {width, height} = Dimensions.get('screen');

const ReportWeek = () => {
  const partners = useSelector((state) => state.partners);
  const nameCurrency = partners.currency.name_vn;

  const [isLoading, setIsLoading] = useState(true);

  const [totalGuestTable, setTotalGuestTable] = useState();
  const [totalRevenue, setTotalRevenue] = useState();
  const [totalTopFood, setTotalTopFood] = useState();
  const [totalTopDrink, setTotalTopDrink] = useState();
  const [totalStaffWork, setTotalStaffWork] = useState([]);

  const curDate = Date.now();

  const setTodate = ReportConstants.getDatesOfWeek(curDate);

  const [fromDate, setFromDate] = useState(setTodate[0]);
  const [toDate, setToDate] = useState(setTodate[6]);

  const focused = useIsFocused();
  const [date, setDate] = useState();
  const currDate = moment(); //date hiện tại

  useEffect(() => {
    fetchApi().finally(() => setIsLoading(false));
  }, [fromDate]);

  //callback api
  useEffect(() => {
    return messaging().onMessage(async (remoteMessage) => {
      const {action} = remoteMessage.data;
      if (action === 'finished_payment') {
        getApiUpdateReport();
      }
    });
  }, []);

  useEffect(() => {
    getApiUpdateReport();
  }, [focused]);

  const fetchApi = async () => {
    const fromD = moment(fromDate).format('YYYY-MM-DD HH:mm:ss');
    const toD = moment(toDate).format('YYYY-MM-DD HH:mm:ss');
    const formatDate = moment(currDate).format('YYYY-MM-DD HH:mm');
    if (!date) {
      setDate(formatDate);
    }
    try {
      const [
        totalGuestTable,
        totalRevenue,
        totalTopFood,
        totalTopDrink,
        totalStaffCheckin,
        totalStaffWork,
      ] = await Promise.all([
        ReportApi.GuestTableByDate(fromD, toD),
        ReportApi.RevenueByDate(fromD, toD),
        ReportApi.RevenueTopFoodByDate(fromD, toD),
        ReportApi.RevenueTopDrinkByDate(fromD, toD),
        ReportApi.totalStaffCheckInByDate(fromD, toD),
        ReportApi.totalStaffWorkingByDate(fromD, toD),
      ]);

      setTotalGuestTable(totalGuestTable);
      setTotalRevenue(totalRevenue);
      setTotalTopFood(totalTopFood);
      setTotalTopDrink(totalTopDrink);
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
      setTotalTopFood([]);
      setTotalTopDrink([]);
      setTotalStaffWork([]);
    }
  };

  /**
   * Gọi lại api report theo tuần thỏa điều kiện realtime
   */
  const getApiUpdateReport = () => {
    if (!focused) return;
    const fromD = moment(fromDate).format('YYYY-MM-DD HH:mm');
    const toD = moment(toDate).format('YYYY-MM-DD HH:mm');
    const dateNow = moment(currDate).format('YYYY-MM-DD HH:mm');
    if (dateNow > fromD && dateNow < toD) {
      const addDate = moment(date)
        .add(ReportConstants.TIMEUPDATEREPORT, 'minute')
        .format('YYYY-MM-DD HH:mm');
      const formatDate = moment(currDate).format('YYYY-MM-DD HH:mm');
      if (formatDate > addDate) {
        fetchApi();
        setDate(formatDate);
      }
    }
  };

  /** Render tổng số khách và số bàn  */
  const blockItem = () => {
    const {total_guest_in_day, total_table_booking} = totalGuestTable;
    return (
      <myConstClass.BlockOutItems>
        <myConstClass.Item>
          <myConstClass.TextNormal>
            {ReportConstants.GuestAndTable[4]}
          </myConstClass.TextNormal>
          <myConstClass.SubText>{total_guest_in_day}</myConstClass.SubText>
        </myConstClass.Item>
        <myConstClass.Item>
          <myConstClass.TextNormal>
            {ReportConstants.GuestAndTable[6]}
          </myConstClass.TextNormal>
          <myConstClass.SubText>{total_table_booking}</myConstClass.SubText>
        </myConstClass.Item>
      </myConstClass.BlockOutItems>
    );
  };

  /**
   *
   * Render pieChart Doanh thu ước tính
   */
  const _renderPieChart = () => {
    const {
      total_revenue_day,
      total_revenue_food,
      total_revenue_drink,
      total_revenue_other,
    } = totalRevenue;
    let fPercent = 0;
    let dPercent = 0;
    let oPercent = 0;
    let roundLast = 0;
    if (total_revenue_day) {
      if (total_revenue_food) {
        fPercent = Math.round((total_revenue_food / total_revenue_day) * 100);
      }
      if (total_revenue_drink) {
        dPercent = Math.round((total_revenue_drink / total_revenue_day) * 100);
      }
      if (total_revenue_other) {
        let tempt = Math.round((total_revenue_other / total_revenue_day) * 100)
            roundLast = fPercent + dPercent + tempt
        if(roundLast === 99){
          oPercent = 100 - (fPercent + dPercent)
        }else{
          oPercent = Math.round((total_revenue_other / total_revenue_day) * 100);
        }
      }
    }

    const dataDescPieChart = [
      {
        name: 'đồ ăn',
        percent: `${fPercent}`,
        total: total_revenue_food || 0,
        color: `${colors.PRIMARY}`,
      },
      {
        name: 'Thức uống',
        percent: `${dPercent}`,
        total: total_revenue_drink || 0,
        color: `${colors.ORANGE}`,

      },
      {
        name: 'khác',
        percent: `${oPercent}`,
        total: total_revenue_other || 0,
        color: '#39B552',
      },
    ];

    const dataPieChart = [
      {
        percentage: fPercent,
        color: `${colors.PRIMARY}`,
      },
      {
        percentage: oPercent,
        color: '#39B552',
      },
      {
        percentage: dPercent,
        color: `${colors.ORANGE}`,
      },
    ];
    const noDataPieChart = [
      {
        percentage: 100,
        color: `${colors.GRAY}`,
      },
    ];

    return (
      <myConstClass.WrapViewTop>
        <myConstClass.TitleView>
          <myConstClass.TextModule>doanh thu ước tính</myConstClass.TextModule>
          <myConstClass.TextModuleRight>
            {FormatMoment.NumberWithCommas(total_revenue_day)} {nameCurrency}
          </myConstClass.TextModuleRight>
        </myConstClass.TitleView>

        <myConstClass.ViewPie>
          {(total_revenue_day === 0 || total_revenue_day === null) &&
          (total_revenue_food === 0 || total_revenue_food === null) &&
          (total_revenue_drink === 0 || total_revenue_drink === null) &&
          (total_revenue_other === 0 || total_revenue_other === null) ? (
            <>
              <PieChartComponent dataSource={noDataPieChart} />
              <myConstClass.ViewDatNull>
                <myConstClass.TextNoValue style={{color: 'red'}}>
                  {' '}
                  0%{' '}
                </myConstClass.TextNoValue>
              </myConstClass.ViewDatNull>
            </>
          ) : (
            <PieChartComponent dataSource={dataPieChart} />
          )}
        </myConstClass.ViewPie>

        {dataDescPieChart.map((desc, index) => {
          return (
            <myConstClass.ViewPieDesc key={index}>
              <myConstClass.ViewRow>
                <myConstClass.ViewBlock
                  style={{
                    backgroundColor: `${desc.color}`,
                  }}
                />
                <myConstClass.TextName> {desc.name} </myConstClass.TextName>
                <myConstClass.TextPercent>
                  {desc.percent}%
                </myConstClass.TextPercent>
              </myConstClass.ViewRow>
              <myConstClass.TextDefault>
                {FormatMoment.NumberWithCommas(desc.total)} {nameCurrency}
              </myConstClass.TextDefault>
            </myConstClass.ViewPieDesc>
          );
        })}
      </myConstClass.WrapViewTop>
    );
  };

  /** Render Top 5 đồ ăn doanh thu cao */
  const _renderTop5Food = () => {
    const labels = convertLabels(totalTopFood);
    const data = convertData(totalTopFood);

    const top5Food = {
      labels,
      datasets: [
        {
          data,
        },
      ],
    };

    return (
      <myConstClass.WrapView>
        <myConstClass.TitleView>
          <myConstClass.TextModule>
            top 5 đồ ăn có doanh thu cao
          </myConstClass.TextModule>
        </myConstClass.TitleView>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false} // to hide scroll bar
        >
          <BarChartComponent dataSource={top5Food} unit={nameCurrency} />
        </ScrollView>
      </myConstClass.WrapView>
    );
  };

  /** Render Top 5 đồ ăn doanh thu cao */
  const _renderTop5Drink = () => {
    const labels = convertLabels(totalTopDrink);
    const data = convertData(totalTopDrink);

    const top5Drink = {
      labels,
      datasets: [
        {
          data,
        },
      ],
    };

    return (
      <myConstClass.WrapView>
        <myConstClass.TitleView>
          <myConstClass.TextModule>
            top 5 đồ uống có doanh thu cao
          </myConstClass.TextModule>
        </myConstClass.TitleView>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false} // to hide scroll bar
        >
          <BarChartComponent dataSource={top5Drink} unit={nameCurrency} />
        </ScrollView>
      </myConstClass.WrapView>
    );
  };

  /** Render số nhân viên đang làm việc */
  const _renderTotalWorkStaff = () => {
    const data = defineDataAccordion();
    return (
      <myConstClass.ChildScrollView>
        <myConstClass.WrapView>
          <myConstClass.TitleView>
            <myConstClass.TextModule>
              tổng số nhân viên làm việc
            </myConstClass.TextModule>
          </myConstClass.TitleView>
          <Accordion source={data} />
        </myConstClass.WrapView>
      </myConstClass.ChildScrollView>
    );
  };

  //Convert label in Bar chart
  const convertLabels = (itemLists = []) => {
    return itemLists.reduce((_itemLists, cur) => {
      return [..._itemLists, cur.item_name];
    }, []);
  };

  //Convert Data in Bar chart
  const convertData = (itemLists = []) => {
    return itemLists.reduce((_itemLists, cur) => {
      return [..._itemLists, cur.total];
    }, []);
  };

  //change date width
  const onChangeDate = (fD, tD) => {
    setFromDate(fD);
    setToDate(tD);
  };

  /** check staff Checkin hiện tại */
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

  /** check staff Checkin quá khứ */
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
    const dateNow = moment().format('YYYY-MM-DD'); // lấy ngày hiện
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
        jsonArray.push({...groupArrays[0], title: 'Chủ nhật'});
      }
      if (index === 1) {
        jsonArray.push({...groupArrays[1], title: 'Thứ hai'});
      }
      if (index === 2) {
        jsonArray.push({...groupArrays[2], title: 'Thứ ba'});
      }
      if (index === 3) {
        jsonArray.push({...groupArrays[3], title: 'Thứ tư'});
      }
      if (index === 4) {
        jsonArray.push({...groupArrays[4], title: 'Thứ năm'});
      }
      if (index === 5) {
        jsonArray.push({...groupArrays[5], title: 'Thứ sáu'});
      }
      if (index === 6) {
        jsonArray.push({...groupArrays[6], title: 'Thứ bảy'});
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
          {_renderPieChart()}
          {blockItem()}
          {_renderTop5Food()}
          {_renderTop5Drink()}
          {_renderTotalWorkStaff()}
        </>
      )}
    </myConstClass.Wrapper>
  );
};

export default ReportWeek;
