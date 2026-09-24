"use client";

import { useEffect } from "react";
import ProductsHeading from "@/modules/productsModule/components/Products/Heading/Heading";
import ProductsTable from "@/modules/productsModule/components/Products/Table/Table";
import AddProductDialog from "@/modules/productsModule/components/Products/Dialog/Dialog";
import { useProductDialogSearch } from "@/modules/productsModule/components/Products/Dialog/useProductStep";
import { useProductsStore } from "@/modules/productsModule/stores/useProductsStore";
import { productsService } from "@/modules/productsModule/services/useProductsService";

export default function ProductsView() {
	const [, setProductDialog] = useProductDialogSearch();
	const products = useProductsStore((state) => state.products);
	const isTableLoading = useProductsStore((state) => state.isTableLoading);

	useEffect(() => {
		productsService.fetchProducts();
	}, []);

	return (
		<div className='flex w-full max-w-[1240px] flex-col items-center gap-4 sm:gap-6 px-4 py-6 sm:py-[50px]'>
			<ProductsHeading
				totalProducts={products.length}
				onAddProduct={() => setProductDialog({ step: "info", sku: null })}
			/>
			<ProductsTable
				data={products}
				isLoading={isTableLoading}
				onRowClick={(product) => setProductDialog({ step: "info", sku: product.sku })}
			/>
			<AddProductDialog />
		</div>
	);
}
