import FormatMoment from './FormatMoment';
const formatMoney = s => {
  let _s = Number(s);

  //TODO: format money
  // let thousand =
  //   parseInt(_s / 1000) < 1000
  //     ? parseInt(_s / 1000)
  //     : parseInt(_s / 1000) % 1000;
  // let million =
  //   parseInt(_s / 1000000) < 1000
  //     ? parseInt(_s / 1000000)
  //     : parseInt(_s / 1000000) % 1000;
  // let billion = parseInt(_s / 1000000000);
  // let _string =
  //   '' + (billion ? billion + 'B ' : '') + (million ? million + 'M ' : '');
  // return _string;
  // return FormatMoment.NumberWithCommas(parseInt(_s / 1000).toString()) + 'K ';
    return FormatMoment.NumberWithCommas(s)

};
export default formatMoney;
