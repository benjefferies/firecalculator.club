import { expect, use } from 'chai';
import chaiSubset from 'chai-subset';
import { formatCurrency, getCurrency } from '../../service/CurrencyService';
use(chaiSubset);

describe('CurrencyService', () => {
  const languageGetter = jest.spyOn(window.navigator, 'language', 'get');

  test('format currency en no country', () => {
    languageGetter.mockReturnValue('en');
    expect(formatCurrency(10)).to.equal('£10.00');
  });

  test('format currency GBP', () => {
    languageGetter.mockReturnValue('en-GB');
    expect(formatCurrency(10)).to.equal('£10.00');
  });

  test('format currency USD', () => {
    languageGetter.mockReturnValue('en-US');
    expect(formatCurrency(10)).to.equal('$10.00');
  });

  test('get currency symbol GBP', () => {
    languageGetter.mockReturnValue('en-GB');
    expect(getCurrency()).to.be.equal('£');
  });

  test('get currency symbol USD', () => {
    languageGetter.mockReturnValue('en-US');
    expect(getCurrency()).to.be.equal('$');
  });
});
