import { FormulaParam, Param } from "./types";


export const formulas = {
	IF: {
		params: [
			{ description: "condition" },
			{ description: "value1 if pass condition" },
			{ description: "value2 if not pass" },
		],
		handler: (condition: string, value1: FormulaParam, value2: FormulaParam) => {
			if (condition) {
				return value1;
			} else {
			return value2;
			}
		}
	},
	AGE: {
		params: [
			{ description: "condition" },
		],
		handler: (condition: string, value1: FormulaParam, value2: FormulaParam) => {
			if (condition) {
				return value1;
			} else {
			return value2;
			}
		}
	},
}

export const params:Param[] = [
	{
		domain: "policy",
		key: "policy.startDate",
		type: "date",
		label: "Policy Start Date",
		description: "Start date of policy"
	},
	{
		domain: "policy",
		key: "policy.endDate",
		label: "Policy End Date",
		type: "date",
		description: "End date of policy"
	},
	{
		domain: "insured",
		key: "insured.memberType",
		label: "Member Type",
		type: "enum",
		description: "Type of member",
		options: ["employee", "dependent"]
	},
	{
		domain: "insured",
		key: "insured.age",
		label: "Member Age",
		type: "number",
		description: "Age of member"
	}
]


export const context = {
	policy: {
		startDate: "2020-01-15",
	},
	insured: {
		memberType: "employee",
		age: 30
	}
}