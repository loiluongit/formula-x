import { FormulaParam } from "../types";

export function isOperator(char: string): boolean {
	return char === "+" || char === "-" || char === "*" || char === "/";
}

export function isComparisonOperator(char: string) {
	return char === ">" || char === "<" || char === ">=" || char === "<=" || char === "=";
}

// TODO logical operator and, or, not

export function isOpenParenthesis(char: string) {
	return char === "(";
}

export function isCloseParenthesis(char: string) {
	return char === ")";
}

export function isQuote(char: string) {
	return char === "'" || char === '"';
}

export function isFormula(formulaName: string, formulas: any) {
	return !!formulas[formulaName]
}

export function isParamSeparator(char: string) {
	return char === ","
}

export function isSpecialChar(char: string) {
	return isOperator(char) || isComparisonOperator(char) || isOpenParenthesis(char) || isCloseParenthesis(char) || isQuote(char) || isParamSeparator(char)
}


export function parseFormula(fs: string) {
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
	if (param && param.trim()) {
		stack.push(param.trim())
	}

	return stack;
}

function precedence(operator: string)
{
	switch (operator) {
	case '+':
	case '-':
	case '>':
	case '<':
	case '>=':
	case '<=':
	case '=':
		return 1;
	case '*':
	case '/':
		return 2;
	case '^':
		return 3;
	default:
		return -1;
	}
}

// convert to postfix to handle formula function
export function infixToPostfix(formulaString: string, formulas: any) {
	const elements = parseFormula(formulaString)
	const stack: string[] = []
	const postfix = []
	while (elements.length > 0) {
		const element = elements.shift()
		if (isFormula(element!, formulas)) {
			stack.push(element!)
		} 
		
		else if (isOperator(element!) || isComparisonOperator(element!)) {
			if (stack.length > 0 && precedence(element!) > precedence(stack[stack.length - 1])) {
				stack.push(element!)
			} else {
				while (stack.length && precedence(element!) <= precedence(stack[stack.length - 1])) {
					postfix.push(stack.pop())
				}
				stack.push(element!)
			}
		}

		else if (isComparisonOperator(element!)) {
			stack.push(element!)
		}
		
		else if (isOpenParenthesis(element!)) {
			stack.push(element!)
		} 
		
		else if (isParamSeparator(element!)) {
			while (!isOpenParenthesis(stack[stack.length -1])) {
				postfix.push(stack.pop())
			}
		} 
		
		else if (isCloseParenthesis(element!)) {
			while (!isOpenParenthesis(stack[stack.length - 1])) {
				postfix.push(stack.pop())
			}
			stack.pop()
			if (isFormula(stack[stack.length - 1], formulas)) {
				postfix.push(stack.pop())
			}
		} 
		
		else {
			postfix.push(element)
		}
	}
	while (stack.length > 0) {
		postfix.push(stack.pop())
	}
	console.log("postfix", postfix)
	return postfix
}

function flattenObject(obj: Record<string, any>): Record<string, any> {
	const result: Record<string, any> = {}
	function flatten(obj: any, prefix: string) {
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

export function typecast(value: FormulaParam) {
	if (!isNaN(value as number)) {
		return Number(value)
	}
	if (value === "true" || value === "false") {
		return value === "true"
	}
	if (typeof value === "string") {
		return `'${value}'`
	}
	return value
}

export function resolvePostfix(formulaString: string, context: Record<string, any>, formulas: any) {
	// try {
		const postfix = infixToPostfix(formulaString, formulas)
		const stack: FormulaParam[] = []
		const flattenedContext = flattenObject(context)
		while (postfix.length > 0) {
			const element = postfix.shift()
			if (isOperator(element!) || isComparisonOperator(element!)) {
				const value2 = typecast(stack.pop()!)
				const value1 = typecast(stack.pop()!)

				// TODO Define operator handlers, avoid to use eval
				if (element === "=") {
					stack.push(value1 === value2)
					continue
				}
				const evalString = `${value1} ${element} ${value2}`
				const rs = eval(evalString)
				stack.push(rs)
			} else if (isFormula(element!, formulas)) {
				const params = []
				const formula = formulas[element! as keyof typeof formulas]
				for (let i = 0; i < formula.params.length; i++) {
					params.push(stack.pop())
				}
				params.reverse()
				stack.push(formulas[element!].handler(...params))
			} else if (flattenedContext[element!]) {
				stack.push(flattenedContext[element!])
			} else {
				stack.push(element!)
			}
		}
		const result = stack.pop()
		return result
	// } catch (e) {
	// 	console.log(e)
	// }
}