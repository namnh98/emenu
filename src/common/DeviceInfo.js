import DeviceInfo from 'react-native-device-info';
import base64 from 'react-native-base64';
import {UAParser} from 'ua-parser-js';
import {Platform} from 'react-native';

const getDeviceInfoBase64 = () => {
  var uaString = DeviceInfo.getUserAgentSync();
  var ua = new UAParser(uaString);
  var info = {
    fingerprint: '',
    browser_type: ua.getBrowser().name,
    browser_version: ua.getBrowser().version,
    user_agent: '',
    platform_name: Platform.OS,
    platform_version: Platform.Version,
    name: '',
    marketing_name: '',
    brand: '',
    manufacturer: '',
    model: '',
    board_name: '',
    serial_number: '',
    native_id: DeviceInfo.getUniqueId(),
    firmware_fingerprint: '',
    resolution: '',
    carrier: '',
    last_ip: '',
    last_location: '',
    last_connected_at: '',
    last_app_version: '',
  };

  return base64.encode(JSON.stringify(info));
};

export default getDeviceInfoBase64;
