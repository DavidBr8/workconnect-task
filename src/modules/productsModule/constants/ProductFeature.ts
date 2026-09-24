export const productFeatureIds = [
	"bluetooth",
	"wifi",
	"usb-c",
	"waterproof",
	"wireless",
	"eco",
	"premium",
] as const;

export type ProductFeatureId = (typeof productFeatureIds)[number];

export const productFeatures = [
	{ id: "bluetooth", label: "Bluetooth" },
	{ id: "wifi", label: "WiFi" },
	{ id: "usb-c", label: "USB-C" },
	{ id: "waterproof", label: "Wodoodporny" },
	{ id: "wireless", label: "Bezprzewodowy" },
	{ id: "eco", label: "Ekologiczny" },
	{ id: "premium", label: "Premium" },
] as const satisfies ReadonlyArray<{ id: ProductFeatureId; label: string }>;

export function getProductFeatureLabel(id: ProductFeatureId) {
	return productFeatures.find((feature) => feature.id === id)?.label ?? id;
}
