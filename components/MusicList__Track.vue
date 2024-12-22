<template>
	<div :class="['track', { active: currentlyPlayingTracks.includes(track.filename) }]">
		<div class="ctas">
			<div class="play_btn play_1" @click="$emit('playTrack1', track.filename)"></div>
			<div class="play_btn play_2" @click="$emit('playTrack2', track.filename)"></div>
		</div>
		<div class="bg">
			<div class="normal"></div>
			<div class="hover"></div>
			<div class="active"></div>
		</div>
		<UBadge v-if="track.prefix" variant="subtle" color="blue" class="prefix mr-3">{{ track.prefix }}</UBadge>
		<span class="label">{{ track.filename }}</span>
		<span class="tags" v-if="track.tags.length > 0">
			<UTooltip v-for="tag of track.tags.sort()" :text="tag" :key="tag">
				<img :src="`/img/tag_${slugify(tag)}.png`" class="tag" />
			</UTooltip>
		</span>
	</div>
</template>

<script setup>
const { track, currentlyPlayingTracks } = defineProps(["track", "currentlyPlayingTracks"]);

function slugify(str) {
	return str.replace(/\s+/g, "_").toLowerCase();
}
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

	/* &:not(.active):hover {
		.bg {
			.normal,
			.active {
				opacity: 0;
			}

			.hover {
				opacity: 1;
			}
		}
	} */

	/* &.active {
		animation: trackBoop 0.3s ease-in-out 0s 1 normal forwards running;

		.tags {
			opacity: 0;
		}

		.bg {
			.normal,
			.hover {
				opacity: 0;
			}

			.active {
				opacity: 1;
			}
		}
	} */
}

.ctas {
	@include bg;
	z-index: 100;

	.play_btn {
		width: 50%;
		height: 100%;
		top: 0%;
		position: absolute;
		transition: opacity 0.3s ease;
		opacity: 0;

		&:hover {
			opacity: 1;
		}
	}

	.play_1 {
		background: linear-gradient(to right, rgba(#fff, 0) 0%, rgba(#fff, 0.4) 10%, rgba(#fff, 0) 100%);
		left: 0%;
	}

	.play_2 {
		background: linear-gradient(to left, rgba(#fff, 0) 0%, rgba(#fff, 0.4) 10%, rgba(#fff, 0) 100%);
		left: 50%;
	}
}
</style>
