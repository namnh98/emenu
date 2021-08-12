import React, {useState, useEffect} from 'react';
import {Dimensions, ScrollView} from 'react-native';
import DropDown from '../DropDown';
import {colors} from '../../../../assets';
import FormatMoment from '../../../../untils/FormatMoment';
import BarChartComponent from '../BarChartComponent';
import PieChartComponent from '../PieChartComponent';
import ReportApi from './../../../../api/ReportApi';
import * as myConstClass from './styleSheet';
import {ReportConstants} from './../../../../common';
import MonthPicker from '../MonthPicker';
import Loading from './Loading';
import {useIsFocused} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import moment from 'moment';
import {useSelector} from 'react-redux';

const {width, height} = Dimensions.get('screen');

const ReportQuater = () => {
  const partners = useSelector((state) => state.partners);
  const nameCurrency = partners.currency.name_vn;
  let dateNowCur = new Date();
  let firstdate = moment(
    new Date(new Date(dateNowCur.getFullYear(), 0, 1, 0, 0, 0)),
  );
  let lastdate = moment(
    new Date(new Date(dateNowCur.getFullYear(), 3, 0, 23, 59, 59, 999)),
  );

  const [selected, setSelected] = useState();
  const [selectedYear, setSelectedYear] = useState(0);

  const [quaterlyList, setQuaterlyList] = useState([]);
  const [yearList, setYearList] = useState([]);
  const [fromDate, setFromDate] = useState(firstdate);
  const [toDate, setToDate] = useState(lastdate);
  const [isLoading, setIsLoading] = useState(true);
  const [totalGuestTable, setTotalGuestTable] = useState();
  const [totalRevenue, setTotalRevenue] = useState();
  const [totalTopFood, setTotalTopFood] = useState();
  const [totalTopDrink, setTotalTopDrink] = useState();

  const focused = useIsFocused();
  const [date, setDate] = useState();
  const currDate = moment(); //date hiện tại

  useEffect(() => {
    getQuaterlyList();
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
      const {action} = remoteMessage.data;
      if (action === 'finished_payment') {
        getApiUpdateReport();
      }
    });
  }, []);

  /**
   * Gọi api report theo quý
   * @returns
   */
  const fetchApi = async () => {
    const newFromDate = new Date(fromDate);
    const newToDate = new Date(toDate);
    let from_date = moment(
      new Date(
        new Date(
          newFromDate.getFullYear(),
          newFromDate.getMonth(),
          newFromDate.getDate(),
          0,
          0,
          0,
        ),
      ),
    ).format('YYYY-MM-DD HH:mm:ss');
    let to_date = moment(
      new Date(
        new Date(
          newToDate.getFullYear(),
          newToDate.getMonth(),
          newToDate.getDate(),
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
        totalGuestTable,
        totalRevenue,
        totalTopFood,
        totalTopDrink,
      ] = await Promise.all([
        ReportApi.GuestTableByDate(from_date, to_date),
        ReportApi.RevenueByDate(from_date, to_date),
        ReportApi.RevenueTopFoodByDate(from_date, to_date),
        ReportApi.RevenueTopDrinkByDate(from_date, to_date),
      ]);

      setTotalGuestTable(totalGuestTable);
      setTotalRevenue(totalRevenue);
      setTotalTopFood(totalTopFood);
      setTotalTopDrink(totalTopDrink);
    } catch (error) {
      setTotalGuestTable([]);
      setTotalRevenue([]);
      setTotalTopFood([]);
      setTotalTopDrink([]);
      console.log('@fetchApi', error);
    }
  };

  /**
   * Gọi lại api report theo quý thỏa điều kiện realtime
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
                  style={{   backgroundColor: `${desc.color}`}}
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

  // Khởi tạo giá trị quý và năm
  const getQuaterlyList = () => {
    let today = new Date();
    let selectedQuaterly = null;
    let quaterlyList = [...Array(4)].map((week, index) => {
      let firstDayOfQuarterly = new Date(
        today.getFullYear(),
        index * 3,
        1,
        0,
        0,
        0,
      );
      let lastDayOfQuaterly = new Date(
        today.getFullYear(),
        index * 3 + 3,
        0,
        23,
        59,
        59,
        999,
      );
      if (firstDayOfQuarterly.getMonth() <= today.getMonth() && today.getMonth() <= lastDayOfQuaterly.getMonth()) {
        selectedQuaterly = index;
      }
      return {
        title: `Quý ${index + 1}`,
        firstDayOfQuarterly,
        lastDayOfQuaterly,
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
    setSelected(selectedQuaterly)
    setQuaterlyList(quaterlyList);
    setYearList(yearList);
  };


  const onChangeQuarterly = (quarterly, index) => {
    const {firstDayOfQuarterly, lastDayOfQuaterly} = quarterly;
    let from_date = moment(
      new Date(
        new Date(
          yearList[selectedYear].year,
          firstDayOfQuarterly.getMonth(),
          firstDayOfQuarterly.getDate(),
          0,
          0,
          0,
        ),
      ),
    );
    let to_date = moment(
      new Date(
        new Date(
          yearList[selectedYear].year,
          lastDayOfQuaterly.getMonth(),
          lastDayOfQuaterly.getDate(),
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

  const onChangeYear = (year, index) => {
    const {firstDayOfQuarterly, lastDayOfQuaterly} = quaterlyList[selected];
    let firsDate = firstDayOfQuarterly.getMonth();
    let lastDate = lastDayOfQuaterly.getMonth();
    let from_date = moment(new Date(year.year, firsDate, 1, 0, 0, 0)).format(
      'YYYY-MM-DD HH:mm:ss',
    );
    let to_date = moment(
      new Date(year.year, lastDate + 1, 0, 23, 59, 59, 999),
    ).format('YYYY-MM-DD HH:mm:ss');
    setSelectedYear(index);
    setFromDate(from_date);
    setToDate(to_date);
  };

  return (
    <myConstClass.Wrapper>
      {quaterlyList.length > 0 && (
        <MonthPicker
          listmonth={quaterlyList}
          listYear={yearList}
          onChangeItem={(item, index) => onChangeQuarterly(item, index)}
          onChangeYear={(item, index) => onChangeYear(item, index)}
          selected={selected}
          selectedYear={selectedYear}
          widthItem={{width: 150}}
          widthYear={{width: 60}}
        />
      )}

      {isLoading ? (
        <Loading />
      ) : (
        <>
          {_renderPieChart()}
          {blockItem()}
          {_renderTop5Food()}
          {_renderTop5Drink()}
        </>
      )}
    </myConstClass.Wrapper>
  );
};

export default ReportQuater;
