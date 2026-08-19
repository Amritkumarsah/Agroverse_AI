import { LanguageCode } from '../types';
import { t } from '../data/translations';

export const getTranslation = (lang: LanguageCode, key: string): string => {
  return t(lang, key);
};
