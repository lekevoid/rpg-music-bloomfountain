<template>
	<div :class="['track']">
		<div class="ctas">
			<div class="play_btn" @click="$emit('playSound', file)"></div>
		</div>
		<div class="bg">
			<div class="normal"></div>
			<div class="hover"></div>
			<div class="active"></div>
		</div>
		<span class="label">{{ label }}</span>
	</div>
</template>

<script setup>
const { file, label } = defineProps(["file", "label"]);
</script>

<style lang="scss" scoped>
@mixin bg {
	height: 100%;
	left: 0;
	position: absolute;
	top: 0;
	width: 100%;
	z-index: 1;
}

.track {
	align-items: center;
	border: 1px solid rgba(#fff, 0.4);
	border-radius: 6px;
	cursor: pointer;
	display: flex;
	font-size: 11px;
	min-height: 40px;
	margin-bottom: 0.4em;
	padding: 0.6em;
	overflow: hidden;
	transition: background 0.3s;
	user-select: none;

	.prefix {
		line-height: 1.2em;
		font-size: 12px;
		z-index: 10;
		white-space: nowrap;
		font-weight: bold;
		flex: 1 1 auto;
	}

	.label {
		flex: 1 1 100%;
		z-index: 10;
	}

	.tags {
		z-index: 1000;
		pointer-events: none;
		display: flex;
		flex: 0 1 120px;
		padding-right: 4px;
		gap: 4px;
		flex-flow: row nowrap;
		justify-content: flex-end;
	}

	.tag {
		width: 30px;
		height: 24px;
		object-fit: contain;
		pointer-events: all;
	}

	.bg {
		@include bg;
		border-radius: 4px;
		overflow: hidden;

		.normal {
			@include bg;
			background: linear-gradient(
				to bottom right,
				var(--track-button-gradient-color-dark) 0%,
				var(--track-button-gradient-color-light) 50%,
				var(--track-button-gradient-color-dark) 100%
			);
			opacity: 1;
			transition: opacity 0.3s;
		}

		.hover {
			@include bg;
			background: linear-gradient(
				to bottom right,
				var(--track-button-gradient-hover-color-dark) 0%,
				var(--track-button-gradient-hover-color-light) 50%,
				var(--track-button-gradient-hover-color-dark) 100%
			);
			opacity: 0;
			transition: opacity 0.3s;
		}

		.active {
			@include bg;
			background: linear-gradient(
				to bottom right,
				var(--track-button-gradient-active-color-dark) 0%,
				var(--track-button-gradient-active-color-light) 50%,
				var(--track-button-gradient-active-color-dark) 100%
			);
			opacity: 0;
			transition: opacity 0.3s;
		}
	}
}

.ctas {
	@include bg;
	z-index: 100;

	.play_btn {
		width: 100%;
		height: 100%;
		top: 0%;
		position: absolute;
		transition: opacity 0.3s ease;
		opacity: 0;
		background: linear-gradient(to right, rgba(#fff, 0.4) 0%, rgba(#fff, 0) 50%, rgba(#fff, 0.4) 100%);

		&:hover {
			opacity: 1;
		}
	}
}
</style>
