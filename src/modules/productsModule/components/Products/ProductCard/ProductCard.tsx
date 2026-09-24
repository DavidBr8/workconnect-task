import { Badge } from "@/components/ui/badge";
import { ProductCategoryLabels } from "@/modules/productsModule/constants/ProductCategory";
import { priceService } from "@/modules/productsModule/services/usePriceService";
import { IProduct } from "@/modules/productsModule/types/Product";

export default function ProductCard({ product }: { product: IProduct }) {
	return (
		<article className='rounded-xl border bg-white p-3'>
			<div className='flex items-center justify-between gap-3'>
				<div className='min-w-0 flex flex-col gap-1'>
					<p className='font-semibold text-foreground'>{product.name}</p>
					<p className='text-xs text-muted-foreground'>{product.sku}</p>
				</div>
				{product.isAvailable ? (
					<Badge size='sm' variant='success'>
						Dostępny
					</Badge>
				) : (
					<Badge size='sm' variant='destructive'>
						Niedostępny
					</Badge>
				)}
			</div>
			<div className='mt-2 grid grid-cols-3 gap-2 rounded-lg bg-muted px-3 py-3'>
				<div className='flex flex-col gap-1'>
					<p className='text-xs text-muted-foreground'>Kategoria</p>
					<p className='text-sm font-normal'>{ProductCategoryLabels[product.category]}</p>
				</div>
				<div className='flex flex-col gap-1'>
					<p className='text-xs text-muted-foreground'>Cena brutto</p>
					<p className='text-sm font-medium'>
						{priceService.format(product.price.valueGross, product.price.currency)}
					</p>
				</div>
				<div className='flex flex-col gap-1'>
					<p className='text-xs text-muted-foreground'>Magazyn</p>
					<p className='text-sm font-normal'>{product.stock ?? "—"}</p>
				</div>
			</div>
		</article>
	);
}
