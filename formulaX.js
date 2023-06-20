const formulas = {
	IF: {
		params: [
			{ description: "condition" },
			{ description: "value1 if pass condition" },
			{ description: "value2 if not pass" },
		]
	},
}

const resolver = {
	IF: (condition, value1, value2) => {
		if (condition) {
			return value1;
		} else {
			return value2;
		}
	}
}

const params = [
	{
		domain: "policy",
		key: "policy.startDate",
		type: "date",
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
		type: "enum",
		description: "Type of member",
		options: ["employee", "dependent"]
	},
	{
		domain: "insured",
		key: "insured.age",
		type: "number",
		description: "Age of member"
	}
]

function isOperator(char) {
	return char === "+" || char === "-" || char === "*" || char === "/";
}

function isComparisonOperator(char) {
	return char === ">" || char === "<" || char === ">=" || char === "<=" || char === "=";
}

function isOpenParenthesis(char) {
	return char === "(";
}

function isCloseParenthesis(char) {
	return char === ")";
}

function isQuote(char) {
	return char === "'" || char === '"';
}

function isFormula(formulaName) {
	return !!formulas[formulaName]
}

function isParamSeparator(char) {
	return char === ","
}

function parseFormula(fs) {
	const stack = []

	let param = ""
	let aString = ""
	function pushParamToStack() {
		if (param && param.trim()) {
			stack.push(param.trim())
			param = ""
		}
	}
	while (fs.length > 0) {
		const char = fs.slice(0, 1)
		const doubleChar = fs.slice(0, 2)
		fs = fs.slice(1)
		if (isQuote(char)) {
			while (!isQuote(fs.slice(0, 1))) {
				aString += fs.slice(0, 1)
				fs = fs.slice(1)
			}
			fs = fs.slice(1)
			param += aString
			aString = ""
			continue
		}
		if (isComparisonOperator(doubleChar)) {
			pushParamToStack()
			fs = fs.slice(1)
			stack.push(doubleChar)
		} else if (isOperator(char) || isOpenParenthesis(char) || isCloseParenthesis(char) || isComparisonOperator(char) || isParamSeparator(char)) {
			pushParamToStack()
			stack.push(char)
		} else {
			param += char
		}
	}
	return stack;
}

// convert to postfix to handle formula function
function convertToPostfix(formulaString) {
	const elements = parseFormula(formulaString)
	const stack = []
	const postfix = []
	while (elements.length > 0) {
		const element = elements.shift()
		if (isFormula(element)) {
			stack.push(element)
		} else if (isOperator(element) || isComparisonOperator(element)) {
			stack.push(element)
		} else if (isOpenParenthesis(element)) {
			stack.push(element)
		} else if (isParamSeparator(element)) {
			while (!isOpenParenthesis(stack[stack.length - 1])) {
				postfix.push(stack.pop())
			}
		} else if (isCloseParenthesis(element)) {
			while (!isOpenParenthesis(stack[stack.length - 1])) {
				postfix.push(stack.pop())
			}
			stack.pop()
		} else {
			postfix.push(element)
		}
	}
	while (stack.length > 0) {
		postfix.push(stack.pop())
	}
	console.log(postfix)
	return postfix
}

function flattenObject(obj) {
	const result = {}
	function flatten(obj, prefix) {
		for (const key in obj) {
			const value = obj[key]
			if (typeof value === "object") {
				flatten(value, `${prefix}${key}.`)
			} else {
				result[`${prefix}${key}`] = value
			}
		}
	}
	flatten(obj, "")
	return result
}

function typecast(value) {
	if (!isNaN(value)) {
		return Number(value)
	}
	if (typeof value === "string") {
		return `'${value}'`
	}
	return value
}

function resolvePostfix(postfix, context) {
	try {
		const stack = []
		const flattenedContext = flattenObject(context)
		while (postfix.length > 0) {
			const element = postfix.shift()
			if (isOperator(element) || isComparisonOperator(element)) {
				const value2 = typecast(stack.pop())
				const value1 = typecast(stack.pop())
				const evalString = `${value1} ${element} ${value2}`
				const rs = eval(evalString)
				stack.push(rs)
			} else if (isFormula(element)) {
				const params = []
				const formula = formulas[element]
				for (let i = 0; i < formula.params.length; i++) {
					params.push(stack.pop())
				}
				params.reverse()
				stack.push(resolver[element](...params))
			} else if (flattenedContext[element]) {
				stack.push(flattenedContext[element])
			} else {
				stack.push(element)
			}
			console.log(stack)
		}
		const result = stack.pop()
		console.log("result: ", result)
		return result
	} catch (e) {
		console.log(e)
	}
}

// convertToPostfix(givenFormulaString1)

const givenFormulaString1 = "IF(policy.startDate > '2020-01-01', IF((policy.startDate >= '2021-02-01'), 50, 100), 200)"
const givenFormulaString2 = "2 + 3 * (3 + 4)"

const context = {
	policy: {
		startDate: "2020-01-15",
	},
	insured: {
		memberType: "employee",
		age: 30
	}
}

resolvePostfix(convertToPostfix(givenFormulaString2), null)

