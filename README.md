# Formula X

Help to build and resolve the formula

Preview link: [formula-x.netlify.app](https://formula-x.netlify.app/)

## Formula Definitions
This is some formulas and its resolver, it can be used in the formula
When using the formula input with AutoComplete mode, these functions will be listed in the dropdown

The definition will contain a list of needed `parameters` and `handler`

Sample Definition for IF:
```
{
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
   // new formula can be added
}
```

The formula can be
```
IF ( 2 < 3, 100, 200)
```
and the result will be `100`

### Parameters
To define the possible parameter that can be selected when building the formula
The key will be stored in the formula and the resolver will use that key to pick the value in the Context

Example:
```
[
   {
      domain: "policy",
      key: "policy.startDate",
      type: "date",
      label: "Policy Start Date",
      description: "Start date of policy"
   },
   //New parameters can be added
]
```

### Context
This is a data object, that includes some data fields as Parameter mention

```
{
   policy: {
      startDate: "2020-01-01",
      endDate: "2020-12-31"
   },
   person: {
      dob: "2000-03-09",
      gender: "Male"
   }
}
```
the key in the parameter policy.startDate has the according value in the Context object `policy.startDate = "2020-01-01"`


# Dev

```
pnpm install & pnpm run dev
```

