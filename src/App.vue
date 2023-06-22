<script setup lang="ts">
import { Ref, computed, ref } from 'vue';
import FormulaInput from './components/FormulaInput.vue';
import { params, formulas, context } from './constant';
import { resolvePostfix } from './composables';

const nextEl = ref('');
const numberOfChars = ref(0)
const result: Ref<string|undefined> = ref('')
const formulaStringX = ref('')
const autocomplete = ref(false)

// TODO allow to Ctrl + Z to undo
const formulaElements:Ref<string[]> = ref([])

const options = computed(() => {
  const paramOptions = params.map(p => ({ name: p.label, value: p.key, type: 'param' }))

  const formulaOptions = Object.keys(formulas).map(key => ({ name: key, value: key, type: 'function' }))
  return [...paramOptions, ...formulaOptions]
})

const filterOptions = computed(() => {
  return options.value.filter(o => {
    return o.name.toLowerCase().includes(nextEl.value.toLowerCase()) || 
      o.value.toLowerCase().includes(nextEl.value.toLowerCase()) || nextEl.value.length == 1
  })
})

function onkeyup(event: KeyboardEvent) {
  if (event.code === 'Enter' || event.code === 'Space') {
    if (filterOptions.value.length === 1) {
      onSelectOption(filterOptions.value[0])
    } else {
      formulaElements.value.push(nextEl.value.trim())
      nextEl.value = ''
    }
  }

  if (event.code === 'Backspace') {
    if (numberOfChars.value === 0) {
      formulaElements.value.pop()
    }
  }
  numberOfChars.value = nextEl.value.length
}

function onSelectOption(option: { name: string, value: string }) {
  formulaElements.value.push(option.value)
  nextEl.value = ''
}

function resolve(){
  if (autocomplete.value) {
    if (nextEl.value) {
      formulaElements.value.push(nextEl.value.trim())
      nextEl.value = ''
    }
    const formulaString = formulaElements.value.join('')
    console.log("---", formulaString)
    result.value = resolvePostfix(formulaString, context, formulas) as string
    } else {
    console.log("---", formulaStringX)
    result.value = resolvePostfix(formulaStringX.value, context, formulas) as string
  }
}
</script>

<template>
  <div class="container flex justify-center flex-col items-center p-10">
    <div class="w-3/4">
      <p class="text-sm">Formula Input</p>

      <div v-if="autocomplete" class="border rounded bg-white border-cyan-500 min-h-[40px] w-full mt-2 mx-auto flex justify-start items-center font-mono px-2 flex-wrap">  
        <FormulaInput :formulaElements="formulaElements"></FormulaInput>

        <div class="relative flex-grow min-w-[50px]">
          <input class="ml-1 min-h-10 outline-none w-full" type="text" v-model="nextEl" @keyup="onkeyup">
          <!-- drop down -->
          <div v-if="nextEl && filterOptions.length" class="option-dropdown transition absolute left-0 w-auto h-auto border rounded border-gray-500 bg-white p-2">
            <div class="px-1 py-1 border-b border-gray-200 last:border-b-0 hover:bg-slate-200 rounded" v-for="o in filterOptions" @click="onSelectOption(o)"> 
              <span class="w-7 inline-block">
                <span class="w-full inline-block text-sm bg-blue-200 rounded p-1 text-center" v-if="o.type === 'param'">P</span>
                <span class="w-full inline-block text-sm bg-red-300 rounded p-1 text-center" v-if="o.type === 'function'">Fn</span>
              </span>
              {{ o.name }}
            </div>
          </div>
        </div>
      </div>

      <div v-else class="border rounded bg-white border-gray-400 min-h-[40px] w-full mt-2 mx-auto flex justify-start items-center font-mono px-2 flex-wrap">
        <input class="ml-1 min-h-10 outline-none w-full" type="text" v-model="formulaStringX">
      </div>

      <!-- Auto complete toggle -->
      <div class="flex items-center mt-2">
        <input type="checkbox" class="mr-2" v-model="autocomplete">
        <span class="text-sm">Auto complete</span>
      </div>
    </div>

    <button @click="resolve" class="m-4 border rounded bg-slate-600 text-gray-50 w-32 py-1">Resolve</button>

    <div class="w-3/4">
      <p class="text-sm">Result</p>
      <div class="border rounded bg-white border-gray-400 h-10 w-ful mt-2 mx-auto flex justify-start items-center font-mono px-2 flex-wrap">
        {{ result }}
      </div>
    </div>
  </div>  
</template>

<style>
  .option-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    width: auto;
    height: auto;
    border: 1px solid #ccc;
    background-color: #fff;
    cursor: pointer;
  }
</style>
