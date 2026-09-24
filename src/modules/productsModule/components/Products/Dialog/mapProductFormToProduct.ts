import { isProductManufacturer } from "@/modules/productsModule/constants/ProductManufacturer";
import { IProduct } from "@/modules/productsModule/types/Product";
import { priceService } from "@/modules/productsModule/services/usePriceService";
import {
	productFormDefaultValues,
	type ProductFormOutput,
} from "@/modules/productsModule/components/Products/Dialog/schema";

export function mapProductFormToProduct(value: ProductFormOutput): IProduct {
	return {
		name: value.info.name,
		sku: value.info.sku,
		description: value.info.description,
		manufacturer: value.info.manufacturer,
		category: value.info.category,
		features: value.info.features,
		price: {
			valueNet: priceService.toCents(value.price.valueNet),
			valueGross: priceService.toCents(value.price.valueGross),
			vatRate: value.price.vatRate,
			currency: value.price.currency,
		},
		isAvailable: value.availability.isAvailable,
		stock: value.availability.isLimited ? value.availability.stock : null,
		limits: {
			minOrderQuantity: value.availability.minOrderQuantity,
			maxOrderQuantity: value.availability.maxOrderQuantity,
		},
	};
}

export function mapProductToFormValues(product: IProduct): typeof productFormDefaultValues {
	return {
		info: {
			name: product.name,
			sku: product.sku,
			description: product.description,
			manufacturer: isProductManufacturer(product.manufacturer) ? product.manufacturer : "",
			category: product.category,
			features: product.features,
		},
		price: {
			valueNet: priceService.fromCents(product.price.valueNet),
			valueGross: priceService.fromCents(product.price.valueGross),
			vatRate: product.price.vatRate,
			currency: product.price.currency,
		},
		availability: {
			isAvailable: product.isAvailable,
			isLimited: product.stock !== null,
			stock: product.stock,
			minOrderQuantity: product.limits.minOrderQuantity,
			maxOrderQuantity: product.limits.maxOrderQuantity,
		},
	};
}
