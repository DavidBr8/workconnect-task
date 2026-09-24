import type { ReactTable, RowData } from "@tanstack/react-table";
import { cn } from "cn";
import type { DataTableFeatures } from "./DataTable";
import { Button } from "../../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DataTablePagination<TData extends RowData>({
	table,
	data,
	isLoading = false,
	className,
}: {
	table: ReactTable<DataTableFeatures, TData>;
	data: ReadonlyArray<TData>;
	isLoading?: boolean;
	className?: string;
}) {
	if (isLoading) {
		return (
			<div
				className={cn(
					"flex flex-col items-center gap-3 px-2 py-4 md:flex-row md:justify-between md:px-4",
					className,
				)}
				aria-busy='true'>
				<div className='h-4 w-40 animate-pulse rounded bg-muted' />
				<div className='flex items-center gap-2'>
					<div className='h-9 w-24 animate-pulse rounded-2xl bg-muted' />
					<div className='size-8 animate-pulse rounded-md bg-muted' />
					<div className='size-8 animate-pulse rounded-md bg-muted' />
					<div className='h-9 w-24 animate-pulse rounded-2xl bg-muted' />
				</div>
			</div>
		);
	}

	return (
		<div
			className={cn(
				"flex flex-col items-center gap-3 px-2 py-4 md:flex-row md:justify-between md:px-4",
				className,
			)}>
			<div className='text-xs text-muted-foreground'>
				Strona {table.state.pagination.pageIndex + 1} z {Math.max(1, table.getPageCount())} ·{" "}
				{data.length.toLocaleString()} produktów
			</div>
			<div className='flex items-center gap-6 lg:gap-8'>
				<div className='flex items-center gap-2'>
					<Button
						variant='ghost'
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}>
						<ChevronLeft />
						<span>Wstecz</span>
					</Button>
					{table.getPageOptions().map((pageIndex) => {
						const isCurrent = table.state.pagination.pageIndex === pageIndex;

						return (
							<Button
								key={pageIndex}
								variant='square'
								size='icon'
								className={isCurrent ? "bg-primary text-primary-foreground" : "bg-transparent"}
								aria-current={isCurrent ? "page" : undefined}
								onClick={() => table.setPageIndex(pageIndex)}>
								{pageIndex + 1}
							</Button>
						);
					})}
					<Button
						variant='ghost'
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}>
						<span>Dalej</span>
						<ChevronRight />
					</Button>
				</div>
			</div>
		</div>
	);
}
