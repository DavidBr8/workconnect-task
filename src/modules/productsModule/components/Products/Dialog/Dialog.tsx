"use client";

import { useEffect, useMemo, useState } from "react";
import { revalidateLogic } from "@tanstack/react-form";
import Dialog from "@/components/Wrappers/Dialog/Dialog";
import { Spinner } from "@/components/ui/spinner";
import { useProductsStore } from "@/modules/productsModule/stores/useProductsStore";
import { productsService } from "@/modules/productsModule/services/useProductsService";
import { useAppForm } from "@/hooks/useAppForm";
import {
	mapProductFormToProduct,
	mapProductToFormValues,
} from "@/modules/productsModule/components/Products/Dialog/mapProductFormToProduct";
import ProductSteps from "@/modules/productsModule/components/Products/Dialog/Partials/Heading";
import { AvailabilityStep } from "@/modules/productsModule/components/Products/Dialog/Partials/Steps/Availability";
import { InfoStep } from "@/modules/productsModule/components/Products/Dialog/Partials/Steps/Info";
import { PriceStep } from "@/modules/productsModule/components/Products/Dialog/Partials/Steps/Price";
import {
	productSteps,
	type ProductStepKey,
} from "@/modules/productsModule/components/Products/Dialog/productSteps";
import {
	productStepIndex,
	useProductDialogSearch,
} from "@/modules/productsModule/components/Products/Dialog/useProductStep";
import {
	createInfoStepSchema,
	createProductFormSchema,
	priceStepSchema,
	productFormDefaultValues,
	productFormOpts,
} from "@/modules/productsModule/components/Products/Dialog/schema";
import { IProduct } from "@/modules/productsModule/types/Product";

export default function AddProductDialog() {
	const [{ step, sku }, setProductDialog] = useProductDialogSearch();
	const isTableLoading = useProductsStore((state) => state.isTableLoading);
	const [visible, setVisible] = useState<{ step: ProductStepKey; sku: string | null } | null>(
		step === null ? null : { step, sku },
	);

	if (step !== null && (visible?.step !== step || visible.sku !== sku)) {
		setVisible({ step, sku });
	}

	const shownSku = sku ?? visible?.sku ?? null;
	const product = useProductsStore((state) =>
		shownSku ? (state.products.find((item) => item.sku === shownSku) ?? null) : null,
	);

	useEffect(() => {
		if (step === null || !sku || product || isTableLoading) return;
		void setProductDialog({ step: null, sku: null });
	}, [isTableLoading, product, setProductDialog, sku, step]);

	const showStep = (index: number) => {
		const next = productSteps[index];
		if (!next) return;
		void setProductDialog({ step: next.key });
	};

	const close = (nextOpen: boolean) => {
		if (nextOpen) return;
		void setProductDialog({ step: null, sku: null });
	};

	const waitingForProduct = Boolean(visible?.sku) && isTableLoading && !product;

	return (
		<Dialog
			open={step !== null}
			onOpenChange={close}
			onOpenChangeComplete={(open) => {
				if (!open) setVisible(null);
			}}
			title={visible?.sku ? "Edytuj produkt" : "Dodaj nowy produkt"}
			bodyClassName='p-0'>
			{waitingForProduct ? (
				<div className='flex flex-1 items-center justify-center py-16'>
					<Spinner className='size-5' />
				</div>
			) : null}
			{visible && (visible.sku === null || product) ? (
				<ProductForm
					key={visible.sku ?? "new"}
					sku={visible.sku}
					product={visible.sku ? product : null}
					step={visible.step}
					onStep={(next) => void setProductDialog({ step: next }, { history: "replace" })}
					onShowStep={showStep}
					onClose={() => void setProductDialog({ step: null, sku: null })}
				/>
			) : null}
		</Dialog>
	);
}

function ProductForm(props: {
	sku: string | null;
	product: IProduct | null;
	step: ProductStepKey;
	onStep: (step: ProductStepKey) => void;
	onShowStep: (index: number) => void;
	onClose: () => void;
}) {
	const { step, sku, product, onStep, onShowStep, onClose } = props;
	const products = useProductsStore((state) => state.products);
	const existingSkus = useMemo(() => products.map((item) => item.sku), [products]);
	const infoStepSchema = useMemo(
		() => createInfoStepSchema(existingSkus, sku),
		[existingSkus, sku],
	);
	const productFormSchema = useMemo(
		() => createProductFormSchema(existingSkus, sku),
		[existingSkus, sku],
	);
	const [saveError, setSaveError] = useState<string | null>(null);
	const form = useAppForm({
		...productFormOpts,
		defaultValues: product ? mapProductToFormValues(product) : productFormDefaultValues,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: productFormSchema,
		},
		onSubmit: async ({ value }) => {
			const parsed = productFormSchema.safeParse(value);
			if (!parsed.success) return;

			const nextProduct = mapProductFormToProduct(parsed.data);
			const saved = sku
				? await productsService.updateProduct(sku, nextProduct)
				: await productsService.addProduct(nextProduct);
			if (!saved) {
				setSaveError("Nie udało się zapisać produktu.");
				return;
			}

			onClose();
		},
	});

	useEffect(() => {
		const blocked = firstBlockingStep(productStepIndex(step), form.state.values, infoStepSchema);
		if (blocked === null) return;
		const next = productSteps[blocked];
		if (!next || next.key === step) return;
		onStep(next.key);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [step]);

	const activeStep = productStepIndex(step);

	return (
		<>
			<ProductSteps
				activeStep={activeStep}
				onStepSelect={(index) => {
					if (index < activeStep) onShowStep(index);
				}}
			/>
			{saveError ? <p className='px-4 pt-3 text-sm text-destructive'>{saveError}</p> : null}
			{activeStep === 0 ? (
				<InfoStep
					form={form}
					schema={infoStepSchema}
					skuReadOnly={sku !== null}
					onNext={() => onShowStep(1)}
				/>
			) : null}
			{activeStep === 1 ? (
				<PriceStep form={form} onBack={() => onShowStep(0)} onNext={() => onShowStep(2)} />
			) : null}
			{activeStep === 2 ? <AvailabilityStep form={form} onBack={() => onShowStep(1)} /> : null}
		</>
	);
}

function firstBlockingStep(
	targetIndex: number,
	values: { info: unknown; price: unknown },
	infoSchema: ReturnType<typeof createInfoStepSchema>,
) {
	if (targetIndex > 0 && !infoSchema.safeParse(values.info).success) return 0;
	if (targetIndex > 1 && !priceStepSchema.safeParse(values.price).success) return 1;
	return null;
}
