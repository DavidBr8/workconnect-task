"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { NumberInput } from "@/components/ui/number-input";
import { Switch } from "@/components/ui/switch";
import { withForm } from "@/hooks/useAppForm";
import { priceService } from "@/modules/productsModule/services/usePriceService";
import {
	availabilityStepSchema,
	productFormOpts,
} from "@/modules/productsModule/components/Products/Dialog/schema";
import FormField from "@/components/Wrappers/FormField/FormField";
import StepShell from "@/modules/productsModule/components/Products/Dialog/Partials/StepShell";

export const AvailabilityStep = withForm({
	...productFormOpts,
	props: {
		onBack: () => {},
	},
	render: function Render({ form, onBack }) {
		return (
			<form.FormGroup
				name='availability'
				validators={{ onDynamic: availabilityStepSchema }}
				onGroupSubmit={() => {
					void form.handleSubmit();
				}}>
				{(group) => (
					<form.Subscribe selector={(state) => state.isSubmitting}>
						{(isSubmitting) => (
							<StepShell
								onSubmit={() => void group.handleSubmit()}
								onBack={onBack}
								submitLabel='Zapisz produkt'
								isSubmitting={isSubmitting}
								contentClassName='gap-0 p-0 sm:p-0'>
								<div className='flex flex-col'>
									<form.Field name='availability.isAvailable'>
										{(field) => (
											<div className='border-b py-4 sm:px-4'>
												<label
													htmlFor={field.name}
													className='flex w-fit cursor-pointer items-center gap-3 text-sm font-medium'>
													<Switch
														id={field.name}
														checked={field.state.value}
														onCheckedChange={(checked) => field.handleChange(checked)}
														onBlur={field.handleBlur}
													/>
													Produkt jest dostępny
												</label>
											</div>
										)}
									</form.Field>
									<form.Field
										name='availability.isLimited'
										listeners={{
											onChange: ({ value }) => {
												if (!value) form.setFieldValue("availability.stock", null);
											},
										}}>
										{(field) => (
											<label
												htmlFor={field.name}
												className='flex items-center gap-3 border-b py-4 text-sm font-medium sm:px-4'>
												<Checkbox
													id={field.name}
													checked={field.state.value}
													onCheckedChange={(checked) => field.handleChange(checked)}
													onBlur={field.handleBlur}
												/>
												Produkt limitowany
											</label>
										)}
									</form.Field>
									<form.Subscribe selector={(state) => state.values.availability.isLimited}>
										{(isLimited) =>
											isLimited ? (
												<div className='border-b py-4 sm:px-4'>
													<form.Field name='availability.stock'>
														{(field) => (
															<FormField
																label='Stan magazynowy'
																htmlFor={field.name}
																errors={field.state.meta.errors}>
																<NumberInput
																	id={field.name}
																	name={field.name}
																	inputMode='numeric'
																	min={0}
																	value={field.state.value}
																	placeholder='0'
																	aria-invalid={field.state.meta.errors.length > 0}
																	onBlur={field.handleBlur}
																	onValueChange={(raw) =>
																		field.handleChange(
																			raw === "" ? null : priceService.readNumber(raw),
																		)
																	}
																/>
															</FormField>
														)}
													</form.Field>
												</div>
											) : null
										}
									</form.Subscribe>
									<div className='flex flex-col gap-4 py-4 sm:px-4'>
										<p className='text-sm font-medium'>Limity koszyka</p>
										<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
											<form.Field name='availability.minOrderQuantity'>
												{(field) => (
													<FormField
														label='Minimalna ilość'
														htmlFor={field.name}
														errors={field.state.meta.errors}>
														<NumberInput
															id={field.name}
															name={field.name}
															inputMode='numeric'
															min={1}
															value={field.state.value}
															aria-invalid={field.state.meta.errors.length > 0}
															onBlur={field.handleBlur}
															onValueChange={(raw) =>
																field.handleChange(priceService.readNumber(raw))
															}
														/>
													</FormField>
												)}
											</form.Field>
											<form.Field name='availability.maxOrderQuantity'>
												{(field) => (
													<FormField
														label='Maksymalna ilość'
														htmlFor={field.name}
														errors={field.state.meta.errors}>
														<NumberInput
															id={field.name}
															name={field.name}
															inputMode='numeric'
															min={1}
															value={field.state.value}
															aria-invalid={field.state.meta.errors.length > 0}
															onBlur={field.handleBlur}
															onValueChange={(raw) =>
																field.handleChange(priceService.readNumber(raw))
															}
														/>
													</FormField>
												)}
											</form.Field>
										</div>
									</div>
								</div>
							</StepShell>
						)}
					</form.Subscribe>
				)}
			</form.FormGroup>
		);
	},
});
