import type { Currency, Locale } from '@tonelle/shared';
import clsx from 'clsx';
import { BigNumber } from '@/components/motion/BigNumber';

/** Split a price into currency prefix/suffix and number, matching `formatPrice` in @tonelle/shared. */
export function priceParts(amount: number, currency: Currency, locale: Locale) {
  const intlLocale = locale === 'tr' ? 'tr-TR' : 'en-IE';
  const decimals = Number.isInteger(amount) ? 0 : 2;
  const parts = new Intl.NumberFormat(intlLocale, {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: 2,
  }).formatToParts(amount);
  const firstNum = parts.findIndex((p) => p.type === 'integer');
  let lastNum = -1;
  parts.forEach((p, i) => {
    if (p.type === 'integer' || p.type === 'fraction' || p.type === 'decimal' || p.type === 'group') lastNum = i;
  });
  const join = (list: Intl.NumberFormatPart[]) => list.map((p) => p.value).join('');
  return {
    intlLocale,
    decimals,
    prefix: join(parts.slice(0, firstNum)),
    suffix: join(parts.slice(lastNum + 1)),
  };
}

/** BRIK-style big light numeral price that counts up when it scrolls into view. */
export function PriceNumeral({
  amount,
  currency,
  locale,
  className,
}: {
  amount: number;
  currency: Currency;
  locale: Locale;
  className?: string;
}) {
  const { intlLocale, decimals, prefix, suffix } = priceParts(amount, currency, locale);
  return (
    <BigNumber
      value={amount}
      decimals={decimals}
      prefix={prefix}
      suffix={suffix}
      locale={intlLocale}
      className={clsx('numeral', className)}
    />
  );
}
