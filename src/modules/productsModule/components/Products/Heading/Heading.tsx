import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useProductsStore } from "@/modules/productsModule/stores/useProductsStore";
import { Spinner } from "@/components/ui/spinner";

export default function ProductsHeading(props: {
	totalProducts: number;
	onAddProduct: () => void;
}) {
	const isTableLoading = useProductsStore((state) => state.isTableLoading);

	return (
		<div className='flex justify-between items-center max-w-[1240px] w-full'>
			<div className='flex flex-col gap-1'>
				<h1 className='text-xl font-semibold'>Produkty</h1>
				<p className='text-sm text-muted-foreground'>
					{isTableLoading ? <Spinner className='inline-block' /> : props.totalProducts} produktów w
					katalogu
				</p>
			</div>
			<Button variant='default' size='lg' onClick={props.onAddProduct}>
				<PlusIcon className='w-4 h-4' />
				Dodaj produkt
			</Button>
		</div>
	);
}
