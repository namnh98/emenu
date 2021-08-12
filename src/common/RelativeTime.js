import moment from 'moment';
import 'moment/locale/vi';

const RelativeTime = (date) => {
  const m = moment(date).fromNow();
  return m;
};

export default RelativeTime;
