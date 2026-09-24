"use client";

import { parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import {
	productSteps,
	type ProductStepKey,
} from "@/modules/productsModule/components/Products/Dialog/productSteps";

const productStepKeys = productSteps.map((step) => step.key);

export function useProductDialogSearch() {
	return useQueryStates(
		{
			step: parseAsStringLiteral(productStepKeys),
			sku: parseAsString,
		},
		{
			history: "push",
			scroll: false,
		},
	);
}

export function productStepIndex(step: ProductStepKey | null) {
	if (step === null) return 0;
	return productSteps.findIndex((item) => item.key === step);
}
