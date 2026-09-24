export const productManufacturers = ["Apple", "Samsung", "Sony", "Bosch", "Xiaomi"] as const;

export type ProductManufacturer = (typeof productManufacturers)[number];

export function isProductManufacturer(value: string): value is ProductManufacturer {
	return (productManufacturers as readonly string[]).includes(value);
}
