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
import * as myConstClass from './styleSheet';
import ReportApi from './../../../../api/ReportApi';
import Loading from './Loading';
import moment from 'moment';
import { useSelector } from 'react-redux';
const { width, height } = Dimensions.get('screen');

const ReportYear = () => {
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

  const partners = useSelector((state) => state.partners);
  const nameCurrency = partners.currency.name_vn;

  const [firstSixMonth, setFirstSixMonth] = useState();
  const [lastSixMonth, setLastSixMonth] = useState();
  const [showSixFisrt, setShowSixFirst] = useState(1);

  useEffect(() => {
    getYearList();
  }, []);

  useEffect(() => {
    fetchApi().finally(() => setIsLoading(false));
  }, [fromDate]);

  //format Date
  const getMoment = (...p) => {
    return moment(new Date(new Date(...p))).format('YYYY-MM-DD HH:mm:ss');
  };

  const fetchApi = async () => {
    const newFromDate = new Date(fromDate);
    const newToDate = new Date(toDate);
    let from_date = getMoment(
      newFromDate.getFullYear(),
      newFromDate.getMonth(),
      newFromDate.getDate(),
      0,
      0,
      0,
    );
    let to_date = getMoment(
      newToDate.getFullYear(),
      newToDate.getMonth(),
      newToDate.getDate(),
      23,
      59,
      59,
      999,
    );

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

    try {
      const [
        totalGuestTable,
        totalRevenue,
        totalFirstSix,
        totalLastSix,
      ] = await Promise.all([
        ReportApi.GuestTableByDate(from_date, to_date),
        ReportApi.RevenueByDate(from_date, to_date),
        ReportApi.revenueByYear(fromDateFirstSix, toDateFirstSix),
        ReportApi.revenueByYear(fromDateLasttSix, toDateLastSix),
      ]);

      setTotalGuestTable(totalGuestTable);
      setTotalRevenue(totalRevenue);
      setFirstSixMonth(totalFirstSix);
      setLastSixMonth(totalLastSix);
    } catch (error) {
      setTotalGuestTable([]);
      setTotalRevenue([]);
      setFirstSixMonth([]);
      setLastSixMonth([]);
      console.log('@fetchApi', error);
    }
  };

  /** Render tổng số khách và số bàn  */
  const blockItem = () => {
    const { total_guest_in_day, total_table_booking } = totalGuestTable;
    const { total_revenue_day } = totalRevenue;
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
                  showSixFisrt === 2 ? `${colors.WHITE}` : `${colors.PRIMARY}`,
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

  //Convert label in Bar chart year
  const convertLabelsYear = (itemLists = []) => {
    return itemLists.reduce((_itemLists, cur) => {
      const month = 'Th ' + moment(cur.month).format('M');
      return [..._itemLists, month];
    }, []);
  };

  //Convert Data in Bar chart
  const convertDataYear = (itemLists = []) => {
    return itemLists.reduce((_itemLists, cur) => {
      return [..._itemLists, cur.total_payment];
    }, []);
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
          {blockItem()}
          {salesCompareMonth()}
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
    borderWidth: 1,
    borderColor: `${colors.PRIMARY}`,
    borderRadius: 5,
    marginRight: 10,
  },
});
