"use client";

import { cn } from "cn";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	EProductCategory,
	ProductCategoryLabels,
} from "@/modules/productsModule/constants/ProductCategory";
import {
	productFeatures,
	type ProductFeatureId,
} from "@/modules/productsModule/constants/ProductFeature";
import {
	productManufacturers,
	type ProductManufacturer,
} from "@/modules/productsModule/constants/ProductManufacturer";
import { withForm } from "@/hooks/useAppForm";
import {
	createInfoStepSchema,
	productFormOpts,
} from "@/modules/productsModule/components/Products/Dialog/schema";
import FormField from "@/components/Wrappers/FormField/FormField";
import StepShell from "@/modules/productsModule/components/Products/Dialog/Partials/StepShell";
import { badgeVariants } from "@/components/ui/badge";

const categoryItems = Object.values(EProductCategory).map((category) => ({
	value: category,
	label: ProductCategoryLabels[category],
}));

export const InfoStep = withForm({
	...productFormOpts,
	props: {
		schema: createInfoStepSchema([]),
		onNext: () => {},
		skuReadOnly: false,
	},
	render: function Render({ form, schema, onNext, skuReadOnly }) {
		return (
			<form.FormGroup
				name='info'
				validators={{ onDynamic: schema }}
				onGroupSubmit={() => {
					onNext();
				}}>
				{(group) => (
					<StepShell onSubmit={() => void group.handleSubmit()} submitLabel='Dalej' showNextIcon>
						<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
							<form.Field name='info.name'>
								{(field) => (
									<FormField
										label='Nazwa produktu'
										htmlFor={field.name}
										errors={field.state.meta.errors}>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											placeholder='np. MacBook Pro 14'
											aria-invalid={field.state.meta.errors.length > 0}
											onBlur={field.handleBlur}
											onChange={(event) => field.handleChange(event.target.value)}
										/>
									</FormField>
								)}
							</form.Field>
							<form.Field name='info.sku'>
								{(field) => (
									<FormField
										label='SKU produktu'
										htmlFor={field.name}
										errors={field.state.meta.errors}>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											placeholder='np. MBP14M3PRO'
											readOnly={skuReadOnly}
											aria-invalid={field.state.meta.errors.length > 0}
											onBlur={field.handleBlur}
											onChange={(event) => {
												if (skuReadOnly) return;
												field.handleChange(event.target.value);
											}}
										/>
									</FormField>
								)}
							</form.Field>
						</div>
						<form.Field name='info.description'>
							{(field) => (
								<FormField
									label='Opis produktu'
									htmlFor={field.name}
									errors={field.state.meta.errors}>
									<Textarea
										id={field.name}
										name={field.name}
										value={field.state.value}
										placeholder='Krótki opis produktu'
										aria-invalid={field.state.meta.errors.length > 0}
										onBlur={field.handleBlur}
										onChange={(event) => field.handleChange(event.target.value)}
									/>
								</FormField>
							)}
						</form.Field>
						<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
							<form.Field name='info.manufacturer'>
								{(field) => (
									<ManufacturerField
										id={field.name}
										value={field.state.value}
										invalid={field.state.meta.errors.length > 0}
										errors={field.state.meta.errors}
										onBlur={field.handleBlur}
										onChange={field.handleChange}
									/>
								)}
							</form.Field>
							<form.Field name='info.category'>
								{(field) => (
									<CategoryField
										id={field.name}
										value={field.state.value}
										invalid={field.state.meta.errors.length > 0}
										errors={field.state.meta.errors}
										onBlur={field.handleBlur}
										onChange={field.handleChange}
									/>
								)}
							</form.Field>
						</div>
						<form.Field name='info.features'>
							{(field) => (
								<FormField label='Cechy produktu' errors={field.state.meta.errors}>
									<div className='flex flex-wrap gap-2'>
										{productFeatures.map((feature) => {
											const selected = field.state.value.includes(feature.id);
											return (
												<button
													key={feature.id}
													type='button'
													aria-pressed={selected}
													className={cn(
														badgeVariants({ variant: selected ? "default" : "outline" }),
														"cursor-pointer rounded-full transition-colors focus-visible:ring-3 focus-visible:ring-ring/30",
														selected
															? "border-primary bg-primary/5 text-primary"
															: "border-border bg-background text-foreground hover:bg-muted",
													)}
													onClick={() =>
														field.handleChange(toggleFeature(field.state.value, feature.id))
													}>
													{feature.label}
												</button>
											);
										})}
									</div>
								</FormField>
							)}
						</form.Field>
					</StepShell>
				)}
			</form.FormGroup>
		);
	},
});

function toggleFeature(features: readonly ProductFeatureId[], feature: ProductFeatureId) {
	return features.includes(feature)
		? features.filter((item) => item !== feature)
		: [...features, feature];
}

function ManufacturerField(props: {
	id: string;
	value: ProductManufacturer | "";
	invalid: boolean;
	errors: readonly unknown[];
	onBlur: () => void;
	onChange: (value: ProductManufacturer | "") => void;
}) {
	return (
		<FormField label='Producent' htmlFor={props.id} errors={props.errors}>
			<Select
				value={props.value || null}
				onValueChange={(value) => {
					if (value) props.onChange(value);
				}}
				items={productManufacturers.map((manufacturer) => ({
					value: manufacturer,
					label: manufacturer,
				}))}>
				<SelectTrigger id={props.id} aria-invalid={props.invalid} onBlur={props.onBlur}>
					<SelectValue placeholder='Wybierz producenta' />
				</SelectTrigger>
				<SelectContent>
					{productManufacturers.map((manufacturer) => (
						<SelectItem key={manufacturer} value={manufacturer}>
							{manufacturer}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</FormField>
	);
}

function CategoryField(props: {
	id: string;
	value: EProductCategory | "";
	invalid: boolean;
	errors: readonly unknown[];
	onBlur: () => void;
	onChange: (value: EProductCategory | "") => void;
}) {
	return (
		<FormField label='Kategoria' htmlFor={props.id} errors={props.errors}>
			<Select
				value={props.value || null}
				onValueChange={(value) => {
					if (value) props.onChange(value);
				}}
				items={categoryItems}>
				<SelectTrigger id={props.id} aria-invalid={props.invalid} onBlur={props.onBlur}>
					<SelectValue placeholder='Wybierz kategorię' />
				</SelectTrigger>
				<SelectContent>
					{categoryItems.map((category) => (
						<SelectItem key={category.value} value={category.value}>
							{category.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</FormField>
	);
}
