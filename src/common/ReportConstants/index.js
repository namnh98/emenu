const GuestAndTable = [
  'Số khách trong ngày',//0
  'Số khách đang dùng',//1
  'Bàn đặt nhiều',//2
  'Số lượng bàn đang dùng',//3
  'Số lượng đặt bàn',//4
  'Số lượng bàn trống',//5
  'Tổng số khách',//6
  'Tổng doanh thu'//7
]

/**
 * Get Dates in Week from Sunday -> Saturday
 */
const getDatesOfWeek = (current) => {
  // clone object date
  let currentTemp = new Date(current);
  var week = [];
  // Starting Monday not Sunday
  currentTemp.setDate(currentTemp.getDate() - currentTemp.getDay());
  for (var i = 0; i < 7; i++) {
    week.push(new Date(currentTemp));
    currentTemp.setDate(currentTemp.getDate() + 1);
  }
  return week;
}

//format Date YYYY-MM-DD HH:mm:ss
const getMomentDefault = (...p) => {
  return moment(new Date(new Date(...p))).format("YYYY-MM-DD HH:mm:ss")
}

//format Date YYYY-MM-DD
const getMomentDefault2 = (...p) => {
  return moment(new Date(new Date(...p))).format("YYYY-MM-DD")
}

const PARTNERTYPE = [{ normal: 1, buffet: 2, karaoke: 3, consumerGoods: 4 }]
const STATUS_ONLINE = [{ past: -1, offline: 0, online: 1 }]
const TIMEUPDATEREPORT = 1

export default {
  GuestAndTable,
  TIMEUPDATEREPORT,
  getDatesOfWeek,
  getMomentDefault,
  getMomentDefault2
};