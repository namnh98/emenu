import React, {useState, useEffect} from 'react';
import {Dimensions, ScrollView} from 'react-native';
import {colors} from '../../../../assets';
import FormatMoment from '../../../../untils/FormatMoment';
import ReportApi from './../../../../api/ReportApi';
import * as myConstClass from './styleSheet';
import {ReportConstants} from './../../../../common';
import MonthPicker from '../MonthPicker';
import Loading from './Loading';
import moment from 'moment';
import {useSelector} from 'react-redux';
const {width, height} = Dimensions.get('screen');

const ReportQuater = () => {
  let date = new Date();
  let firstdate = moment(new Date(new Date(date.getFullYear(), 0, 1, 0, 0, 0)));
  let lastdate = moment(
    new Date(new Date(date.getFullYear(), 3, 0, 23, 59, 59, 999)),
  );

  const [selected, setSelected] = useState(0);
  const [selectedYear, setSelectedYear] = useState(0);

  const [quaterlyList, setQuaterlyList] = useState([]);
  const [yearList, setYearList] = useState([]);
  const [fromDate, setFromDate] = useState(firstdate);
  const [toDate, setToDate] = useState(lastdate);
  const [isLoading, setIsLoading] = useState(true);
  const [totalGuestTable, setTotalGuestTable] = useState();
  const [totalRevenue, setTotalRevenue] = useState();
  const partners = useSelector((state) => state.partners);
  const nameCurrency = partners.currency.name_vn;

  useEffect(() => {
    getQuaterlyList();
  }, []);

  useEffect(() => {
    fetchApi().finally(() => setIsLoading(false));
  }, [fromDate]);

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
    try {
      const [totalGuestTable, totalRevenue] = await Promise.all([
        ReportApi.GuestTableByDate(from_date, to_date),
        ReportApi.RevenueByDate(from_date, to_date),
      ]);

      setTotalGuestTable(totalGuestTable);
      setTotalRevenue(totalRevenue);
    } catch (error) {
      setTotalGuestTable([]);
      setTotalRevenue([]);
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

  // Khởi tạo giá trị quý và năm
  const getQuaterlyList = () => {
    let today = new Date();
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

      {isLoading ? <Loading /> : <>{blockItem()}</>}
    </myConstClass.Wrapper>
  );
};

export default ReportQuater;
