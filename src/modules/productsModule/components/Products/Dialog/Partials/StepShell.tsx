"use client";

import type { FormEvent, ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function StepShell(props: {
	onSubmit: () => void;
	onBack?: () => void;
	submitLabel: string;
	showNextIcon?: boolean;
	isSubmitting?: boolean;
	contentClassName?: string;
	children: ReactNode;
}) {
	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		event.stopPropagation();
		props.onSubmit();
	};

	return (
		<form onSubmit={handleSubmit} noValidate className='flex min-h-0 flex-1 flex-col'>
			<div
				className={cn(
					"flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto py-4 sm:px-4 sm:py-5",
					props.contentClassName,
				)}>
				{props.children}
			</div>
			<div
				className={cn(
					"flex shrink-0 flex-row gap-2 border-t bg-background px-4 py-4 max-sm:-mx-4 sm:rounded-b-xl sm:bg-secondary",
					props.onBack ? "justify-between" : "justify-end",
				)}>
				{props.onBack ? (
					<Button
						type='button'
						variant='outline'
						onClick={props.onBack}
						disabled={props.isSubmitting}>
						<ArrowLeft />
						Wstecz
					</Button>
				) : null}
				<Button type='submit' disabled={props.isSubmitting}>
					{props.isSubmitting ? <Spinner /> : null}
					{props.submitLabel}
					{props.showNextIcon ? <ArrowRight /> : null}
				</Button>
			</div>
		</form>
	);
}
