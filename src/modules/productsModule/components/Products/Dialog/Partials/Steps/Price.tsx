"use client";

import { NumberInput } from "@/components/ui/number-input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ECurrency } from "@/constants/Currency";
import { withForm } from "@/hooks/useAppForm";
import { priceService } from "@/modules/productsModule/services/usePriceService";
import {
	priceStepSchema,
	productFormOpts,
} from "@/modules/productsModule/components/Products/Dialog/schema";
import FormField from "@/components/Wrappers/FormField/FormField";
import StepShell from "@/modules/productsModule/components/Products/Dialog/Partials/StepShell";

const currencyItems = Object.values(ECurrency).map((currency) => ({
	value: currency,
	label: currency,
}));

export const PriceStep = withForm({
	...productFormOpts,
	props: {
		onBack: () => {},
		onNext: () => {},
	},
	render: function Render({ form, onBack, onNext }) {
		const syncGross = (net: number, vatRate: number) => {
			const nextGross = priceService.grossFromNet(net, vatRate);
			if (nextGross !== form.getFieldValue("price.valueGross")) {
				form.setFieldValue("price.valueGross", nextGross);
			}
		};

		const syncNet = (gross: number, vatRate: number) => {
			const nextNet = priceService.netFromGross(gross, vatRate);
			if (nextNet !== form.getFieldValue("price.valueNet")) {
				form.setFieldValue("price.valueNet", nextNet);
			}
		};

		return (
			<form.FormGroup
				name='price'
				validators={{ onDynamic: priceStepSchema }}
				onGroupSubmit={() => {
					onNext();
				}}>
				{(group) => (
					<StepShell
						onSubmit={() => void group.handleSubmit()}
						onBack={onBack}
						submitLabel='Dalej'
						showNextIcon>
						<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
							<form.Field
								name='price.valueNet'
								listeners={{
									onChange: ({ value }) => {
										syncGross(value, form.getFieldValue("price.vatRate"));
									},
								}}>
								{(field) => (
									<FormField
										label='Cena netto'
										htmlFor={field.name}
										errors={field.state.meta.errors}>
										<NumberInput
											id={field.name}
											name={field.name}
											min={0}
											value={field.state.value}
											placeholder='0.00'
											aria-invalid={field.state.meta.errors.length > 0}
											onBlur={field.handleBlur}
											onValueChange={(raw) => field.handleChange(priceService.readNumber(raw))}
										/>
									</FormField>
								)}
							</form.Field>
							<form.Field
								name='price.valueGross'
								listeners={{
									onChange: ({ value }) => {
										syncNet(value, form.getFieldValue("price.vatRate"));
									},
								}}>
								{(field) => (
									<FormField
										label='Cena brutto'
										htmlFor={field.name}
										errors={field.state.meta.errors}>
										<NumberInput
											id={field.name}
											name={field.name}
											min={0}
											value={field.state.value}
											placeholder='0.00'
											aria-invalid={field.state.meta.errors.length > 0}
											onBlur={field.handleBlur}
											onValueChange={(raw) => field.handleChange(priceService.readNumber(raw))}
										/>
									</FormField>
								)}
							</form.Field>
							<form.Field
								name='price.vatRate'
								listeners={{
									onChange: ({ value }) => {
										syncGross(form.getFieldValue("price.valueNet"), value);
									},
								}}>
								{(field) => (
									<FormField
										label='Stawka VAT'
										htmlFor={field.name}
										errors={field.state.meta.errors}>
										<div className='relative'>
											<NumberInput
												id={field.name}
												name={field.name}
												inputMode='numeric'
												min={0}
												max={100}
												value={field.state.value}
												className='pr-8'
												aria-invalid={field.state.meta.errors.length > 0}
												onBlur={field.handleBlur}
												onValueChange={(raw) => field.handleChange(priceService.readNumber(raw))}
											/>
											<span className='pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground'>
												%
											</span>
										</div>
									</FormField>
								)}
							</form.Field>
							<form.Field name='price.currency'>
								{(field) => (
									<FormField label='Waluta' htmlFor={field.name} errors={field.state.meta.errors}>
										<Select
											value={field.state.value}
											onValueChange={(value) => {
												if (value) field.handleChange(value);
											}}
											items={currencyItems}>
											<SelectTrigger
												id={field.name}
												aria-invalid={field.state.meta.errors.length > 0}
												onBlur={field.handleBlur}>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{currencyItems.map((currency) => (
													<SelectItem key={currency.value} value={currency.value}>
														{currency.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormField>
								)}
							</form.Field>
						</div>
					</StepShell>
				)}
			</form.FormGroup>
		);
	},
});
