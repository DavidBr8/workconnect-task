"use client";

import type { ReactElement, ReactNode } from "react";
import { XIcon } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import {
	Dialog as DialogRoot,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

type DialogProps = {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	onOpenChangeComplete?: (open: boolean) => void;
	trigger?: ReactElement;
	title: ReactNode;
	description?: ReactNode;
	children?: ReactNode;
	footer?: ReactNode;
	showCloseButton?: boolean;
	className?: string;
	bodyClassName?: string;
};

export default function Dialog({
	open,
	defaultOpen,
	onOpenChange,
	onOpenChangeComplete,
	trigger,
	title,
	description,
	children,
	footer,
	showCloseButton = true,
	className,
	bodyClassName,
}: DialogProps) {
	return (
		<DialogRoot
			open={open}
			defaultOpen={defaultOpen}
			onOpenChange={onOpenChange}
			onOpenChangeComplete={onOpenChangeComplete}>
			{trigger ? <DialogTrigger render={trigger} /> : null}
			<DialogContent
				showCloseButton={false}
				className={cn(
					"inset-0 top-0 left-0 flex h-dvh max-h-dvh w-full max-w-none translate-none flex-col overflow-hidden rounded-none shadow-none ring-0 data-starting-style:scale-100 data-ending-style:scale-100 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:h-auto sm:max-h-[calc(100dvh-4rem)] sm:w-full sm:max-w-[min(720px,calc(100%-4rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:scale-100 sm:overflow-y-auto sm:rounded-xl sm:shadow-xl sm:ring-1 sm:data-starting-style:scale-95 sm:data-ending-style:scale-95",
					className,
				)}>
				<div className='flex min-h-0 flex-1 flex-col max-sm:px-4'>
				<DialogHeader className='flex-row items-center justify-between gap-4 max-sm:px-0'>
					<div className='flex min-w-0 flex-col gap-1'>
						<DialogTitle>{title}</DialogTitle>
						{description ? <DialogDescription>{description}</DialogDescription> : null}
					</div>
					{showCloseButton ? (
						<DialogClose
							render={
								<Button variant='ghost' size='icon-sm' className='text-muted-foreground size-4' />
							}>
							<XIcon />
							<span className='sr-only'>Zamknij</span>
						</DialogClose>
					) : null}
				</DialogHeader>
				{children ? (
					<div
						className={cn(
							"flex min-h-0 flex-1 flex-col",
							bodyClassName ?? "overflow-y-auto px-4 py-5",
						)}>
						{children}
					</div>
				) : null}
				</div>
				{footer ? <DialogFooter className='flex-row justify-end'>{footer}</DialogFooter> : null}
			</DialogContent>
		</DialogRoot>
	);
}
