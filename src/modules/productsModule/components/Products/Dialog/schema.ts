import { formOptions } from "@tanstack/react-form";
import { z } from "zod";
import { ECurrency } from "@/constants/Currency";
import { EProductCategory } from "@/modules/productsModule/constants/ProductCategory";
import {
	productFeatureIds,
	type ProductFeatureId,
} from "@/modules/productsModule/constants/ProductFeature";
import {
	isProductManufacturer,
	productManufacturers,
	type ProductManufacturer,
} from "@/modules/productsModule/constants/ProductManufacturer";
import { priceService } from "@/modules/productsModule/services/usePriceService";

const currencyValues = [ECurrency.PLN, ECurrency.EUR, ECurrency.USD] as const;

const categoryValues = [
	EProductCategory.COMPUTER,
	EProductCategory.MOBILE_PHONE,
	EProductCategory.RTV,
	EProductCategory.AGD,
	EProductCategory.ACCESSORIES,
] as const;

const infoStepObject = z.object({
	name: z.string().trim().min(1, "Podaj nazwę produktu"),
	sku: z
		.string()
		.trim()
		.min(1, "Podaj SKU produktu")
		.regex(/^[A-Za-z0-9-]+$/, "SKU może zawierać tylko litery, cyfry i myślnik"),
	description: z.string().trim().min(1, "Podaj opis produktu"),
	manufacturer: z
		.union([z.literal(""), z.enum(productManufacturers)])
		.refine(
			(value): value is ProductManufacturer => isProductManufacturer(value),
			"Wybierz producenta",
		),
	category: z
		.union([z.literal(""), z.enum(categoryValues)])
		.refine((value): value is EProductCategory => value !== "", "Wybierz kategorię"),
	features: z.array(z.enum(productFeatureIds)),
});

export function createInfoStepSchema(existingSkus: readonly string[], currentSku?: string | null) {
	const ignoredSku = currentSku?.trim().toLowerCase() ?? "";
	const knownSkus = new Set(
		existingSkus
			.map((sku) => sku.trim().toLowerCase())
			.filter((sku) => sku.length > 0 && sku !== ignoredSku),
	);

	return infoStepObject.superRefine((value, ctx) => {
		const sku = value.sku.trim().toLowerCase();
		if (!sku || !knownSkus.has(sku)) return;

		ctx.addIssue({
			code: "custom",
			message: "Produkt o takim SKU już istnieje",
			path: ["sku"],
		});
	});
}

export const priceStepSchema = z
	.object({
		valueNet: z.number("Podaj cenę netto").positive("Cena netto musi być większa od 0"),
		valueGross: z.number("Podaj cenę brutto").positive("Cena brutto musi być większa od 0"),
		vatRate: z
			.number("Podaj stawkę VAT")
			.min(0, "Stawka VAT nie może być ujemna")
			.max(100, "Stawka VAT nie może przekraczać 100%"),
		currency: z.enum(currencyValues, "Wybierz walutę"),
	})
	.superRefine((value, ctx) => {
		if (priceService.pricesMatch(value.valueNet, value.valueGross, value.vatRate)) return;

		ctx.addIssue({
			code: "custom",
			message: "Cena brutto nie zgadza się z netto i stawką VAT",
			path: ["valueGross"],
		});
	});

export const availabilityStepSchema = z
	.object({
		isAvailable: z.boolean(),
		isLimited: z.boolean(),
		stock: z
			.number("Podaj stan magazynowy")
			.int("Stan magazynowy musi być liczbą całkowitą")
			.min(0, "Stan magazynowy nie może być ujemny")
			.nullable(),
		minOrderQuantity: z
			.number("Podaj minimalną ilość")
			.int("Minimalna ilość musi być liczbą całkowitą")
			.min(1, "Minimalna ilość musi wynosić co najmniej 1"),
		maxOrderQuantity: z
			.number("Podaj maksymalną ilość")
			.int("Maksymalna ilość musi być liczbą całkowitą")
			.min(1, "Maksymalna ilość musi wynosić co najmniej 1"),
	})
	.superRefine((value, ctx) => {
		if (value.isLimited && value.stock === null) {
			ctx.addIssue({
				code: "custom",
				message: "Podaj stan magazynowy",
				path: ["stock"],
			});
		}

		if (value.maxOrderQuantity < value.minOrderQuantity) {
			ctx.addIssue({
				code: "custom",
				message: "Maksymalna ilość nie może być mniejsza od minimalnej",
				path: ["maxOrderQuantity"],
			});
		}
	});

export function createProductFormSchema(
	existingSkus: readonly string[],
	currentSku?: string | null,
) {
	return z.object({
		info: createInfoStepSchema(existingSkus, currentSku),
		price: priceStepSchema,
		availability: availabilityStepSchema,
	});
}

export type ProductFormOutput = z.output<ReturnType<typeof createProductFormSchema>>;
export type InfoStepSchema = ReturnType<typeof createInfoStepSchema>;

export const productFormDefaultValues = {
	info: {
		name: "",
		sku: "",
		description: "",
		manufacturer: "" as ProductManufacturer | "",
		category: "" as EProductCategory | "",
		features: [] as ProductFeatureId[],
	},
	price: {
		valueNet: 0,
		valueGross: 0,
		vatRate: 23,
		currency: ECurrency.PLN,
	},
	availability: {
		isAvailable: true,
		isLimited: false,
		stock: null as number | null,
		minOrderQuantity: 1,
		maxOrderQuantity: 10,
	},
};

export const productFormOpts = formOptions({
	defaultValues: productFormDefaultValues,
});
