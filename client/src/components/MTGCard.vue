<template>
	<div
		ref="cardEl"
		class="mtg-card"
		:class="{
			mdfc: is_mdfc,
			transform: is_transform,
			back: currentFace === 1,
			legendary: is_legendary,
			'has-legendary-crown': has_legendary_crown,
			planeswalker: is_planeswalker,
			'planeswalker-large': is_large_planeswalker,
			saga: is_saga,
			class: is_class,
			adventure: is_adventure,
			'extended-art':
				(is_adventure ? card : card_face).art_variant === 'extended',
			'full-art': [
				'full',
				'full-footer',
				'archive',
				'japanese-archive',
			].includes((is_adventure ? card : card_face).art_variant),
			'full-footer': ['full-footer', 'japanese-archive'].includes(
				(is_adventure ? card : card_face).art_variant
			),
			archive:
				(is_adventure ? card : card_face).art_variant === 'archive',
			'japanese-archive':
				(is_adventure ? card : card_face).art_variant ===
				'japanese-archive',
			compasslanddfc: card.frame_effects?.includes('compasslanddfc'),
		}"
	>
		<div class="inner-background"></div>
		<div
			class="illustration"
			:class="{
				'behind-textbox':
					card.illustration_textbox ||
					(is_planeswalker && card.illustration_textbox !== false),
			}"
			@wheel.prevent="scale_illustration"
			@mousedown.prevent="start_drag_illustration"
			@mouseup.prevent="end_drag_illustration"
			@mousemove="drag_illustration"
			@mouseleave="cancel_drag_illustration"
		></div>
		<div class="planeswalker-oracle-bg" v-if="is_planeswalker"></div>
		<div class="inner-frame">
			<ArchiveFrame v-if="(is_adventure ? card : card_face).art_variant === 'archive'" />
		</div>
		<LegendaryCrown :visible="has_legendary_crown" />
		<CardTopLine
			ref="topLineRef"
			:cardFace="card_face"
			:manaCostSymbols="mana_cost"
			@edit-property="edit_property"
		/>
		<CardMidLine
			ref="midLineRef"
			:cardFace="card_face"
			:setIconUri="set_icon_uri"
			:colorIndicatorUri="color_indicator"
			@edit-property="edit_property"
		/>
		<template
			v-if="is_adventure && card.card_faces && card.card_faces.length > 1"
		>
			<AdventureLayout
				ref="oracle_el"
				:mainFace="card.card_faces[0]"
				:adventureFace="card.card_faces[1]"
				:mainOracleLines="oracle_lines"
				:adventureOracleLines="adventure_oracle_lines"
				:adventureManaCostSymbols="adventure_mana_cost"
				@edit-property="edit_property"
			/>
		</template>
		<template v-else-if="is_saga">
			<SagaLayout
				ref="oracle_el"
				:sagaReminder="saga_reminder"
				:sagaSteps="saga_steps"
				@edit-property="edit_property"
			/>
		</template>
		<template v-else-if="is_class">
			<ClassLayout
				ref="oracle_el"
				:classReminder="class_reminder"
				:classSteps="class_steps"
				@edit-property="edit_property"
			/>
		</template>
		<template v-else-if="planeswalker_abilities">
			<PlaneswalkerLayout
				ref="oracle_el"
				:planeswalkerAbilities="planeswalker_abilities"
				@edit-property="edit_property"
			/>
		</template>
		<template v-else-if="is_levelup">
			<div class="oracle normal-oracle levelup-oracle" ref="oracle_el">
				<div
					class="oracle-levelup-inner"
					v-for="(level, idx) in levels"
					:key="idx"
					:style="'background-color: ' + level.color + ';'"
					@dblclick="edit_property('oracle_text')"
					@mousedown.prevent=""
				>
					<div class="level-box" v-if="level.level">
						<LevelBoxBackground :box-color="level.box_color" />
						<div>{{ level.level_text }}</div>
						<div>{{ level.level }}</div>
					</div>
					<div
						class="oracle-text"
						:class="{
							'has-level': level.level,
							'has-pt': level.power,
						}"
					>
						<div
							class="oracle-inner"
							v-for="line in level.oracle_lines"
							v-html="line"
						></div>
					</div>
					<div v-if="level.power" class="pt-box">
						{{ level.power }}/{{ level.toughness }}
					</div>
				</div>
				<div
					class="oracle-flavor"
					v-if="card_face.flavor_text"
					@dblclick="edit_property('flavor_text')"
					@mousedown.prevent=""
				>
					<hr />
					{{ card_face.flavor_text }}
				</div>
			</div>
		</template>
		<template v-else>
			<NormalOracleLayout
				ref="oracle_el"
				:cardFace="card_face"
				:oracleLines="oracle_lines"
				@edit-property="edit_property"
			/>
		</template>
		<PTBox
			:cardFace="card_face"
			:isLevelup="is_levelup"
			@edit-property="edit_property"
		/>
		<LoyaltyBox
			:cardFace="card_face"
			@edit-property="edit_property"
		/>
		<CardFooter
			:card="card"
			:cardFace="card_face"
			:copyright="copyright"
			:isAdventure="is_adventure"
			@edit-property="edit_property"
		/>
		<MDFCIndicators
			:isMdfc="is_mdfc"
			:hintText="mdfc_hint_text"
			:backManaCostSymbols="mdfc_back_mana_cost"
		/>
		<TransformIndicators
			:isTransform="is_transform"
			:currentFace="currentFace"
			:backFace="back_face"
		/>
		<div v-if="is_dualfaced" class="flip-icon" @click="flip">⭯</div>
		<div
			v-if="
				debug &&
				display_debug &&
				(card?.image_uris?.png || card_face?.image_uris?.png)
			"
			class="debug-overlay"
			@mousemove="update_debug_overlay"
			@mouseleave="update_debug_overlay"
		>
			<div>
				<img
					:src="card?.image_uris?.png || card_face?.image_uris?.png"
				/>
			</div>
		</div>
		<div class="debug-controls" v-if="debug">
			<input type="number" step="0.1" v-model="debug_opacity" />
			<input type="checkbox" v-model="display_debug" />
		</div>
		<svg class="svg" height="0" width="0">
			<clipPath id="full-art-clip-path" clipPathUnits="objectBoundingBox">
				<path
					d="M0,0 H1 V0.745 C1,0.745,0.993,0.829,0.935,0.884 V0.925 H0.065 V0.884 C0.03,0.842,0.015,0.832,0,0.745 Z"
				></path>
			</clipPath>
			<clipPath
				id="full-art-planeswalker-clip-path"
				clipPathUnits="objectBoundingBox"
			>
				<path
					d="M 0 0 H 1 V 0.745 C 1 0.745 0.993 0.829 0.935 0.884 L 0.912 0.911 H 0.09 L 0.065 0.884 C 0.03 0.842 0.015 0.832 0 0.745 Z"
				></path>
			</clipPath>
		</svg>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUpdated } from 'vue';

// Components imports
import ArchiveFrame from './card/ArchiveFrame.vue';
import LevelBoxBackground from './card/LevelBoxBackground.vue';
import LegendaryCrown from './card/LegendaryCrown.vue';
import PTBox from './card/PTBox.vue';
import LoyaltyBox from './card/LoyaltyBox.vue';
import TransformIndicators from './card/TransformIndicators.vue';
import MDFCIndicators from './card/MDFCIndicators.vue';
import CardTopLine from './card/CardTopLine.vue';
import CardMidLine from './card/CardMidLine.vue';
import CardFooter from './card/CardFooter.vue';
import NormalOracleLayout from './card/NormalOracleLayout.vue';
import AdventureLayout from './card/AdventureLayout.vue';
import SagaLayout from './card/SagaLayout.vue';
import ClassLayout from './card/ClassLayout.vue';
import PlaneswalkerLayout from './card/PlaneswalkerLayout.vue';

// Composables imports
import { useOracleParser } from '../composables/useOracleParser';
import { useCardColors, computeCardColors } from '../composables/useCardColors';
import { useCardTransform } from '../composables/useCardTransform';
import { useCardTypes } from '../composables/useCardTypes';
import { useCardTypeSpecifics } from '../composables/useCardTypeSpecifics';
import { useCardAssets } from '../composables/useCardAssets';
import { useIllustration } from '../composables/useIllustration';
import { useTextFitting } from '../composables/useTextFitting';

// Props
const props = defineProps<{
	card: any;
	scale: number;
	renderMargin: number;
}>();

// Emits
const emit = defineEmits<{
	edit: [key: string | string[], value: any];
}>();

// Refs
const cardEl = ref<HTMLElement | null>(null);
const topLineRef = ref<any>(null);
const midLineRef = ref<any>(null);
const oracle_el = ref<any>(null);
const currentFace = ref(0);
const debug = ref(import.meta.env.MODE === 'development');
const display_debug = ref(false);
const debug_opacity = ref(0);

// Computed refs for composables
const card_computed = computed(() => props.card);
const scale_computed = computed(() => props.scale);

// Oracle parser
const { parse_oracle } = useOracleParser();

// Card transform (needs parse_oracle for oracle_lines)
const is_adventure_temp = computed(() => card_computed.value?.layout === 'adventure');
const {
	card_face,
	back_face,
	mana_cost,
	adventure_mana_cost,
	mdfc_back_mana_cost,
	mdfc_hint_text,
	oracle_lines,
	adventure_oracle_lines,
	copyright,
	color_indicator,
} = useCardTransform(card_computed, currentFace, is_adventure_temp, parse_oracle);

// Card types
const {
	is_land,
	is_legendary,
	has_legendary_crown,
	is_adventure,
	is_planeswalker,
	is_saga,
	is_class,
	is_vehicle,
	is_dualfaced,
	is_mdfc,
	is_transform,
	is_levelup,
} = useCardTypes(card_computed, card_face);

// Card colors (needs card types)
const {
	colors,
	boxes_colors,
	frame_colors,
	archive_frame_colors,
	japanese_color,
	japanese_name_color,
	japanese_type_line_border,
	japanese_oracle_border,
} = useCardColors(card_computed, card_face, is_land);

// Card type specifics (needs parse_oracle and other deps)
const {
	planeswalker_abilities,
	is_large_planeswalker,
	saga_reminder,
	saga_steps,
	class_reminder,
	class_steps,
	levels,
} = useCardTypeSpecifics(
	card_face,
	is_planeswalker,
	is_levelup,
	colors,
	frame_colors,
	parse_oracle
);

// Card assets
const {
	background,
	frame,
	boxes,
	mid_boxes,
	legendary_crown,
	pt_box,
	saga_text_box,
	mdfc_icon,
	mdfc_hint,
	transform_icon,
	set_icon_uri,
	illustration,
	illustration_scale,
	illustration_position,
	extended_art,
	top_line_color,
	mid_line_color,
	pt_box_color,
	mdfc_hint_color,
} = useCardAssets(
	card_computed,
	card_face,
	back_face,
	currentFace,
	colors,
	boxes_colors,
	is_adventure,
	is_planeswalker,
	is_large_planeswalker,
	is_saga,
	is_class,
	is_vehicle,
	is_mdfc,
	is_transform,
	computeCardColors
);

// Illustration
const {
	scale_illustration,
	start_drag_illustration,
	end_drag_illustration,
	cancel_drag_illustration,
	drag_illustration,
} = useIllustration(
	card_computed,
	card_face,
	currentFace,
	is_adventure,
	scale_computed,
	cardEl,
	emit
);

// Text fitting
const { fit, fit_name, fit_type_line, fit_oracle_text } = useTextFitting(
	topLineRef,
	midLineRef,
	oracle_el
);

// Methods
const set_face = (idx: number) => {
	currentFace.value = idx;
};

const edit_property = (prop: string) => {
	const r = prompt(`Edit Card property '${prop}'`, card_face.value?.[prop]);
	if (r)
		emit(
			'edit',
			props.card.card_faces && !is_adventure.value
				? ['card_faces', currentFace.value, prop]
				: prop,
			r
		);
};

const flip = () => {
	currentFace.value = (currentFace.value + 1) % 2;
	fit_name();
	fit_oracle_text();
	fit_type_line();
};

const update_debug_overlay = (event: MouseEvent) => {
	if (event.type === 'mousemove') {
		(event.target as HTMLElement).firstElementChild!.style.width =
			(event.clientX -
				(event.target as HTMLElement).parentNode!.getBoundingClientRect().x) /
				props.scale +
			'px';
	} else {
		(event.target as HTMLElement).firstElementChild!.style.width = '';
	}
};

// Lifecycle
onUpdated(() => {
	fit();
});

// Watchers
watch(
	() => props.card?.oracle_text,
	() => {
		fit_oracle_text();
	}
);

watch(
	() => props.card?.type_line,
	() => {
		fit_type_line();
	}
);

watch(
	() => props.card?.card_faces,
	() => {
		fit();
	}
);

// Define expose for external usage if needed
defineExpose({
	set_face,
});
</script>

<style type="text/css">
@import url("../card.css");
.original-name-left {
	stop-color: v-bind(frame_colors.left);
}

.original-name-right {
	stop-color: v-bind(frame_colors.right);
}

.illustration {
	position: absolute;
	top: 9.55mm;
	left: 4.4mm;
	width: 54.7mm;
	height: 39.9mm;
	margin: auto;
	background-image: v-bind(illustration);
	background-color: yellow;
	background-size: calc(v-bind(illustration_scale) * 100%);
	background-position: v-bind(illustration_position.x) v-bind(illustration_position.y);
	background-repeat: no-repeat;
	cursor: grab;
}

.rendering.extended-art .illustration {
	width: calc(100% + 2mm * v-bind(renderMargin) * v-bind(scale));
	background-size: calc(
		v-bind(illustration_scale) * (100% - 2mm * v-bind(renderMargin) * v-bind(scale))
	);
	background-position: calc(v-bind(illustration_position.x) + 1mm * v-bind(renderMargin) * v-bind(scale))
		calc(v-bind(illustration_position.y));
	left: calc(-1mm * v-bind(renderMargin) * v-bind(scale));
	right: calc(-1mm * v-bind(renderMargin) * v-bind(scale));
}

.rendering.full-art:not(.full-footer):not(.japanese-archive) .illustration {
	width: calc(100% + 2mm * v-bind(renderMargin) * v-bind(scale));
	height: calc(100% + 2mm * v-bind(renderMargin) * v-bind(scale));
	background-size: calc(
		v-bind(illustration_scale) * (100% - 2mm * v-bind(renderMargin) * v-bind(scale))
	);
	background-position: calc(v-bind(illustration_position.x) + 1mm * v-bind(renderMargin) * v-bind(scale))
		calc(v-bind(illustration_position.y) + 1mm * v-bind(renderMargin) * v-bind(scale));
	top: calc(-1mm * v-bind(renderMargin) * v-bind(scale));
	bottom: calc(-1mm * v-bind(renderMargin) * v-bind(scale));
	left: calc(-1mm * v-bind(renderMargin) * v-bind(scale));
	right: calc(-1mm * v-bind(renderMargin) * v-bind(scale));
}

.japanese-archive .name {
	background-color: v-bind(japanese_color);
	background-image: v-bind(japanese_name_color);
	color: #fff;
	padding: 1mm 2mm;
	border-radius: 1.5mm;
	outline-style: solid;
	outline-color: v-bind(japanese_color);
	outline-width: 0.6mm;
	outline-offset: 0.4mm;
}

.japanese-archive .top-line .mana-cost .ms {
	width: 4.2mm;
}

.japanese-archive .type-line,
.japanese-archive .oracle {
	background-color: #ffffffa0;
	border: 0.22mm solid v-bind(japanese_color);
}

.japanese-archive .oracle {
	outline: #0005;
	outline-width: 0.1mm;
	outline-offset: -0.6mm;
	outline-style: solid;
	padding: 0.4mm 0.8mm;
	box-sizing: border-box;

	border-image-source: v-bind(japanese_oracle_border);
	border-image-slice: 10%;
	border-image-width: 0.22mm;
	border-image-repeat: round;
}

.japanese-archive .type-line {
	border-radius: 1mm/50%;
	position: absolute;
	left: 0.4mm;
	padding: 0 3mm;
	height: 4mm;
	line-height: 4mm;
	max-width: 40mm;

	border-image-source: v-bind(japanese_type_line_border);
	border-image-slice: 50% 50%;
	border-image-width: 50% 1.5mm;
}

.full-footer .illustration,
.japanese-archive .illustration {
	background-color: #ffffff;
	clip-path: url(#full-art-clip-path);
}

.full-footer.planeswalker .illustration {
	clip-path: url(#full-art-planeswalker-clip-path);
}

.inner-background {
	position: absolute;
	left: calc((63.5mm - 58.5mm) / 2);
	width: 58.5mm;
	height: 78mm;
	margin: auto;
	border-radius: 0.75mm 0.75mm 4mm 4mm;
	overflow-y: visible;
	background-image: v-bind(background);
	background-size: 100%;
	padding-top: 1.1mm;
	background-repeat: no-repeat;

	pointer-events: none;
	user-select: none;
}

.inner-frame {
	position: absolute;
	margin: auto;
	width: calc(58.5mm * 0.98);
	top: 3.5mm;
	left: calc((63.5mm - 58.5mm * 0.98) / 2);
	height: 79mm;
	filter: drop-shadow(-0.25mm 0.25mm 0.15mm black)
		drop-shadow(0.1mm -0.2mm 0.1mm #ffffffa0);
	background-image: v-bind(frame);
	background-size: 100%;
	background-repeat: no-repeat;

	pointer-events: none;
	user-select: none;
}

.legendary-crown {
	position: absolute;
	left: 1mm;
	top: 1.5mm;
	width: 61.1mm;
	height: 14mm;
	background-image: v-bind(legendary_crown);
	background-size: 100%;
	background-repeat: no-repeat;
}

.top-line,
.mid-line {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 5.1mm;
	width: 53.8mm;
	margin: auto;
	padding: 0 1mm 0 1.5mm;
	background-image: v-bind(boxes);
	background-size: 100%;

	pointer-events: initial;
	user-select: initial;
}

.top-line {
	position: absolute;
	top: 4mm;
	left: 0;
	right: 0;
	color: v-bind(top_line_color);
	gap: 1.5mm;
}

.original-name-bg-path {
	stroke: #000000;
	stroke-width: 0.01;
	fill: url(#gradient);
}

.mid-line {
	position: absolute;
	top: 49.9mm;
	left: 0;
	right: 0;
	background-position: 0 bottom;
	gap: 0.6mm;
	color: v-bind(mid_line_color);
	background-image: v-bind(mid_boxes);
}

.saga .saga-frame {
	position: absolute;
	top: 0;
	left: -2.8mm;
	width: 10mm;
	height: 100%;
	background-image: v-bind(frame);
	background-size: 58.5mm;
	background-position: 0 -6.3mm;
	background-repeat: no-repeat;
	pointer-events: none;
}

.saga-oracle {
	position: absolute;
	left: 4.9mm;
	top: 9.95mm;
	width: 26.6mm;
	height: 64.3mm;
	background-size: cover;
	background-image: v-bind(saga_text_box);
	background-repeat: no-repeat;
}

.class-oracle {
	position: absolute;
	left: 31.8mm;
	top: 10.1mm;
	width: 26.4mm;
	height: 63.65mm;
	background-size: cover;
	background-image: v-bind(saga_text_box);
	background-repeat: no-repeat;
}

.pt-box {
	position: absolute;
	right: 3mm;
	bottom: 3.8mm;
	width: 11.58mm;
	height: 6.2mm;
	background-image: v-bind(pt_box);
	background-size: 100%;
	background-repeat: no-repeat;

	text-align: center;
	line-height: 5.5mm;
	font-family: Beleren;
	font-size: 9.6pt;
	color: v-bind(pt_box_color);

	pointer-events: initial;
	user-select: initial;

	z-index: 3;
}

.mdfc-icon {
	position: absolute;
	top: 4.1mm;
	left: 2.5mm;
	width: 5.8mm;
	aspect-ratio: calc(294 / 238);
	background-image: v-bind(mdfc_icon);
	background-size: 100%;
	z-index: 3;
}

.mdfc-hint {
	position: absolute;
	bottom: 6.2mm;
	left: 1.6mm;
	width: 28mm;
	height: 3.9mm;

	display: flex;
	justify-content: space-between;
	align-content: stretch;
	align-items: center;

	font-size: 5pt;
	color: v-bind(mdfc_hint_color);
	background-image: v-bind(mdfc_hint);
	background-size: 100%;

	padding: 0 2.6mm;
	padding-top: 0.1mm;

	box-sizing: border-box;
	z-index: 3;
}

.transform-icon {
	position: absolute;
	top: 4mm;
	left: 3.5mm;
	width: 5.4mm;
	aspect-ratio: 1;
	border-radius: 50%;
	border: 0.02mm black solid;
	box-sizing: border-box;
	background-color: white;
	background-image: v-bind(transform_icon);
	background-size: 4.7mm;
	background-position: center center;
	background-repeat: no-repeat;
	z-index: 3;
}

.archive .inner-frame {
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
	filter: none;
	background: none;

	--primary: v-bind(archive_frame_colors.primary);
	--lighter: v-bind(archive_frame_colors.lighter);
	--darker: v-bind(archive_frame_colors.darker);
	--left-primary: v-bind(archive_frame_colors.left.primary);
	--left-lighter: v-bind(archive_frame_colors.left.lighter);
	--left-darker: v-bind(archive_frame_colors.left.darker);
	--right-primary: v-bind(archive_frame_colors.right.primary);
	--right-lighter: v-bind(archive_frame_colors.right.lighter);
	--right-darker: v-bind(archive_frame_colors.right.darker);
}

.debug-overlay {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 4;
	width: 63.5mm;
	height: 100%;
	opacity: v-bind(debug_opacity);
}

.background-color {
	fill: #ecdfbf;
	filter: url(#noise);
}
</style>

<style scoped>
.oracle:deep(.ms) {
	width: 0.8em;
	margin: 0 0.07em;
	vertical-align: baseline;
}
</style>
