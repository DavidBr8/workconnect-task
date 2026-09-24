import { IProduct } from "../types/Product";
import { useProductsStore } from "../stores/useProductsStore";
import { productsData } from "../data/products";

interface IProductsService {
	fetchProducts: () => Promise<IProduct[]>;
	addProduct: (product: IProduct) => Promise<IProduct | null>;
	updateProduct: (sku: string, product: IProduct) => Promise<IProduct | null>;
}

const delay = () => new Promise((resolve) => setTimeout(resolve, 500));

let requestId = 0;

async function withRequest<T>(work: () => T): Promise<T | null> {
	const id = ++requestId;
	const store = useProductsStore.getState();
	store.setIsTableLoading(true);

	try {
		await delay();
		if (id !== requestId) return null;
		return work();
	} catch (error) {
		console.error(error);
		return null;
	} finally {
		if (id === requestId) store.setIsTableLoading(false);
	}
}

const fetchProducts = async () => {
	const products = await withRequest(() => {
		useProductsStore.getState().setProducts(productsData);
		return productsData;
	});
	return products ?? [];
};

const addProduct = (product: IProduct) =>
	withRequest(() => {
		useProductsStore.getState().addProduct(product);
		return product;
	});

const updateProduct = (sku: string, product: IProduct) =>
	withRequest(() => {
		const store = useProductsStore.getState();
		if (!store.products.some((item) => item.sku === sku)) return null;
		store.updateProduct(sku, product);
		return product;
	});

export const productsService: IProductsService = {
	fetchProducts,
	addProduct,
	updateProduct,
};
