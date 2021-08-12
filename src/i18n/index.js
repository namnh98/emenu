import I18n from 'react-native-i18n';

import {vi, en} from './locales';

I18n.fallbacks = true;
I18n.translations = {
  en,
  vi,
};

export default I18n;
