import { Check } from "lucide-react";
import { cn } from "cn";
import { productSteps } from "@/modules/productsModule/components/Products/Dialog/productSteps";

export default function ProductSteps(props: {
	activeStep: number;
	onStepSelect: (index: number) => void;
}) {
	return (
		<ol className='grid shrink-0 grid-cols-3 items-start gap-2 border-b py-6 sm:flex sm:gap-4 sm:px-4 sm:py-3'>
			{productSteps.map((step, index) => {
				const isActive = index === props.activeStep;
				const isComplete = index < props.activeStep;
				const isLast = index === productSteps.length - 1;
				const marker = (
					<span
						className={cn(
							"flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium",
							isComplete || isActive
								? "bg-primary text-primary-foreground"
								: "border bg-muted text-muted-foreground",
						)}>
						{isComplete ? <Check className='size-4' /> : index + 1}
					</span>
				);
				const labels = (
					<span className='min-w-0 text-left'>
						<span
							className={cn(
								"block text-sm font-medium",
								index <= props.activeStep ? "text-foreground" : "text-muted-foreground",
							)}>
							{step.title}
						</span>
						<span className='block text-xs text-muted-foreground'>{step.description}</span>
					</span>
				);

				return (
					<li key={step.key} className='flex min-w-0 flex-1 items-center gap-2 sm:gap-3'>
						{isComplete ? (
							<button
								type='button'
								onClick={() => props.onStepSelect(index)}
								className='flex min-w-0 cursor-pointer flex-col items-start gap-2 rounded-2xl text-center outline-none focus-visible:ring-3 focus-visible:ring-ring/30 sm:flex-row sm:items-center sm:gap-3 sm:text-left'>
								{marker}
								{labels}
							</button>
						) : (
							<div className='flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3'>
								{marker}
								{labels}
							</div>
						)}
						{isLast ? null : (
							<span
								aria-hidden
								className={cn(
									"hidden h-px min-w-4 flex-1 sm:block",
									isComplete ? "bg-primary" : "bg-border",
								)}
							/>
						)}
					</li>
				);
			})}
		</ol>
	);
}
