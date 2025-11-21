<template>
	<div class="header">
		<h1>MTGRender</h1>
		<div class="menu">
			<button @click="$emit('newCard')">New Card</button>
			<button @click="$emit('save')">
				Save<span class="shortcut">[Ctrl+S]</span>
			</button>
			<slot name="search"></slot>
			<button @click="$emit('render')" :disabled="rendering">Render to PNG</button>
		</div>
		<div>
			<div style="display: inline-flex; align-items: center; gap: 1em">
				<div>
					Contact:
					<a href="https://senryoku.github.io" target="_blank">Senryoku</a>
				</div>
				<a href="mailto:maretverdant@gmail.com" target="_blank" style="font-size: 1.6em">
					✉
				</a>
				<a href="https://github.com/Senryoku" target="_blank">
					<img
						style="width: 1.5em"
						src="../assets/img/GitHub-Mark-Light-32px.png"
						alt="GitHub"
					/>
				</a>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	rendering: boolean;
}>();

defineEmits<{
	newCard: [];
	save: [];
	render: [];
}>();
</script>
