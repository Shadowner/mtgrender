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
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 14.36 20"
				id="archive-frame"
				width="100%"
				height="100%"
				preserveAspectRatio="none"
				v-if="
					(is_adventure ? card : card_face).art_variant === 'archive'
				"
			>
				<filter
					id="noise"
					x="0%"
					y="0%"
					width="100%"
					height="100%"
					filterUnits="userSpaceOnUse"
				>
					<feTurbulence
						baseFrequency="0.16"
						numOctaves="16"
						result="noisy"
						seed="2"
					/>
					<feTurbulence
						baseFrequency="8"
						numOctaves="16"
						type="fractalNoise"
						result="noisy2"
						seed="157"
					/>
					<feColorMatrix
						type="luminanceToAlpha"
						in="noisy"
						result="alphaNoise1"
					/>
					<feColorMatrix
						type="luminanceToAlpha"
						in="noisy2"
						result="alphaNoise2"
					/>
					<feFlood
						x="0"
						y="0"
						width="100%"
						height="100%"
						flood-color="#d5b057"
						flood-opacity="1"
						result="flood"
					/>
					<feComposite
						operator="out"
						in="alphaNoise1"
						in2="alphaNoise2"
						result="alphaNoise"
					/>
					<feComposite
						operator="in"
						in="flood"
						in2="alphaNoise"
						result="coloredNoise"
					/>
					<feComposite
						operator="in"
						in="coloredNoise"
						in2="SourceGraphic"
						result="finalNoise"
					/>
					<feBlend
						in="SourceGraphic"
						in2="finalNoise"
						mode="multiply"
					/>
				</filter>
				<defs>
					<clipPath id="illustration-clip">
						<path
							d="M 0.425 2.321 H 13.902 L 14.4 2.481 V 0 H 0 V 2.496 Z"
						/>
					</clipPath>
					<clipPath id="top-clip">
						<path
							d="M 1.026 0.84 H 13.37 c 0.206 0.329 0.186 0.876 -0.026 1.198 H 1 c -0.213 -0.417 -0.151 -0.965 0.02 -1.177 Z"
						/>
					</clipPath>
				</defs>
				<g stroke="black" stroke-width="0.06">
					<g clip-path="url(#illustration-clip)">
						<rect
							class="background-color"
							x="0"
							y="0"
							width="100%"
							height="100%"
							stroke-width="0"
						/>
						<circle
							class="background-feature"
							cx="8.5"
							cy="1.2"
							r="5"
						/>
						<circle
							class="background-feature"
							cx="8.5"
							cy="4"
							r="5"
						/>
						<circle
							class="background-feature"
							cx="10"
							cy="2"
							r="1.8"
							stroke-width="0.04"
							opacity="0.5"
						/>
						<circle
							class="background-feature"
							cx="12"
							cy="2"
							r="2"
							stroke-width="0.04"
							opacity="0.5"
						/>

						<circle class="gold" cx="1.345" cy="1.432" r="1.24" />
						<circle class="gold" cx="13.013" cy="1.432" r="1.24" />

						<circle class="gold" cx="2.6" cy="0.588" r="0.1" />
						<circle class="gold" cx="3" cy="0.588" r="0.1" />
						<circle class="gold" cx="3.4" cy="0.588" r="0.1" />

						<circle class="gold" cx="10.95" cy="0.588" r="0.1" />
						<circle class="gold" cx="11.35" cy="0.588" r="0.1" />
						<circle class="gold" cx="11.75" cy="0.588" r="0.1" />

						<path
							class="primary-color"
							d="M -0.017 0.403 C 0.079 0.355 0.166 0.292 0.302 0.24 C 0.445 0.156 0.536 0.085 0.624 -0.047 H 1.053 C 0.918 0.164 0.823 0.244 0.576 0.351 C 0.369 0.459 0.13 0.566 -0.005 0.733 Z M 13.319 -0.028 C 13.44 0.161 13.605 0.282 13.831 0.384 C 14.03 0.444 14.199 0.579 14.375 0.715 V 0.379 C 14.2593 0.3293 14.154 0.278 14.028 0.222 C 13.889 0.142 13.81 0.096 13.733 -0.02 Z"
						/>
						<path
							class="primary-left-color"
							d="M 0.853 0.521 H 1.657 C 1.905 0.55 2.017 0.612 2.178 0.81 H 7.201 V 2.31 H 0.797 C 0.701 2.123 0.653 1.96 0.616 1.765 L 0.292 1.452 L 0.625 1.184 C 0.69 0.875 0.714 0.728 0.845 0.525 Z"
						/>
						<path
							class="primary-right-color"
							transform="translate(14.36) scale(-1 1)"
							d="M 0.853 0.521 H 1.657 C 1.905 0.55 2.017 0.612 2.178 0.81 H 7.201 V 2.31 H 0.797 C 0.701 2.123 0.653 1.96 0.616 1.765 L 0.292 1.452 L 0.625 1.184 C 0.69 0.875 0.714 0.728 0.845 0.525 Z"
						/>

						<g id="top-ring">
							<path
								class="lighter-left-color"
								d="M 7.2 -1.8 A 1 1 0 0 0 7.2 4.4 V 4 A 1 1 0 0 1 7.2 -1.4 Z"
							/>
							<path
								class="lighter-right-color"
								d="M 7.2 -1.4 A 1 1 0 0 1 7.2 4 V 4.4 A 1 1 0 0 0 7.2 -1.8 Z"
							/>
							<path
								class="primary-left-color"
								d="M 7.2 -1.6 A 1 1 0 0 0 7.2 4.1 V 3.96 A 1 1 0 0 1 7.2 -1.46 Z"
								stroke-width="0"
							/>
							<path
								class="primary-right-color"
								d="M 7.2 -1.46 A 1 1 0 0 1 7.2 3.96 V 4.098 A 1 1 0 0 0 7.2 -1.6 Z"
								stroke-width="0"
							/>
						</g>

						<path
							class="lighter-color"
							d="M 5.266 2.07 L 5.421 2.305 H 9.004 L 9.207 2.07 Z"
						/>

						<rect
							x="2.29"
							y="2.312"
							width="16"
							height="2"
							fill="black"
						/>
					</g>

					<path
						class="darker-color"
						d="M -0.046 10.999 H 14.455 V 11.93 L 13.408 13.145 V 12.462 H 1.009 V 13.058 L -0.045 11.793 Z"
					/>
					<path
						class="lighter-color"
						d="M 1.8 10.999 H 13.364 V 11.445 H 2.639 Z"
					/>
					<path
						class="primary-color"
						d="M 13.873 11.24 C 13.939 11.28 13.973 11.318 13.964 11.381 C 13.962 11.472 13.953 11.481 13.914 11.526 C 13.867 11.575 13.86 11.587 13.815 11.602 C 13.7627 11.602 13.7103 11.602 13.649 11.569 C 13.6113 11.5437 13.5647 11.4853 13.534 11.413 C 13.5167 11.346 13.5153 11.265 13.525 11.203 C 13.546 11.1257 13.578 11.0673 13.61 11.009 C 13.69 10.921 13.789 10.861 13.925 10.822 C 14.052 10.81 14.124 10.806 14.239 10.865 C 14.351 10.913 14.378 10.929 14.45 10.993 C 14.526 11.108 14.589 11.212 14.613 11.355 C 14.637 11.53 14.625 11.626 14.585 11.725 C 14.514 11.877 14.454 11.976 14.355 12.096 C 14.2117 12.3017 14.0683 12.5073 13.925 12.713 C 13.87 12.812 13.818 12.908 13.809 13.067 C 13.804 13.643 13.799 14.219 13.794 14.795 C 13.7887 15.3537 13.7833 15.9123 13.778 16.471 C 13.7847 16.9237 13.7913 17.3763 13.798 17.829 C 13.798 17.9247 13.798 18.0203 13.798 18.116 C 13.686 18.203 13.634 18.239 13.543 18.271 C 13.5323 17.067 13.5217 15.863 13.511 14.659 C 13.531 14.01 13.503 13.764 13.511 13.517 C 13.513 13.295 13.513 13.081 13.576 12.846 C 13.634 12.657 13.69 12.541 13.79 12.41 C 13.961 12.183 14.08 12.02 14.216 11.757 C 14.271 11.622 14.295 11.51 14.276 11.386 C 14.256 11.281 14.199 11.217 14.132 11.189 C 14.07 11.166 14.01 11.16 13.948 11.184 C 13.917 11.196 13.896 11.213 13.878 11.231 Z"
					/>
					<path
						class="primary-color"
						d="M 0.527 12.847 C 0.544 12.9 0.564 12.969 0.563 13.113 C 0.567 13.616 0.571 14.119 0.575 14.622 C 0.58 15.142 0.567 15.668 0.571 16.196 C 0.567 16.6553 0.571 17.1197 0.575 17.584 C 0.575 17.7593 0.575 17.9347 0.575 18.11 C 0.639 18.198 0.716 18.231 0.813 18.256 V 12.627 L 0.765 12.574 Z"
					/>

					<path
						class="gold"
						d="M 0.536 14.616 L 0.289 14.354 L 0.31 13.619 C 0.342 13.38 0.667 13.017 0.912 12.839 V 16.707 L 0.523 17.109 L 0.514 17.663 L 0.564 17.745 L 0.559 18.123 C 0.402 18.002 0.323 17.835 0.245 17.647 L 0.263 17.025 C 0.263 16.969 0.286 16.915 0.323 16.871 L 0.868 16.342 V 13.39 C 0.715 13.45 0.629 13.635 0.549 13.788 Z"
					/>
					<path
						transform="translate(14.36,0) scale(-1, 1)"
						class="gold"
						d="M 0.536 14.616 L 0.289 14.354 L 0.31 13.619 C 0.342 13.38 0.667 13.017 0.912 12.839 V 16.707 L 0.523 17.109 L 0.514 17.663 L 0.564 17.745 L 0.559 18.123 C 0.402 18.002 0.323 17.835 0.245 17.647 L 0.263 17.025 C 0.263 16.969 0.286 16.915 0.323 16.871 L 0.868 16.342 V 13.39 C 0.715 13.45 0.629 13.635 0.549 13.788 Z"
					/>

					<path
						fill="black"
						stroke-width="0"
						d="M 0.854 18.258 H 13.53 C 13.956 18.121 14.175 17.744 14.413 16.781 V 20.059 H -0.026 V 16.809 C 0.165 17.405 0.388 18.22 0.855 18.26"
					/>

					<path
						class="background-color"
						d="M 0.968 12.46 H 13.359 V 15.067 C 14.04 15.257 13.669 15.913 13.364 15.887 V 18.579 H 0.98 V 15.911 C 0.547 15.818 0.429 15.151 0.956 15.057 Z"
					/>

					<path
						class="lighter-left-color"
						d="M 0.849 12.558 V 14.935 C 0.516 15.007 0.158 15.671 0.823 15.998 V 18.583 H 1.103 V 15.765 H 0.942 C 0.703 15.754 0.568 15.287 0.942 15.157 H 1.087 V 12.552 H 9.354 L 9.921 12.338 L 1.048 12.324 C 0.799 12.16 0.721 11.377 1.178 10.998 C 1.38 11.107 1.484 11.169 1.666 11.226 H 2.522 C 1.93 11.034 1.401 10.713 1.027 10.521 C 0.41 11.159 0.337 12.025 0.851 12.56 Z Z"
					/>
					<path
						class="lighter-right-color"
						d="M 9.356 12.555 H 13.267 V 15.17 H 13.399 C 13.557 15.2 13.654 15.317 13.648 15.476 C 13.651 15.62 13.54 15.779 13.401 15.787 H 13.263 V 18.655 H 13.52 V 16.023 C 14.087 15.748 13.998 15.115 13.516 14.949 V 12.552 C 13.904 12.268 13.987 11.434 13.428 10.82 L 12.75 11.242 L 9.356 12.555 Z"
					/>

					<path
						class="background-color"
						d="M 1 11.22 h 12.37 c 0.231 0.263 0.236 0.879 -0.027 1.126 h -12.313 c -0.231 -0.324 -0.248 -0.748 -0.033 -1.122 z"
					/>
					<circle
						class="gold"
						cx="1"
						cy="15.476"
						r="0.14"
						stroke-width="0.04"
					/>
					<circle
						class="gold"
						cx="13.356"
						cy="15.476"
						r="0.14"
						stroke-width="0.04"
					/>

					<path
						class="primary-color"
						d="M 0.611 11.258 C 0.53 11.231 0.454 11.24 0.428 11.338 C 0.412 11.477 0.464 11.517 0.531 11.553 C 0.603 11.577 0.686 11.561 0.742 11.489 C 0.83 11.386 0.855 11.319 0.842 11.184 C 0.834 11.036 0.738 10.952 0.639 10.885 C 0.544 10.83 0.48 10.817 0.329 10.815 C 0.157 10.833 0.049 10.884 -0.036 10.952 C -0.19 11.118 -0.229 11.324 -0.232 11.538 C -0.211 11.672 -0.211 11.648 -0.158 11.804 C -0.084 11.965 0.209 12.357 0.332 12.52 L 0.512 12.812 L 0.743 12.552 C 0.593 12.396 0.396 12.151 0.158 11.775 C 0.094 11.634 0.09 11.498 0.109 11.339 C 0.137 11.252 0.205 11.155 0.316 11.147 C 0.38 11.14 0.429 11.141 0.489 11.152 C 0.519 11.162 0.551 11.184 0.583 11.213 Z"
					/>

					<path
						class="gold"
						d="M 0.702 12.419 C 0.547 12.5 0.336 12.683 0.339 12.987 L 0.507 13.116 L 0.549 13.096 C 0.511 13.011 0.608 12.865 0.834 12.668 C 0.8373 12.6343 0.8407 12.6007 0.836 12.563 C 0.808 12.517 0.781 12.466 0.719 12.422 Z"
					/>
					<path
						class="gold"
						d="M 0.702 12.419 C 0.547 12.5 0.336 12.683 0.339 12.987 L 0.507 13.116 L 0.549 13.096 C 0.511 13.011 0.608 12.865 0.834 12.668 C 0.8373 12.6343 0.8407 12.6007 0.836 12.563 C 0.808 12.517 0.781 12.466 0.719 12.422 Z"
						transform="translate(14.36,0) scale(-1, 1)"
					/>

					<path
						class="lighter-color"
						d="M -0.065 2.822 C 0.007 2.73 0.112 2.62 0.282 2.605 H 2.066 L 3.889 0.847 H 10.413 L 12.303 2.599 H 14.102 C 14.273 2.68 14.369 2.736 14.487 2.864 V 2.538 C 14.365 2.449 14.286 2.357 14.118 2.347 H 12.394 L 10.541 0.564 H 8.353 C 8.226 0.555 8.116 0.513 8.044 0.435 C 7.942 0.332 7.861 0.214 7.754 0.16 C 7.66 0.104 7.584 0.095 7.483 0.128 C 7.539 0.216 7.557 0.251 7.543 0.422 C 7.507 0.585 7.378 0.668 7.203 0.672 C 7.006 0.659 6.964 0.596 6.881 0.506 C 6.821 0.383 6.821 0.265 6.899 0.148 C 6.828 0.11 6.733 0.104 6.651 0.157 C 6.472 0.256 6.398 0.441 6.224 0.511 C 6.112 0.56 5.993 0.556 5.879 0.56 H 3.81 L 1.987 2.336 H 0.301 C 0.129 2.354 0.021 2.405 -0.091 2.481 Z"
					/>
					<path
						class="background-color"
						d="M 1 0.814 H 13.37 c 0.237 0.351 0.233 0.868 -0.002 1.251 H 1 c -0.227 -0.379 -0.229 -0.947 0 -1.251 Z"
					/>
					<g clip-path="url(#top-clip)">
						<path
							class="top-feature"
							d="M 5.191 2.214 C 4.399 1.521 2.825 1.205 0.69 1.647 M 4.536 2.298 C 4.87 1.658 5.443 0.958 6.246 0.532 M 5.272 2.139 C 5.53 1.57 5.996 1.065 6.624 0.604 M 6.68 0.671 C 6.82 0.993 6.967 1.189 7.206 1.541 M 6.35 0.719 C 6.402 1.172 6.791 1.861 6.982 2.139"
						/>
						<path
							class="top-feature"
							transform="translate(14.36,0) scale(-1, 1)"
							d="M 5.191 2.214 C 4.399 1.521 2.825 1.205 0.69 1.647 M 4.536 2.298 C 4.87 1.658 5.443 0.958 6.246 0.532 M 5.272 2.139 C 5.53 1.57 5.996 1.065 6.624 0.604 M 6.68 0.671 C 6.82 0.993 6.967 1.189 7.206 1.541 M 6.35 0.719 C 6.402 1.172 6.791 1.861 6.982 2.139"
						/>
					</g>
					<path
						id="top-front"
						class="lighter-left-color"
						d="M 4.453 0.83 C 4.471 0.865 4.49 0.888 4.529 0.896 H 5.243 C 5.297 0.896 5.335 0.884 5.384 0.846 L 6.477 -0.087 H 6.003 L 5.188 0.657 C 5.113 0.722 5.022 0.787 4.918 0.829 H 4.452 Z"
					/>
					<path
						id="top-front"
						class="lighter-right-color"
						transform="translate(14.36,0) scale(-1, 1)"
						d="M 4.453 0.83 C 4.471 0.865 4.49 0.888 4.529 0.896 H 5.243 C 5.297 0.896 5.335 0.884 5.384 0.846 L 6.477 -0.087 H 6.003 L 5.188 0.657 C 5.113 0.722 5.022 0.787 4.918 0.829 H 4.452 Z"
					/>

					<path
						class="gold"
						d="M 8.73 18.578 C 8.939 18.633 9.067 18.705 9.146 18.865 H 13.019 L 13.015 18.578 Z"
					/>
					<path
						class="gold"
						d="M 12.645 18.37 C 12.553 18.374 12.537 18.43 12.502 18.458 C 12.366 18.569 12.223 18.641 12.044 18.705 H 12.888 L 13.17 18.366 Z"
					/>
					<path
						class="gold"
						d="M 13.063 18.864 H 12.167 C 12.577 18.693 12.987 18.454 13.258 18.08 V 18.685 Z"
					/>
				</g>
			</svg>
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
						<svg
							style="
								position: absolute;
								top: 0.7mm;
								left: 0;
								z-index: -1;
								width: 9mm;
								height: 6mm;
							"
							viewBox="-3 0 34 22"
							version="1.1"
							xmlns="http://www.w3.org/2000/svg"
							id="level-box-bg"
							preserveAspectRatio="none"
						>
							<defs>
								<filter id="inset-shadow">
									<feOffset dx="1" dy="-1" />
									<feGaussianBlur
										stdDeviation="1"
										result="offset-blur"
									/>
									<feComposite
										operator="out"
										in="SourceGraphic"
										in2="offset-blur"
										result="inverse"
									/>
									<feFlood
										flood-color="black"
										flood-opacity="1"
										result="color"
									/>
									<feComposite
										operator="in"
										in="color"
										in2="inverse"
										result="shadow"
									/>
									<feComponentTransfer
										in="shadow"
										result="shadow"
									>
										<feFuncA type="linear" slope="1" />
									</feComponentTransfer>
									<feComposite
										operator="over"
										in="shadow"
										in2="SourceGraphic"
									/>
								</filter>
								<filter id="drop-shadow">
									<feComponentTransfer>
										<feFuncR type="linear" slope="1.2" />
										<feFuncG type="linear" slope="1.2" />
										<feFuncB type="linear" slope="1.2" />
									</feComponentTransfer>
									<feDropShadow
										dx="-1"
										dy="0.6"
										stdDeviation="1"
									/>
								</filter>
							</defs>
							<path
								d="M 0 0 H 20 L 30 10 L 20 20 H 0 Z"
								:fill="level.box_color"
								filter="url(#drop-shadow)"
							/>
							<path
								d="M 0 0 H 20 L 30 10 L 20 20 H 0 Z M 2 2 V 18 H 18.8 L 27.2 10.000 L 18.8 2 Z"
								:fill="level.box_color"
								filter="url(#inset-shadow)"
							/>
						</svg>
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
import { useCardColors } from '../composables/useCardColors';
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

// Card type specifics (needs parse_oracle and other deps)
const {
	planeswalker_abilities,
	saga_reminder,
	saga_steps,
	class_reminder,
	class_steps,
	levels,
} = useCardTypeSpecifics(
	card_face,
	computed(() => false), // Temporary, will be replaced
	computed(() => false), // Temporary, will be replaced
	computed(() => ''), // Temporary, will be replaced
	computed(() => ({ left: '', right: '' })), // Temporary, will be replaced
	parse_oracle
);

// Card types (needs planeswalker_abilities)
const {
	is_land,
	is_legendary,
	has_legendary_crown,
	is_adventure,
	is_planeswalker,
	is_large_planeswalker,
	is_saga,
	is_class,
	is_vehicle,
	is_dualfaced,
	is_mdfc,
	is_transform,
	is_levelup,
} = useCardTypes(card_computed, card_face, planeswalker_abilities);

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

// Update card type specifics with real values
const compute_colors_func = (face: any): string => {
	if (
		face?.colors === undefined &&
		face?.color_identity === undefined &&
		face?.mana_cost === undefined
	)
		return 'Colourless';

	let colorsList =
		face?.colors && face?.colors.length > 0
			? face?.colors
			: face?.color_identity
			? face?.color_identity
			: [...face.mana_cost].filter((c: string) => 'WUBRG'.includes(c));

	if (colorsList.length === 0 && card_computed.value.color_identity?.length > 0)
		colorsList = card_computed.value.color_identity;

	const sorted_colors = [...new Set(colorsList)]
		.sort((l: string, r: string) => {
			return 'WUBRG'.indexOf(l) - 'WUBRG'.indexOf(r);
		})
		.join('');

	const contains = (str: string | undefined, search: string | string[]): boolean => {
		if (!str || !search) return false;
		if (Array.isArray(search))
			return search.some((s) => str.toLowerCase().includes(s.toLowerCase()));
		return str.toLowerCase().includes(search.toLowerCase());
	};

	return contains(face.type_line, ['Artifact', 'Artefact', 'Artéfact'])
		? 'Artifact'
		: sorted_colors.length === 0
		? 'Colourless'
		: sorted_colors.length > 2
		? 'Gold'
		: sorted_colors;
};

// Re-create type specifics with proper dependencies
const typeSpecifics = useCardTypeSpecifics(
	card_face,
	is_planeswalker,
	is_levelup,
	colors,
	frame_colors,
	parse_oracle
);

// Override with the new values
const planeswalker_abilities_final = typeSpecifics.planeswalker_abilities;
const saga_reminder_final = typeSpecifics.saga_reminder;
const saga_steps_final = typeSpecifics.saga_steps;
const class_reminder_final = typeSpecifics.class_reminder;
const class_steps_final = typeSpecifics.class_steps;
const levels_final = typeSpecifics.levels;

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
	compute_colors_func
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

<style>
@import '../card.css';
</style>

<style type="text/css">
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
