export type FormulaParam = string | number | boolean | null | undefined

export type Param = {
	domain: string
	key: string
	label: string
	type: "string" | "number" | "boolean" | "date" | "enum"
	description?: string
	options?: string[]
}

// TODO Define mode details types