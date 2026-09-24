"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { features } from "@/components/Wrappers/DataTable/DataTable";
import { priceService } from "@/modules/productsModule/services/usePriceService";
import { IProduct } from "@/modules/productsModule/types/Product";
import { Badge } from "@/components/ui/badge";
import { ProductCategoryLabels } from "@/modules/productsModule/constants/ProductCategory";
import DataTable from "@/components/Wrappers/DataTable/DataTable";
import ProductCard from "@/modules/productsModule/components/Products/ProductCard/ProductCard";

const columnHelper = createColumnHelper<typeof features, IProduct>();

export const productColumns = columnHelper.columns([
	columnHelper.accessor("name", {
		header: "Nazwa",
		size: 357,
		cell: (info) => <span className='font-medium text-foreground '>{info.getValue()}</span>,
	}),
	columnHelper.accessor((row) => row.sku, {
		id: "sku",
		header: "SKU",
		cell: (info) => (
			<span className='text-muted-foreground text-xs'>{info.getValue<string>()}</span>
		),
	}),
	columnHelper.accessor((row) => row.category, {
		id: "category",
		header: "Kategoria",
		cell: (info) => (
			<span className='text-muted-foreground text-xs'>
				{ProductCategoryLabels[info.getValue()]}
			</span>
		),
	}),
	columnHelper.accessor((row) => row.price, {
		id: "price",
		header: "Cena Brutto",
		sortFn: (rowA, rowB) => rowA.original.price.valueGross - rowB.original.price.valueGross,
		cell: (info) => (
			<span className='text-foreground font-medium'>
				{priceService.format(info.getValue().valueGross, info.getValue().currency)}
			</span>
		),
	}),
	columnHelper.accessor((row) => row.isAvailable, {
		id: "isAvailable",
		header: "Dostępny",
		cell: (info) =>
			info.getValue() ? (
				<Badge size='sm' variant='success'>
					Dostępny
				</Badge>
			) : (
				<Badge size='sm' variant='destructive'>
					Niedostępny
				</Badge>
			),
	}),
	columnHelper.accessor((row) => row.stock, {
		id: "stock",
		header: "Magazyn",
		cell: (info) => info.getValue() ?? "—",
		sortFn: (rowA, rowB) => {
			const a = rowA.original.stock;
			const b = rowB.original.stock;
			if (a === b) return 0;
			if (a === null) return 1;
			if (b === null) return -1;
			return a - b;
		},
	}),
]);

export default function ProductsTable(props: {
	data: IProduct[];
	isLoading?: boolean;
	onRowClick?: (product: IProduct) => void;
}) {
	return (
		<DataTable
			data={props.data}
			columns={productColumns}
			getRowId={(row) => row.sku}
			isLoading={props.isLoading}
			onRowClick={props.onRowClick}
			renderCard={(product) => <ProductCard product={product} />}
		/>
	);
}
