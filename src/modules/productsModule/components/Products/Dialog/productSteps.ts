export const productSteps = [
	{ key: "info", title: "Informacje", description: "Dane podstawowe" },
	{ key: "price", title: "Cena", description: "Dane cenowe" },
	{ key: "availability", title: "Dostępność", description: "Stany magazynowe" },
] as const;

export type ProductStepKey = (typeof productSteps)[number]["key"];
