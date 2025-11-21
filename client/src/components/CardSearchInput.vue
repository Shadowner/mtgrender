<template>
	<form @submit.prevent="handleSubmit">
		<div style="position: relative; display: inline-block">
			<input
				id="card-seach-input"
				type="text"
				placeholder="Card Name..."
				:value="searchCardName"
				@input="handleInput"
				@keydown="handleKeydown"
			/>
			<div
				class="card-name-autocomplete"
				v-if="autocompleteStatus"
				@keydown="handleAutocompleteCycle"
			>
				<div v-if="autocompleteStatus === 'updating'">Searching...</div>
				<div v-if="autocompleteStatus === 'error'">An error occured.</div>
				<div v-if="Array.isArray(autocompleteStatus)">
					<ul>
						<li
							v-for="(r, idx) in autocompleteStatus"
							:key="r"
							:tabindex="idx"
							@click="handleSelectCard(r)"
							@keydown="handleAutocompleteCycle"
						>
							{{ r }}
						</li>
					</ul>
				</div>
			</div>
		</div>
		<button type="submit">Load from Scryfall</button>
	</form>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import type { AutocompleteStatus } from '../types/card';

const props = defineProps<{
	searchCardName: string;
	autocompleteStatus: AutocompleteStatus;
}>();

const emit = defineEmits<{
	'update:searchCardName': [value: string];
	autocomplete: [query: string];
	selectCard: [cardName: string];
	loadCard: [cardName: string];
	autocompleteKeydown: [event: KeyboardEvent];
	autocompleteCycle: [event: KeyboardEvent];
}>();

const handleInput = (event: Event) => {
	const target = event.target as HTMLInputElement;
	emit('update:searchCardName', target.value);
	emit('autocomplete', target.value);
};

const handleSubmit = () => {
	emit('loadCard', props.searchCardName);
};

const handleSelectCard = (cardName: string) => {
	emit('selectCard', cardName);
	emit('loadCard', cardName);
};

const handleKeydown = (event: KeyboardEvent) => {
	emit('autocompleteKeydown', event);
};

const handleAutocompleteCycle = (event: KeyboardEvent) => {
	emit('autocompleteCycle', event);
};
</script>
