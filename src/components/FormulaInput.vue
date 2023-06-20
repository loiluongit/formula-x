
<script setup lang="ts">
import { Ref, computed } from 'vue';
import { formulas, params } from '../constant';
import { isSpecialChar, parseFormula } from '../composables';

const props = defineProps({
	formulaElements: {
		type: Array,
		required: true,
	},
})

const elements: Ref<string[]> = computed(() => parseFormula(props.formulaElements.join('')))

const paramOptions = computed(() => {
	return params.map(p => ({ name: p.label, value: p.key }))
})

const formulaOptions = computed(() => {
	return Object.keys(formulas).map(key => ({ name: key, value: key }))
})

const makeupFormulaElements = computed(() => {
	return elements.value.map(el => {
		console.log(el)
		const option = paramOptions.value.find(o => o.value === el)

		if (option) {
			return {
				label: option.name,
				classes: 'bg-blue-200 ml-1',
			}
		}
		
		const formulaOption = formulaOptions.value.find(o => o.value === el)

		if (formulaOption) {
			return {
				label: formulaOption.name,
				classes: 'text-red-500 ml-1',
			}
		}

		return {
			label: el,
			classes: isSpecialChar(el as string) ? '' : 'text-blue-400 ml-1',
		}
	})
})


</script>

<template>
	<div v-for="el in makeupFormulaElements" class="flex flex-wrap px-1 rounded my-1" :class="el.classes" contenteditable="true">
		{{ el.label }}
	</div>
</template>
