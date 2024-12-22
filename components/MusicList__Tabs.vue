<template>
	<div class="tabs">
		<div
			v-for="category in categories"
			:key="category"
			:class="['tab', category.label.toLowerCase(), { active: currentCategory === category.label }]"
			@click="$emit('setCategory', category.label)"
		>
			<img :src="category.avatar.src" class="w-5" />
			<div class="label">{{ category.label }}</div>
		</div>

		<div :class="['tab sounds', { active: currentCategory === 'sounds' }]" @click="$emit('setCategory', 'sounds')">
			<img src="/public/img/icon_sounds.png" height="50" width="50" />
			<div class="label">Sounds</div>
		</div>

		<NuxtLink to="admin" target="_blank" :class="['tab admin', { active: currentCategory === 'admin' }]" v-if="true === true">
			<img src="/public/img/icon_admin.png" height="50" width="50" />
			<div class="label">Admin</div>
		</NuxtLink>
	</div>
</template>

<script setup>
const { currentCategory } = defineProps(["currentCategory"]);
const { data: categories } = await useFetch("/api/categories");
</script>

<style lang="scss" scoped>
.tabs {
	display: flex;
	flex: 0 0 10%;
	max-height: 100px;
	padding: 0 2px;
	width: 100%;
}

.tab {
	border: 2px solid transparent;
	border-color: transparent transparent rgba(#fff, 0.8);
	border-radius: 10px 10px 0 0;
	border-width: 2px 0;
	cursor: pointer;
	display: block;
	flex: 1 1 0;
	padding: 20px 22px;
	position: relative;
	text-align: center;
	top: 2px;
	user-select: none;
	width: 0;

	&:first-child {
		left: -2px;
		margin-right: -2px;
	}

	&:last-child {
		margin-left: -2px;
		right: -2px;
	}

	img {
		display: inline-block;
		filter: drop-shadow(0 0 12px rgba(#fff, 0));
		height: auto;
		max-height: 100%;
		object-fit: contain;
		transition: filter 0.3s;
		width: auto;
	}

	.label {
		bottom: 0;
		font-weight: bold;
		left: 50%;
		letter-spacing: 3px;
		opacity: 0;
		position: absolute;
		text-shadow: 0px 0px 16px #fff, 0px 0px 12px #fff, 0px 0px 8px #fff;
		text-transform: capitalize;
		transform: translate(-50%, 50%) scale(0);
		transition: opacity 0.3s, transform 0.3s;
	}

	&.active {
		border: 2px solid rgba(#fff, 0.8);
		border-bottom-color: transparent !important;
		cursor: default;
		padding: 20px;
		transition: border-color 0.6s;
		user-select: none;

		img {
			animation: boop 0.3s ease-in-out 0s 1 normal forwards running;
			filter: drop-shadow(0 0 12px rgba(#fff, 1));
		}

		.label {
			opacity: 1;
			transform: translate(-50%, 50%) scale(1);
			transition-delay: 0.15s;
			transition-duration: 0.15s;
		}
	}
}
</style>
