import { ECurrency } from "@/constants/Currency";

export interface IPrice {
	valueNet: number; // in cents
	valueGross: number; // in cents
	vatRate: number;
	currency: ECurrency;
}
