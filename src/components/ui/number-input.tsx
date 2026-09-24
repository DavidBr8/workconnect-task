"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

function sanitizeNumberText(raw: string) {
	const cleaned = raw.replace(/[^\d.]/g, "");
	const dotIndex = cleaned.indexOf(".");
	const whole = dotIndex === -1 ? cleaned : cleaned.slice(0, dotIndex);
	const fraction = dotIndex === -1 ? "" : cleaned.slice(dotIndex + 1).replace(/\./g, "");
	const normalizedWhole = whole.replace(/^0+(?=\d)/, "");

	if (dotIndex === -1) return normalizedWhole;
	return `${normalizedWhole === "" ? "0" : normalizedWhole}.${fraction}`;
}

function NumberInput({
	value,
	onValueChange,
	onBlur,
	inputMode = "decimal",
	...props
}: Omit<React.ComponentProps<typeof Input>, "value" | "onChange" | "type"> & {
	value: number | null;
	onValueChange: (raw: string) => void;
}) {
	const [text, setText] = useState<string | null>(null);
	const shown = text ?? (value === null ? "" : String(value));

	return (
		<Input
			{...props}
			type='text'
			inputMode={inputMode}
			value={shown}
			onChange={(event) => {
				const next = sanitizeNumberText(event.target.value);
				setText(next);
				onValueChange(next);
			}}
			onBlur={(event) => {
				setText(null);
				onBlur?.(event);
			}}
		/>
	);
}

export { NumberInput };
