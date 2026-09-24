import type { ReactNode } from "react";
import { cn } from "cn";

export function getFieldErrorMessage(error: unknown) {
	if (typeof error === "string" && error.length > 0) return error;
	if (typeof error === "object" && error !== null && "message" in error) {
		const message = error.message;
		if (typeof message === "string" && message.length > 0) return message;
	}
	return undefined;
}

export default function FormField(props: {
	label: string;
	htmlFor?: string;
	errors: readonly unknown[];
	children: ReactNode;
	className?: string;
}) {
	const message = props.errors.map(getFieldErrorMessage).find(Boolean);

	return (
		<div className={cn("flex min-w-0 flex-col gap-2", props.className)}>
			{props.htmlFor ? (
				<label htmlFor={props.htmlFor} className='text-sm font-medium'>
					{props.label}
				</label>
			) : (
				<p className='text-sm font-medium'>{props.label}</p>
			)}
			{props.children}
			{message ? <p className='text-xs text-destructive'>{message}</p> : null}
		</div>
	);
}
