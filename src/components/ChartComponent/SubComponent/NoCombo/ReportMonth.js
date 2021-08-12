import React, { useState, useEffect, useRef } from 'react';
import { Dimensions, ScrollView } from 'react-native';
import MonthPicker from '../MonthPicker';
import { colors } from '../../../../assets';
import FormatMoment from '../../../../untils/FormatMoment';
import { ReportConstants } from './../../../../common';
import BarChartComponent from '../BarChartComponent';
import LineChartComponent from '../LineChartComponent';
import PieChartComponent from '../PieChartComponent';
import * as myConstClass from './styleSheet';
import ReportApi from './../../../../api/ReportApi';
import Loading from './Loading';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import { useSelector } from 'react-redux';

const { width, height } = Dimensions.get('screen');

const ReportWeek = () => {
  const partners = useSelector(state => state.partners);
  const nameCurrency = partners.currency.name_vn;
  const firstdate = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
  const lastdate = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');

  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState(0);
  const [selectedYear, setSelectedYear] = useState(0);
  const [monthList, setMonthList] = useState([]);
  const [yearList, setYearList] = useState([]);

  const [fromDate, setFromDate] = useState(firstdate);
  const [toDate, setToDate] = useState(lastdate);

  const [totalGuestTable, setTotalGuestTable] = useState();
  const [totalRevenue, setTotalRevenue] = useState();
  const [totalTopFood, setTotalTopFood] = useState();
  const [totalTopDrink, setTotalTopDrink] = useState();

  const [totalCompareOfDay, setTotalCompareOfDay] = useState();

  const focused = useIsFocused();
  const [date, setDate] = useState();
  const currDate = moment(); //date hiện tại

  /**
   * set danh sách tháng
   */
  useEffect(() => {
    getMonthList();
  }, []);

  /**
   * Gọi api theo
   */
  useEffect(() => {
    fetchApi().finally(() => setIsLoading(false));
  }, [fromDate]);

  /**
   * Gọi lại api theo
   */
  useEffect(() => {
    getApiUpdateReport();
  }, [focused]);

  //callback api khi nhận msg từ sv
  useEffect(() => {
    return messaging().onMessage(async remoteMessage => {
      const {action} = remoteMessage.data;
      if (action === 'finished_payment') {
        getApiUpdateReport();
      }
    });
  }, []);

  /**
   * Gọi api report theo ngày
   * @returns
   */
  const fetchApi = async () => {
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
        totalCompareOfDay,
      ] = await Promise.all([
        ReportApi.GuestTableByDate(fromDate, toDate),
        ReportApi.RevenueByDate(fromDate, toDate),
        ReportApi.RevenueTopFoodByDate(fromDate, toDate),
        ReportApi.RevenueTopDrinkByDate(fromDate, toDate),
        ReportApi.revenueByMonth(fromDate, toDate),
      ]);

      setTotalGuestTable(totalGuestTable);
      setTotalRevenue(totalRevenue);
      setTotalTopFood(totalTopFood);
      setTotalTopDrink(totalTopDrink);
      setTotalCompareOfDay(totalCompareOfDay);
    } catch (error) {
      setTotalGuestTable([]);
      setTotalRevenue([]);
      setTotalTopFood([]);
      setTotalTopDrink([]);
      setTotalCompareOfDay([]);
      console.log('@fetchApi', error);
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
    const { total_guest_in_day, total_table_booking } = totalGuestTable;
    return (
      <myConstClass.BlockOutItems>
        <myConstClass.Item>
          <myConstClass.TextNormal>
            {ReportConstants.GuestAndTable[4]}
          </myConstClass.TextNormal>
          <myConstClass.SubText>{total_table_booking}</myConstClass.SubText>
        </myConstClass.Item>
        <myConstClass.Item>
          <myConstClass.TextNormal>
            {ReportConstants.GuestAndTable[6]}
          </myConstClass.TextNormal>
          <myConstClass.SubText>{total_guest_in_day}</myConstClass.SubText>
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
            {total_revenue_day
              ? FormatMoment.NumberWithCommas(total_revenue_day)
              : '0'}{' '}
            {nameCurrency}
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
                <myConstClass.TextNoValue style={{ color: 'red' }}>
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
                    backgroundColor: `${desc.color}`
                  }}
                />
                <myConstClass.TextName> {desc.name}  </myConstClass.TextName>
                <myConstClass.TextPercent>
                  {desc.percent}%
                </myConstClass.TextPercent>
              </myConstClass.ViewRow>
              <myConstClass.TextDefault>
                {desc?.total ? FormatMoment.NumberWithCommas(desc.total) : '0'}{' '}
                {nameCurrency}
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

  // So sánh doanh thu theo ngày
  const RevenueByMonth = () => {
    const labels = convertLabelsLineChart(totalCompareOfDay);
    const dataValue = convertDataLineChart(totalCompareOfDay);
    const data = {
      labels,
      datasets: [
        {
          data: dataValue,
          color: (opacity = 1) => `rgba(38, 153, 251, ${opacity})`,
        },
      ],
    };

    const data2 = {
      labels,
      datasets: [
        {
          data: [0],
          color: (opacity = 1) => `rgba(38, 153, 251, ${opacity})`,
        },
      ],
    };

    return (
      <myConstClass.WrapView>
        <myConstClass.TitleView>
          <myConstClass.TextModule>
            Biểu đồ so sánh doanh thu giữa các ngày
          </myConstClass.TextModule>
        </myConstClass.TitleView>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false} // to hide scroll bar
        >
          {dataValue.length === 0 ? (
            <LineChartComponent dataSource={data2} unit={nameCurrency} />
          ) : (
            <LineChartComponent dataSource={data} unit={nameCurrency} />
          )}
        </ScrollView>
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

  //Convert label in Bar chart
  const convertLabelsLineChart = (itemLists = []) => {
    let _list = Array(new Date().getDate())
      .fill('')
      .map((_, index) => Number(index + 1).toString());
    return _list;
  };

  //Convert Data in Bar chart
  const convertDataLineChart = (itemLists = []) => {
    // let _list = Array(new Date().getDate()).fill('').map()
    let _list = Array(new Date().getDate())
      .fill(0)
      .map((_, index) => {
        let item = itemLists.find(
          _ => parseInt(_.work_date.split('-')[2]) == index + 1,
        );
        if (item) {
          return item.total_payment;
        } else {
          return 0;
        }
      });
    return _list;
  };
  const getMonthList = () => {
    let today = new Date();
    let monthList = [...Array(12)].map((week, index) => {
      let firstDayOfMonth = new Date(today.getFullYear(), index, 1);
      let lastDayOfMonth = new Date(today.getFullYear(), index + 1, 0);
      if (firstDayOfMonth.getMonth() === new Date().getMonth()) {
        setSelected(index);
      }
      return {
        title: `Tháng ${firstDayOfMonth.getMonth() + 1}`,
        firstDayOfMonth,
        lastDayOfMonth,
        month: firstDayOfMonth.getMonth(),
        index,
      };
    });
    let yearList = [...Array(10)].map((year, index) => {
      let dayOfYear = new Date(today.getFullYear() - index, 0, 1, 0, 0, 0);
      return {
        title: `${dayOfYear.getFullYear()}`,
        year: dayOfYear.getFullYear(),
        index,
      };
    });
    setMonthList(monthList);
    setYearList(yearList);
  };

  const onChangeMonth = (month, index) => {
    let from_date = moment(
      new Date(yearList[selectedYear].year, month.month, 1, 0, 0, 0),
    ).format('YYYY-MM-DD HH:mm:ss');
    let to_date = moment(
      new Date(
        yearList[selectedYear].year,
        month.month + 1,
        0,
        23,
        59,
        59,
        999,
      ),
    ).format('YYYY-MM-DD HH:mm:ss');
    setSelected(index);
    setFromDate(from_date);
    setToDate(to_date);
  };

  const onChangeYear = (year, index) => {
    let from_date = moment(
      new Date(year.year, monthList[selected].month, 1, 0, 0, 0),
    ).format('YYYY-MM-DD HH:mm:ss');
    let to_date = moment(
      new Date(year.year, monthList[selected].month + 1, 0, 23, 59, 59, 999),
    ).format('YYYY-MM-DD HH:mm:ss');
    setSelectedYear(index);
    setFromDate(from_date);
    setToDate(to_date);
  };

  return (
    <myConstClass.Wrapper>
      {monthList.length > 0 && (
        <MonthPicker
          listmonth={monthList}
          listYear={yearList}
          onChangeItem={(item, index) => onChangeMonth(item, index)}
          onChangeYear={(item, index) => onChangeYear(item, index)}
          selected={selected}
          selectedYear={selectedYear}
          widthItem={{ width: 110 }}
          widthYear={{ width: 110 }}
        />
      )}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {_renderPieChart()}
          {blockItem()}
          {RevenueByMonth()}
          {_renderTop5Food()}
          {_renderTop5Drink()}
        </>
      )}
    </myConstClass.Wrapper>
  );
};

export default ReportWeek;
