import { EProductCategory } from "../constants/ProductCategory";
import { ProductFeatureId } from "../constants/ProductFeature";
import { ProductManufacturer } from "../constants/ProductManufacturer";
import { IPrice } from "@/types/Price";

export interface IProductLimits {
	minOrderQuantity: number;
	maxOrderQuantity: number;
}

export interface IProduct {
	name: string;
	sku: string;
	description: string;
	manufacturer: ProductManufacturer;
	category: EProductCategory;
	price: IPrice;
	isAvailable: boolean;
	stock: number | null;
	features: ProductFeatureId[];
	limits: IProductLimits;
}
