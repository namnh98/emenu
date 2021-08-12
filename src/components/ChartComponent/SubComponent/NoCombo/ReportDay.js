import React, {useRef, useState, useEffect} from 'react';
import {Dimensions, ScrollView} from 'react-native';
import {colors} from '../../../../assets';
import {ReportConstants} from './../../../../common';
import FormatMoment from '../../../../untils/FormatMoment';
import Avartar from '../Avatar';
import BarChartComponent from '../BarChartComponent';
import PieChartComponent from '../PieChartComponent';
import * as myConstClass from './styleSheet';
import DatePicker from '../DatePicker';
import ReportApi from './../../../../api/ReportApi';
import moment, {now} from 'moment';
import Loading from './Loading';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import messaging from '@react-native-firebase/messaging';
import {useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';

const {width, height} = Dimensions.get('screen');

const ReportDay = () => {
  const curDate = Date.now();
  const [isLoading, setIsLoading] = useState(true);
  const [totalGuestTableCur, setTotalGuestTableCur] = useState();
  const [totalGuestTable, setTotalGuestTable] = useState();
  const [totalRevenue, setTotalRevenue] = useState();
  const [totalTopFood, setTotalTopFood] = useState();
  const [totalTopDrink, setTotalTopDrink] = useState();
  const [totalStaffWork, setTotalStaffWork] = useState([]);
  const [dateTime, setDateTime] = useState(curDate);
  const partners = useSelector((state) => state.partners);
  const nameCurrency = partners.currency.name_vn;
  const focused = useIsFocused();
  const [date, setDate] = useState();
  const currDate = moment(); //date hiện tại

  useEffect(() => {
    fetchApi().finally(() => setIsLoading(false));
  }, [dateTime]);

  useEffect(() => {
    getApiUpdateReport();
  }, [focused]);

  /**
   * Gọi api report theo ngày
   * @returns
   */
  const fetchApi = async () => {
    const newDate = new Date(dateTime);
    let from_date = moment(
      new Date(
        new Date(
          newDate.getFullYear(),
          newDate.getMonth(),
          newDate.getDate(),
          0,
          0,
          0,
        ),
      ),
    ).format('YYYY-MM-DD HH:mm:ss');
    let to_date = moment(
      new Date(
        new Date(
          newDate.getFullYear(),
          newDate.getMonth(),
          newDate.getDate(),
          23,
          59,
          59,
          999,
        ),
      ),
    ).format('YYYY-MM-DD HH:mm:ss');
    const formatDate = moment(currDate).format('YYYY-MM-DD HH:mm');

    if (!date) {
      setDate(formatDate);
    }
    try {
      const [
        totalGuestTableCur,
        totalGuestTable,
        totalRevenue,
        totalTopFood,
        totalTopDrink,
        totalStaffCheckin,
        totalStaffWork,
      ] = await Promise.all([
        ReportApi.GuestTableByCurrentDate(),
        ReportApi.GuestTableByDate(from_date, to_date),
        ReportApi.RevenueByDate(from_date, to_date),
        ReportApi.RevenueTopFoodByDate(from_date, to_date),
        ReportApi.RevenueTopDrinkByDate(from_date, to_date),
        ReportApi.totalStaffCheckInByDate(from_date, to_date),
        ReportApi.totalStaffWorkingByDate(from_date, to_date),
      ]);
      setTotalGuestTableCur(totalGuestTableCur);
      setTotalGuestTable(totalGuestTable);
      setTotalRevenue(totalRevenue);
      setTotalTopFood(totalTopFood);
      setTotalTopDrink(totalTopDrink);
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
      setTotalGuestTableCur([]);
      setTotalGuestTable([]);
      setTotalRevenue([]);
      setTotalTopFood([]);
      setTotalTopDrink([]);
    }
  };

  /**
   * Gọi lại api report theo ngày thỏa điều kiện realtime
   */
  const getApiUpdateReport = () => {
    if (!focused) return;
    const addDate = moment(date)
      .add(ReportConstants.TIMEUPDATEREPORT, 'minute')
      .format('YYYY-MM-DD HH:mm');
    const formatDate = moment(currDate).format('YYYY-MM-DD HH:mm');
    if (formatDate > addDate) {
      fetchApi();
      setDate(formatDate);
    }
  };

  //callback api
  useEffect(() => {
    return messaging().onMessage(async (remoteMessage) => {
      const {action} = remoteMessage.data;
      if (action === 'finished_payment') {
        getApiUpdateReport();
      }
    });
  }, []);

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
        total: total_revenue_food,
        color: `${colors.PRIMARY}`,
      },
      {
        name: 'Thức uống',
        percent: `${dPercent}`,
        total: total_revenue_drink,
        color: `${colors.ORANGE}`,
      },
      {
        name: 'khác',
        percent: `${oPercent}`,
        total: total_revenue_other,
        color: '#39B552',
      },
    ];

    const dataPieChart = [
      {
        percentage: fPercent,
        color: `${colors.PRIMARY}`,
      },
      {
        percentage: dPercent,
        color: `${colors.ORANGE}`,
      },
      {
        percentage: oPercent,
        color: '#39B552',
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
                  0%
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
                  style={{ backgroundColor: `${desc.color}`}}
                />
                <myConstClass.TextName> {desc.name}</myConstClass.TextName>
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

  /** Render tổng số khách và số bàn  */
  const _renderGuestTable = () => {
    return (
      <myConstClass.BlockOutItems>
        <myConstClass.Item>
          <myConstClass.TextNormal>
            {ReportConstants.GuestAndTable[0]}
          </myConstClass.TextNormal>
          <myConstClass.SubText>
            {totalGuestTable.total_guest_in_day
              ? totalGuestTable.total_guest_in_day
              : '0'}
          </myConstClass.SubText>
        </myConstClass.Item>
        <myConstClass.Item>
          <myConstClass.TextNormal>
            {ReportConstants.GuestAndTable[1]}
          </myConstClass.TextNormal>
          <myConstClass.SubText>
            {totalGuestTableCur.total_guest_using}
          </myConstClass.SubText>
        </myConstClass.Item>
        <myConstClass.Item>
          <myConstClass.TextNormal>
            {ReportConstants.GuestAndTable[2]}
          </myConstClass.TextNormal>
          <myConstClass.SubText>
            {' '}
            {totalGuestTable.table_name_greated_booking !== ''
              ? 'Bàn ' + totalGuestTable.table_name_greated_booking
              : 0}
          </myConstClass.SubText>
        </myConstClass.Item>
        <myConstClass.Item>
          <myConstClass.TextNormal>
            {ReportConstants.GuestAndTable[3]}
          </myConstClass.TextNormal>
          <myConstClass.SubText>
            {totalGuestTableCur.total_table_using}
          </myConstClass.SubText>
        </myConstClass.Item>
        <myConstClass.Item>
          <myConstClass.TextNormal>
            {ReportConstants.GuestAndTable[4]}
          </myConstClass.TextNormal>
          <myConstClass.SubText>
            {totalGuestTable.total_table_booking}
          </myConstClass.SubText>
        </myConstClass.Item>
        <myConstClass.Item>
          <myConstClass.TextNormal>
            {ReportConstants.GuestAndTable[5]}
          </myConstClass.TextNormal>
          <myConstClass.SubText>
            {totalGuestTableCur.total_table_empty}
          </myConstClass.SubText>
        </myConstClass.Item>
      </myConstClass.BlockOutItems>
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
    const countStaff = totalStaffWork.length;
    const dataStaff = totalStaffWork;
    return (
      <myConstClass.WrapView>
        <myConstClass.TitleView>
          <myConstClass.TextModule>
            tổng số nhân viên làm việc
          </myConstClass.TextModule>
          <myConstClass.TextModule>{countStaff}</myConstClass.TextModule>
        </myConstClass.TitleView>
        {countStaff > 0 ? (
          dataStaff.map((staff, index) => {
            return (
              <myConstClass.ListView
                key={index}
                style={{
                  borderBottomWidth: dataStaff.length === index + 1 ? 0 : 1,
                }}>
                <myConstClass.ViewCenterRow>
                  <myConstClass.TextNormal>{index + 1}</myConstClass.TextNormal>
                  <myConstClass.ViewCenterColumn>
                    <myConstClass.ViewCenterRow>
                      <myConstClass.TextNormal style={{marginRight: 30}}>
                        {staff.full_name}
                      </myConstClass.TextNormal>
                      {staff.status === 1 ? (
                        <FontAwesome name="circle" size={16} color="#5cce0e" />
                      ) : staff.status === 0 ? (
                        <FontAwesome
                          name="circle"
                          size={16}
                          color={colors.ORANGE}
                        />
                      ) : null}
                    </myConstClass.ViewCenterRow>
                    <myConstClass.TextNormal style={{color: colors.ORANGE}}>
                      {staff.areas.length > 0
                        ? staff.areas.map((area) => {
                            return 'Khu vực:' + area.Area.name;
                          })
                        : null}
                    </myConstClass.TextNormal>
                  </myConstClass.ViewCenterColumn>
                </myConstClass.ViewCenterRow>
                <Avartar imageSource={staff.avatar ? staff.avatar : ''} />
              </myConstClass.ListView>
            );
          })
        ) : (
          <myConstClass.TextNormal>
            Không có nhân viên làm việc trong ngày này
          </myConstClass.TextNormal>
        )}
      </myConstClass.WrapView>
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

  //callback change date picker
  const _onChangeDate = (date) => {
    const formatDate = moment(date).format('YYYY-MM-DDTHH:mm:ss');
    setDateTime(formatDate);
  };

  //Format data staff
  const formatDataStaff = (listCheckIn, listStaff) => {
    const dateNow = moment().format('YYYY-MM-DD'); // lấy ngày hiện
    const dateParam = moment(new Date(dateTime)).format('YYYY-MM-DD');
    const jsonArray = [];
    if (listCheckIn?.length > 0) {
      listStaff.map((user) => {
        if (moment(dateNow).isSame(dateParam)) {
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
        if (moment(dateParam).diff(dateNow)) {
          const getStaffpast = onCheckInPast(listCheckIn);
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
  const onCheckInPast = (arr) => {
    const newDateTime = new Date(dateTime);
    const newDate = moment(newDateTime).format('YYYY-MM-DD');
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

  return (
    <myConstClass.Wrapper>
      <DatePicker onChangeDate={(date) => _onChangeDate(date)} />
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {_renderPieChart() /* Render pie chart*/}
          {_renderGuestTable() /** Render số khách và số bàn*/}
          {_renderTop5Food() /* Top 5 đồ ăn có doanh thu cao */}
          {_renderTop5Drink() /** Top 5 đồ uống có doanh thu cao*/}
          {_renderTotalWorkStaff() /** Tổng nhân viên đang làm việc*/}
        </>
      )}
    </myConstClass.Wrapper>
  );
};

export default ReportDay;
