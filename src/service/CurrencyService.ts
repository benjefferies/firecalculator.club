import LocaleCurrency from 'locale-currency';

export const formatCurrency = (money: number) => {
  let localeLanguage = navigator.language;
  if (localeLanguage === 'en') {
    localeLanguage = 'en-GB';
  }
  let currencyCode = LocaleCurrency.getCurrency(localeLanguage);
  if (currencyCode === null) {
    currencyCode = 'GBP';
  }
  return money.toLocaleString(localeLanguage, {
    style: 'currency',
    currency: currencyCode,
  });
};

export const getCurrency = () => {
  const localeLanguage = navigator.language;
  const currencyCode = LocaleCurrency.getCurrency(localeLanguage);
  return (0)
    .toLocaleString(localeLanguage, {
      style: 'currency',
      currency: currencyCode,
    })
    .substring(0, 1);
};
