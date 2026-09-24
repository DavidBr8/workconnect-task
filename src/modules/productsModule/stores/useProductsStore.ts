import { create } from "zustand";
import { IProduct } from "@/modules/productsModule/types/Product";

const initialState = {
	products: [],
	isTableLoading: true,
};

export type ProductsStore = {
	products: IProduct[];
	isTableLoading: boolean;
	setProducts: (products: IProduct[]) => void;
	setIsTableLoading: (isTableLoading: boolean) => void;
	addProduct: (product: IProduct) => void;
	updateProduct: (sku: string, product: IProduct) => void;
};

export const useProductsStore = create<ProductsStore>((set) => {
	const setProducts = (products: IProduct[]) => set({ products });

	const setIsTableLoading = (isTableLoading: boolean) => set({ isTableLoading });

	const addProduct = (product: IProduct) => {
		set((state) => {
			const products = [...state.products, product];
			return { products };
		});
	};

	const updateProduct = (sku: string, product: IProduct) => {
		set((state) => ({
			products: state.products.map((item) => (item.sku === sku ? product : item)),
		}));
	};

	return {
		...initialState,
		setProducts,
		setIsTableLoading,
		addProduct,
		updateProduct,
	};
});
