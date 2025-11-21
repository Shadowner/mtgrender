export interface ImageUris {
	art_crop?: string;
	[key: string]: string | undefined;
}

export interface CardFace {
	name: string;
	mana_cost?: string;
	type_line?: string;
	oracle_text?: string;
	power?: string | number;
	toughness?: string | number;
	loyalty?: string | number;
	image_uris?: ImageUris;
	colors?: string[];
	color_indicator?: string[];
	[key: string]: any;
}

export interface Card {
	name: string;
	mana_cost?: string;
	type_line?: string;
	oracle_text?: string;
	power?: string | number;
	toughness?: string | number;
	loyalty?: string | number;
	layout?: string;
	set?: string;
	set_icon?: string;
	rarity?: string;
	frame_effects?: string[];
	image_uris?: ImageUris;
	card_faces?: CardFace[];
	collector_number?: string;
	colors?: string[];
	color_indicator?: string[];
	[key: string]: any;
}

export interface RenderOptions {
	margin: number;
	upscale: boolean;
	upscalerModel: string;
	optimize?: boolean;
}

export interface RenderProgress {
	push_task: (task: { name: string }) => void;
	push_step: (step: string) => void;
	update_step: (update: string | { type: string; value: string }) => void;
	end_step: (message?: string) => void;
	fail_step: (error: string | Error) => void;
	end_task: () => void;
	fail_task: (error?: string) => void;
}

export interface RenderContext {
	progress?: RenderProgress;
	toBlob?: boolean;
}

export type AutocompleteStatus = null | 'updating' | 'error' | string[];

export type CardLayout = 'normal' | 'adventure' | 'modal_dfc' | 'transform';

export type CardRarity = 'common' | 'uncommon' | 'rare' | 'mythic' | 'special';
