import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import DropDown from '../DropDown';
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

const ReportYear = () => {
  const partners = useSelector((state) => state.partners);
  const nameCurrency = partners.currency.name_vn;

  let firstdate = moment(
    new Date(new Date(new Date().getFullYear(), 0, 1, 0, 0, 0)),
  );
  let lastdate = moment(
    new Date(new Date(new Date().getFullYear(), 12, 0, 23, 59, 59, 999)),
  );

  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState(0);
  const [yearList, setYearList] = useState([]);

  const [fromDate, setFromDate] = useState(firstdate);
  const [toDate, setToDate] = useState(lastdate);

  const [totalGuestTable, setTotalGuestTable] = useState();
  const [totalRevenue, setTotalRevenue] = useState();
  const [totalTopFood, setTotalTopFood] = useState();
  const [totalTopDrink, setTotalTopDrink] = useState();

  const [firstSixMonth, setFirstSixMonth] = useState();
  const [lastSixMonth, setLastSixMonth] = useState();
  const [showSixFisrt, setShowSixFirst] = useState(1);

  const focused = useIsFocused();
  const [date, setDate] = useState();
  const currDate = moment(); //date hiện tại

  useEffect(() => {
    getYearList();
  }, []);

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
    return messaging().onMessage(async (remoteMessage) => {
      const { action } = remoteMessage.data;
      if (action === 'finished_payment') {
        getApiUpdateReport();
      }
    });
  }, []);

  //format Date
  const getMoment = (...p) => {
    return moment(new Date(new Date(...p))).format('YYYY-MM-DD HH:mm:ss');
  };

  /**
   * Gọi  api report theo năm thỏa điều kiện realtime
   */
  const fetchApi = async () => {
    const newFromDate = new Date(fromDate);
    const newToDate = new Date(toDate);
    let from_date = moment(
      new Date(
        newFromDate.getFullYear(),
        newFromDate.getMonth(),
        newFromDate.getDate(),
        0,
        0,
        0,
      ),
    ).format('YYYY-MM-DD HH:mm:ss');
    let to_date = moment(
      new Date(
        newToDate.getFullYear(),
        newToDate.getMonth(),
        newToDate.getDate(),
        23,
        59,
        59,
        999,
      ),
    ).format('YYYY-MM-DD HH:mm:ss');

    let fromDateFirstSix = getMoment(newFromDate.getFullYear(), 0, 1, 0, 0, 0);
    let toDateFirstSix = getMoment(
      newFromDate.getFullYear(),
      6,
      0,
      23,
      59,
      59,
      999,
    );
    let fromDateLasttSix = getMoment(newFromDate.getFullYear(), 7, 1, 0, 0, 0);
    let toDateLastSix = getMoment(
      newFromDate.getFullYear(),
      12,
      0,
      23,
      59,
      59,
      999,
    );

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
        totalFirstSix,
        totalLastSix,
      ] = await Promise.all([
        ReportApi.GuestTableByDate(from_date, to_date),
        ReportApi.RevenueByDate(from_date, to_date),
        ReportApi.RevenueTopFoodByDate(from_date, to_date),
        ReportApi.RevenueTopDrinkByDate(from_date, to_date),
        ReportApi.revenueByYear(fromDateFirstSix, toDateFirstSix),
        ReportApi.revenueByYear(fromDateLasttSix, toDateLastSix),
      ]);

      setTotalGuestTable(totalGuestTable);
      setTotalRevenue(totalRevenue);
      setTotalTopFood(totalTopFood);
      setTotalTopDrink(totalTopDrink);
      setFirstSixMonth(totalFirstSix);
      setLastSixMonth(totalLastSix);
    } catch (error) {
      setTotalGuestTable([]);
      setTotalRevenue([]);
      setTotalTopFood([]);
      setTotalTopDrink([]);
      setFirstSixMonth([]);
      setLastSixMonth([]);
      console.log('@fetchApi', error);
    }
  };

  /**
   * Gọi lại api report theo năm thỏa điều kiện realtime
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

  /** so sánh doanh thu các tháng */
  const salesCompareMonth = () => {
    let sixFirst = {};
    let sixLast = {};
    if (showSixFisrt === 1) {
      let labels = convertLabelsYear(firstSixMonth);
      let data = convertDataYear(firstSixMonth);
      sixFirst = {
        labels,
        datasets: [
          {
            data,
          },
        ],
      };
    }

    if (showSixFisrt === 2) {
      let labels = convertLabelsYear(lastSixMonth);
      let data = convertDataYear(lastSixMonth);
      sixLast = {
        labels,
        datasets: [
          {
            data,
          },
        ],
      };
    }

    return (
      <myConstClass.WrapView>
        <myConstClass.TitleView>
          <myConstClass.TextModule>
            biểu đồ so sánh giữa các tháng
          </myConstClass.TextModule>
        </myConstClass.TitleView>
        <myConstClass.ButtonView>
          <TouchableOpacity
            onPress={() => setShowSixFirst(1)}
            style={[
              styles.TouchBtn,
              {
                backgroundColor:
                  showSixFisrt === 1 ? `${colors.ORANGE}` : `${colors.WHITE}`,
              },
            ]}>
            <myConstClass.TextButton
              style={{
                color:
                  showSixFisrt === 1 ? `${colors.WHITE}` : `${colors.ORANGE}`,
              }}>
              6 tháng đầu năm
            </myConstClass.TextButton>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowSixFirst(2)}
            style={[
              styles.TouchBtn,
              {
                backgroundColor:
                  showSixFisrt === 2 ? `${colors.ORANGE}` : `${colors.WHITE}`,
              },
            ]}>
            <myConstClass.TextButton
              style={{
                color:
                  showSixFisrt === 2 ? `${colors.WHITE}` : `${colors.ORANGE}`,
              }}>
              6 tháng cuối năm
            </myConstClass.TextButton>
          </TouchableOpacity>
        </myConstClass.ButtonView>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false} // to hide scroll bar
        >
          <BarChartComponent
            dataSource={showSixFisrt === 1 ? sixFirst : sixLast}
            unit={nameCurrency}
          />
        </ScrollView>
      </myConstClass.WrapView>
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

  //Convert label in Bar chart year
  const convertLabelsYear = (itemLists = []) => {
    let _list = Array(12)
      .fill('')
      .map((item, index) => 'Th ' + Number(index + 1));
    return showSixFisrt===1 ? _list.splice(0, 6) : _list.splice(6, 12);
  };

  //Convert Data in Bar chart
  const convertDataYear = (itemLists = []) => {
    //[{"month": "2021-05", "total_payment": 2597133139}]
    let _list  = Array(12)
        .fill(0)
        .map((_, index) => {
          let item = itemLists.find(
            _ => parseInt(_.month.split('-')[1]) == index + 1,
          );
          if (item) {
            return item.total_payment;
          } else {
            return 0;
          }
        });

    return showSixFisrt===1 ? _list.splice(0, 6) : _list.splice(6, 12);
  };

  const getYearList = () => {
    let today = new Date();
    let yearList = [...Array(10)].map((year, index) => {
      let firstDayOfYear = new Date(today.getFullYear() - index, 0, 1, 0, 0, 0);
      let lastDayOfYear = new Date(
        today.getFullYear() - index,
        12,
        0,
        23,
        59,
        59,
        999,
      );
      return {
        title: `${firstDayOfYear.getFullYear()}`,
        firstDayOfYear,
        lastDayOfYear,
        index,
      };
    });
    setYearList(yearList);
  };

  const onChangeYear = (year, index) => {
    let { firstDayOfYear, lastDayOfYear } = year;
    let from_date = moment(
      new Date(
        new Date(
          firstDayOfYear.getFullYear(),
          firstDayOfYear.getMonth(),
          firstDayOfYear.getDate(),
          0,
          0,
          0,
        ),
      ),
    );
    let to_date = moment(
      new Date(
        new Date(
          lastDayOfYear.getFullYear(),
          lastDayOfYear.getMonth(),
          lastDayOfYear.getDate(),
          23,
          59,
          59,
          999,
        ),
      ),
    );
    setSelected(index);
    setFromDate(from_date);
    setToDate(to_date);
  };

  return (
    <myConstClass.Wrapper>
      {yearList.length > 0 && (
        <DropDown
          listYear={yearList}
          onChangeItem={(item, index) => onChangeYear(item, index)}
          selected={selected}
          widthItem={{ width: 110 }}
        />
      )}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {_renderPieChart()}
          {blockItem()}
          {salesCompareMonth()}
          {_renderTop5Food()}
          {_renderTop5Drink()}
        </>
      )}
    </myConstClass.Wrapper>
  );
};

export default ReportYear;
const styles = StyleSheet.create({
  TouchBtn: {
    padding: 10,
    backgroundColor: `${colors.WHITE}`,
    borderRadius: 20,
    marginRight: 10,
  },
});
