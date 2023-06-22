# Formula X

Help to build and resolve the formula

Preview link: formula-x.netlify.app

## Formula Definitions
This is some formulas and its resolver, it can be used in the formula
When use the formula input with AutoComplete mode, these functions will be listed in the dropdown

The definition will contain list of needed `parameters` and `handler`

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

The the formula can be
```
IF ( 2 < 3, 100, 200)
```
and result will be `100`

### Parameters
To define the possible parameter can be select when build the formula
The key will be store in the formula and the resolver will use that key to pick the value in the Context

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
   // new parameters can be added
]
```

### Context
This is an data object, that includes some data fields as Parameter mention

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
the key in the parameter policy.startDate have the according value in the Context object `policy.startDate = "2020-01-01"`


# Dev

```
pnpm install & pnpm run dev
```

