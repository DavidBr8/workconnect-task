"use client";
import type { ReactNode } from "react";
import { cn } from "cn";
import {
	ColumnDef,
	RowData,
	columnFilteringFeature,
	createFilteredRowModel,
	createPaginatedRowModel,
	createSortedRowModel,
	filterFn_includesString,
	globalFilteringFeature,
	rowPaginationFeature,
	rowSortingFeature,
	sortFn_alphanumeric,
	columnSizingFeature,
	sortFn_text,
	tableFeatures,
	useTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import DataTablePagination from "./DataTablePagination";

export const features = tableFeatures({
	rowSortingFeature,
	rowPaginationFeature,
	columnFilteringFeature,
	globalFilteringFeature,
	columnSizingFeature,
	sortedRowModel: createSortedRowModel(),
	paginatedRowModel: createPaginatedRowModel(),
	filteredRowModel: createFilteredRowModel(),
	sortFns: {
		alphanumeric: sortFn_alphanumeric,
		text: sortFn_text,
	},
	filterFns: {
		includesString: filterFn_includesString,
	},
});

export type DataTableFeatures = typeof features;

type DataTableProps<TData extends RowData> = {
	data: ReadonlyArray<TData>;
	columns: ReadonlyArray<ColumnDef<DataTableFeatures, TData>>;
	getRowId?: (row: TData, index: number) => string;
	isLoading?: boolean;
	onRowClick?: (row: TData) => void;
	renderCard?: (row: TData) => ReactNode;
};

export default function DataTable<TData extends RowData>({
	data,
	columns,
	getRowId,
	isLoading = false,
	onRowClick,
	renderCard,
}: DataTableProps<TData>) {
	const table = useTable(
		{
			features,
			columns,
			data,
			getRowId,
			globalFilterFn: "includesString",
			initialState: {
				pagination: {
					pageIndex: 0,
					pageSize: 5,
				},
			},
		},
		(state) => state,
	);

	const rows = table.getRowModel().rows;

	return (
		<div className='w-full'>
			<div
				className={cn(
					"md:overflow-hidden md:rounded-lg md:border",
					!renderCard && "overflow-hidden rounded-lg border",
				)}>
				{renderCard ? (
					<div className='flex flex-col gap-3 md:hidden'>
						{isLoading ? (
							Array.from({ length: table.state.pagination.pageSize }, (_, index) => (
								<div key={index} className='h-36 animate-pulse rounded-xl bg-muted' />
							))
						) : rows.length === 0 ? (
							<div className='py-10 text-center text-sm text-muted-foreground'>Brak produktów.</div>
						) : (
							rows.map((row) => (
								<div
									key={row.id}
									role={onRowClick ? "button" : undefined}
									tabIndex={onRowClick ? 0 : undefined}
									className={
										onRowClick
											? "cursor-pointer rounded-xl text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
											: undefined
									}
									onClick={onRowClick ? () => onRowClick(row.original) : undefined}
									onKeyDown={
										onRowClick
											? (event) => {
													if (event.key !== "Enter" && event.key !== " ") return;
													event.preventDefault();
													onRowClick(row.original);
												}
											: undefined
									}>
									{renderCard(row.original)}
								</div>
							))
						)}
					</div>
				) : null}
				<div className={renderCard ? "hidden md:block" : undefined}>
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										const sorted = header.column.getIsSorted();
										const Icon = sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : null;

										return (
											<TableHead
												key={header.id}
												colSpan={header.colSpan}
												style={{ width: header.column.getSize() }}>
												{header.isPlaceholder ? null : header.column.getCanSort() ? (
													<Button
														variant='ghost'
														size='sm'
														className='-ml-3 h-8 data-[state=open]:bg-accent'
														onClick={header.column.getToggleSortingHandler()}>
														<table.FlexRender header={header} />
														{Icon && <Icon className='ml-2' />}
													</Button>
												) : (
													<span className='text-sm font-medium'>
														<table.FlexRender header={header} />
													</span>
												)}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{isLoading ? (
								Array.from({ length: table.state.pagination.pageSize }, (_, rowIndex) => (
									<TableRow key={rowIndex}>
										{columns.map((_, columnIndex) => (
											<TableCell key={columnIndex}>
												<div className='h-4 w-full max-w-40 animate-pulse rounded bg-muted' />
											</TableCell>
										))}
									</TableRow>
								))
							) : table.getRowModel().rows.length === 0 ? (
								<TableRow>
									<TableCell colSpan={columns.length} className='h-24 text-center'>
										Brak produktów.
									</TableCell>
								</TableRow>
							) : (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										tabIndex={onRowClick ? 0 : undefined}
										className={
											onRowClick
												? "cursor-pointer outline-none focus-visible:bg-muted/60"
												: undefined
										}
										onClick={onRowClick ? () => onRowClick(row.original) : undefined}
										onKeyDown={
											onRowClick
												? (event) => {
														if (event.key !== "Enter" && event.key !== " ") return;
														event.preventDefault();
														onRowClick(row.original);
													}
												: undefined
										}>
										{row.getAllCells().map((cell) => (
											<TableCell key={cell.id}>
												<table.FlexRender cell={cell} />
											</TableCell>
										))}
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>

				<DataTablePagination
					table={table}
					data={data}
					isLoading={isLoading}
					className={renderCard ? "md:border-t" : "border-t"}
				/>
			</div>
		</div>
	);
}
