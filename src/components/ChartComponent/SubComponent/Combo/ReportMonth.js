import React, {useState, useEffect, useRef} from 'react';
import {Dimensions, ScrollView} from 'react-native';
import MonthPicker from '../MonthPicker';
import {colors} from '../../../../assets';
import FormatMoment from '../../../../untils/FormatMoment';
import {ReportConstants} from './../../../../common';
import BarChartComponent from '../BarChartComponent';
import LineChartComponent from '../LineChartComponent';
import * as myConstClass from './styleSheet';
import ReportApi from './../../../../api/ReportApi';
import Loading from './Loading';
import moment from 'moment';
import {useSelector} from 'react-redux';
const {width, height} = Dimensions.get('screen');

const ReportWeek = () => {
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

  const [totalCompareOfDay, setTotalCompareOfDay] = useState();

  const partners = useSelector((state) => state.partners);
  const nameCurrency = partners.currency.name_vn;

  useEffect(() => {
    getMonthList();
  }, []);

  useEffect(() => {
    fetchApi().finally(() => setIsLoading(false));
  }, [fromDate]);

  const fetchApi = async () => {
    try {
      const [
        totalGuestTable,
        totalRevenue,
        totalCompareOfDay,
      ] = await Promise.all([
        ReportApi.GuestTableByDate(fromDate, toDate),
        ReportApi.RevenueByDate(fromDate, toDate),
        ReportApi.revenueByMonth(fromDate, toDate),
      ]);

      setTotalGuestTable(totalGuestTable);
      setTotalRevenue(totalRevenue);
      setTotalCompareOfDay(totalCompareOfDay);
    } catch (error) {
      setTotalGuestTable([]);
      setTotalRevenue([]);
      setTotalCompareOfDay([]);
      console.log('@fetchApi', error);
    }
  };

  /** Render tổng số khách và số bàn  */
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
            {total_revenue_day && total_revenue_day != null
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
  const convertLabelsLineChart = (itemLists = []) => {
    return itemLists.reduce((_itemLists, cur) => {
      const month = moment(cur.work_date).format('DD');
      return [..._itemLists, month];
    }, []);
  };

  //Convert Data in Bar chart
  const convertDataLineChart = (itemLists = []) => {
    return itemLists.reduce((_itemLists, cur) => {
      return [..._itemLists, cur.total_payment];
    }, []);
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
          widthItem={{width: 110}}
          widthYear={{width: 110}}
        />
      )}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {blockItem()}
          {RevenueByMonth()}
        </>
      )}
    </myConstClass.Wrapper>
  );
};

export default ReportWeek;
