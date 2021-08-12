import moment from 'moment';

const FormatBirthday = (birthday) => {
  const result = moment(birthday).format('DD-MM-YYYY');
  return result;
};

const FormatTime = (time) => {
  const result = moment(time).format('HH:mm');
  return result;
};

const FormatCurrentDate = () => {
  const curDate = Date.now();
  const result = moment(curDate).format('DD/MM/YYYY - HH:mm');
  return result;
};

const NumberWithCommas = (x) => {
  if (x !== null) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else {
    return '0';
  }
};

export default {
  FormatBirthday,
  FormatTime,
  FormatCurrentDate,
  NumberWithCommas,
};
