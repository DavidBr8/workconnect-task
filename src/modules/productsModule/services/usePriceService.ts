import { ECurrency } from "@/constants/Currency";

interface IPriceService {
	roundMoney: (value: number) => number;
	grossFromNet: (net: number, vatRate: number) => number;
	netFromGross: (gross: number, vatRate: number) => number;
	pricesMatch: (net: number, gross: number, vatRate: number) => boolean;
	toCents: (value: number) => number;
	fromCents: (cents: number) => number;
	readNumber: (raw: string) => number;
	format: (cents: number, currency: ECurrency) => string;
}

const roundMoney = (value: number) => {
	return Math.round((value + Number.EPSILON) * 100) / 100;
};

const grossFromNet = (net: number, vatRate: number) => {
	return roundMoney(net * (1 + vatRate / 100));
};

const netFromGross = (gross: number, vatRate: number) => {
	if (vatRate <= -100) return 0;
	return roundMoney(gross / (1 + vatRate / 100));
};

const toCents = (value: number) => {
	return Math.round(value * 100);
};

const pricesMatch = (net: number, gross: number, vatRate: number) => {
	return toCents(grossFromNet(net, vatRate)) === toCents(gross);
};

const fromCents = (cents: number) => {
	return roundMoney(cents / 100);
};

const readNumber = (raw: string) => {
	if (raw.trim() === "") return 0;
	const parsed = Number(raw);
	return Number.isFinite(parsed) ? parsed : 0;
};

const amountFormatter = new Intl.NumberFormat("pl-PL", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
	useGrouping: false,
});

const format = (cents: number, currency: ECurrency) => {
	return `${amountFormatter.format(cents / 100)} ${currency}`;
};

export const priceService: IPriceService = {
	roundMoney,
	grossFromNet,
	netFromGross,
	pricesMatch,
	toCents,
	fromCents,
	readNumber,
	format,
};
