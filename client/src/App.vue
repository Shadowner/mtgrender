<template>
	<div @drop="handleDrop" @dragover="handleDragOver" class="app">
		<AppHeader :rendering="rendering" @newCard="handleNewCard" @save="handleSave" @render="render">
			<template #search>
				<CardSearchInput
					v-model:searchCardName="searchCardName"
					:autocompleteStatus="autocompleteStatus"
					@autocomplete="handleAutocomplete"
					@selectCard="handleSelectCard"
					@loadCard="handleLoadCard"
					@autocompleteKeydown="handleAutocompleteKeydown"
					@autocompleteCycle="handleAutocompleteCycle"
				/>
			</template>
		</AppHeader>

		<div class="content">


			<div class="card-display">
				<MTGCard
					:card="finalCard"
					:scale="displayScale"
					:renderMargin="renderOptions.margin"
					@edit="editCard"
				/>
			</div>

			<div style="flex-grow: 1">
				<CardTabs :tabs="tabs" v-model:currentTab="currentTab">
					<div v-show="currentTab === 0" class="inner-tab card-info">
						<div style="display: flex; justify-content: space-between">
							<div>
								<div>
									<label for="card-layout">Layout</label>
									<input
										id="card-layout"
										v-model="card.layout"
										type="text"
										list="card-layouts"
										@change="layoutChange"
									/>
									<datalist id="card-layouts">
										<option
											v-for="layout in cardLayouts"
											:key="layout"
											:value="layout"
										></option>
									</datalist>
								</div>
								<div>
									<label for="card-set">Set</label>
									<input
										id="card-set"
										v-model="card.set"
										list="card-sets"
										type="text"
										style="width: 4em"
									/>
									<datalist id="card-sets">
										<option
											v-for="s in setsWithIcons"
											:key="s"
											:value="s"
										></option>
									</datalist>
									<a @click="card.set = undefined">↺</a>
									<input
										id="card-set-icon"
										v-model="card.set_icon"
										type="text"
										placeholder="Custom Icon URL"
										style="width: 13em"
									/>
									<a @click="card.set_icon = undefined">↺</a>
								</div>
								<div>
									<label for="card-rarity">Rarity</label>
									<select id="card-rarity" v-model="card.rarity">
										<option
											v-for="r in cardRarities"
											:key="r"
											:value="r"
										>
											{{ r }}
										</option>
									</select>
									<a @click="card.rarity = undefined">↺</a>
								</div>
							</div>
							<div>
								<div style="display: flex; align-items: center">
									<label for="card-frame-effects">Frame Effects</label>
									<div id="card-frame-effects" style="display: inline-block">
										<form @submit.prevent="handleAddFrameEffect">
											<input
												type="text"
												id="add-frame-effect"
												name="add-frame-effect"
												list="frame-effects"
											/>
											<datalist id="frame-effects">
												<option
													v-for="e in frameEffects"
													:key="e"
													:value="e"
												></option>
											</datalist>
											<button type="submit">Add</button>
										</form>
										<ul style="margin: 0 1em; padding: 0">
											<li
												v-for="(r, idx) in card.frame_effects"
												:key="r"
												:value="r"
											>
												<input type="text" v-model="card.frame_effects![idx]" />
												<span @click="removeFrameEffect(idx)" class="clickable">
													🗑
												</span>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>

						<template v-if="card.card_faces && card.card_faces.length > 1">
							<div>
								<label for="card-full-name">Full Name</label>
								<input id="card-full-name" v-model="card.name" type="text" />
							</div>
							<IllustrationEditor
								v-if="card.layout === 'adventure'"
								v-model="card"
								@outline="outlineElement"
							/>
							<div class="dual-face-editor">
								<div>
									<h2>{{ card.layout === 'adventure' ? 'Main' : 'Front' }}</h2>
									<CardFaceEditor
										v-model="card.card_faces[0]"
										@outline="outlineElement"
										:illustrationEditor="card.layout !== 'adventure'"
									/>
								</div>
								<div>
									<h2>
										{{ card.layout === 'adventure' ? 'Adventure' : 'Back' }}
									</h2>
									<CardFaceEditor
										v-model="card.card_faces[1]"
										@outline="outlineElement"
										:illustrationEditor="card.layout !== 'adventure'"
									/>
								</div>
							</div>
						</template>
						<template v-else>
							<CardFaceEditor v-model="card" @outline="outlineElement" />
						</template>
					</div>

					<div v-show="currentTab === 1" class="inner-tab">
						<textarea
							:value="JSON.stringify(card, null, 2)"
							@change="updateCard"
							ref="jsonViewRef"
							class="large-textarea"
							rows="20"
							spellcheck="false"
						></textarea>
					</div>

					<div v-show="currentTab === 2" class="inner-tab">
						<RenderSettings v-model="renderOptions" />
					</div>

					<div v-show="currentTab === 3" class="inner-tab">
						<div>
							<label>Default Card Properties:</label><br />
							<textarea
								:value="JSON.stringify(defaultCardProperties, null, 2)"
								@change="updateDefaultCardProperties"
								ref="defaultCardPropertiesJsonViewRef"
								class="large-textarea"
								rows="20"
								spellcheck="false"
							></textarea>
						</div>
						<div>
							<label>Override Card Properties:</label><br />
							<textarea
								:value="JSON.stringify(overrideCardProperties, null, 2)"
								@change="updateOverrideCardProperties"
								ref="overrideCardPropertiesJsonViewRef"
								class="large-textarea"
								rows="20"
								spellcheck="false"
							></textarea>
						</div>
					</div>
				</CardTabs>
			</div>

			<!-- <CardStore :currentCard="card" @load="loadCard" @renderAll="renderAll" ref="storeRef" /> -->
		</div>


	</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import SetsWithIcons from "./assets/data/sets_with_icons.json";
import MTGCard from './components/MTGCard.vue';
import CardFaceEditor from './components/CardFaceEditor.vue';
import CardStore from './components/CardStore.vue';
import RenderSettings from './components/RenderSettings.vue';
import IllustrationEditor from './components/IllustrationEditor.vue';
import AppHeader from './components/AppHeader.vue';
import CardSearchInput from './components/CardSearchInput.vue';
import CardTabs from './components/CardTabs.vue';

import { useCardData } from './composables/useCardData';
import { useCardAutocomplete } from './composables/useCardAutocomplete';
import { useCardRender } from './composables/useCardRender';
import { useDragDrop } from './composables/useDragDrop';
import { useLocalStorage, useLocalStorageSync } from './composables/useLocalStorage';
import { scryfallService } from './services/scryfallService';

import {
	CARD_LAYOUTS,
	CARD_RARITIES,
	FRAME_EFFECTS,
	TABS,
	DEFAULT_RENDER_OPTIONS,
} from './constants/cardConstants';

import type { Card, RenderOptions } from './types/card';

// Constants
const cardLayouts = CARD_LAYOUTS;
const cardRarities = CARD_RARITIES;
const frameEffects = FRAME_EFFECTS;
const tabs = TABS;
const setsWithIcons = SetsWithIcons;

// State
const displayScale = ref(2.0);
const currentTab = ref(0);

// Render options
const { getStoredValue: getRenderOptions } = useLocalStorage<RenderOptions>(
	'renderOptions',
	DEFAULT_RENDER_OPTIONS
);
const renderOptions = ref<RenderOptions>(getRenderOptions());
useLocalStorageSync('renderOptions', renderOptions, true);

// Card data management
const {
	card,
	defaultCardProperties,
	overrideCardProperties,
	finalCard,
	newCard,
	loadCard: loadCardData,
	editCard,
	layoutChange,
	addFrameEffect,
	removeFrameEffect,
} = useCardData();

// Sync card properties to localStorage
useLocalStorageSync('defaultCardProperties', defaultCardProperties, false);
useLocalStorageSync('overrideCardProperties', overrideCardProperties, false);

// Autocomplete
const {
	searchCardName,
	autocompleteStatus,
	autocompleteCardName,
	selectCard,
	handleAutocompleteKeydown,
	handleAutocompleteCycle,
} = useCardAutocomplete();

// Refs
const cardComponentRef = ref<any>(null);
const jsonViewRef = ref<HTMLTextAreaElement | null>(null);
const storeRef = ref<any>(null);
const defaultCardPropertiesJsonViewRef = ref<HTMLTextAreaElement | null>(null);
const overrideCardPropertiesJsonViewRef = ref<HTMLTextAreaElement | null>(null);

// Rendering
const { rendering, render, renderAll } = useCardRender(
	renderOptions,
	displayScale,
	cardComponentRef
);

// Drag and drop
const { handleDrop, handleDragOver } = useDragDrop(
	card,
	(cardData: Card) => {
		loadCardData(cardData);
		handleSave();
	},
	(imageUrl: string) => {
		if (!card.value.image_uris) {
			card.value.image_uris = {};
		}
		card.value.image_uris.art_crop = imageUrl;
	}
);

// Handlers
const handleNewCard = () => {
	newCard();
};

const handleSave = () => {
	storeRef.value?.save();
};

const handleAutocomplete = (query: string) => {
	autocompleteCardName(query);
};

const handleSelectCard = (cardName: string) => {
	selectCard(cardName);
};

const handleLoadCard = async (cardName: string) => {
	try {
		const cardData = await scryfallService.getCard(cardName);
		loadCardData(cardData);
	} catch (error: any) {
		alert('Not found.\nDetails: ' + error.message);
	}
};

const handleAddFrameEffect = (event: Event) => {
	const form = event.target as HTMLFormElement;
	const input = form.querySelector('#add-frame-effect') as HTMLInputElement;
	if (input.value) {
		addFrameEffect(input.value);
		input.value = '';
	}
};

const outlineElement = () => {
	// FIXME: Disabled for now
	return false;
};

const updateCard = (event: Event) => {
	const target = event.target as HTMLTextAreaElement;
	try {
		loadCardData(JSON.parse(target.value));
	} catch (err) {
		console.error(err);
	}
};

const updateDefaultCardProperties = (event: Event) => {
	const target = event.target as HTMLTextAreaElement;
	try {
		defaultCardProperties.value = JSON.parse(target.value);
	} catch (err) {
		console.error(err);
	}
};

const updateOverrideCardProperties = (event: Event) => {
	const target = event.target as HTMLTextAreaElement;
	try {
		overrideCardProperties.value = JSON.parse(target.value);
	} catch (err) {
		console.error(err);
	}
};

// Watchers
watch(card, () => {
	if (jsonViewRef.value) {
		jsonViewRef.value.value = JSON.stringify(card.value, null, 2);
	}
});

watch(defaultCardProperties, () => {
	if (defaultCardPropertiesJsonViewRef.value) {
		defaultCardPropertiesJsonViewRef.value.value = JSON.stringify(
			defaultCardProperties.value,
			null,
			2
		);
	}
});

watch(overrideCardProperties, () => {
	if (overrideCardPropertiesJsonViewRef.value) {
		overrideCardPropertiesJsonViewRef.value.value = JSON.stringify(
			overrideCardProperties.value,
			null,
			2
		);
	}
});

// Lifecycle
onMounted(() => {
	if (!storeRef.value?.load_default()) {
		handleLoadCard('Elspeth Conquers Death');
	}
});

onUnmounted(() => {
	// Cleanup if needed
});
</script>
