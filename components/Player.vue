<template>
	<div class="player">
		<div class="track_title">{{ currentTrack.title }}</div>
		<audio :src="currentTrack.filepath" autoplay="autoplay" controls="controls" loop="loop" ref="playerRef" />
	</div>
</template>

<script setup>
const { currentTrack } = defineProps(["currentTrack"]);
</script>

<style lang="scss" scoped>
@import "../assets/styles/theme.scss";

.player {
	bottom: 0;
	flex: 0 0 10%;
	left: 0;
	position: fixed;
	width: 100%;
	padding: 10px;

	&:before {
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		background: linear-gradient(
			to right,
			rgba($audioPlayerGlow, 0) 0%,
			rgba($audioPlayerGlow, 0.6) 5%,
			rgba($audioPlayerGlow, 0.2) 50%,
			rgba($audioPlayerGlow, 0.6) 95%,
			rgba($audioPlayerGlow, 0) 100%
		);
		filter: blur(20px);
		z-index: 1;
	}
}

.track_title {
	font-size: 16px;
	font-weight: bold;
	letter-spacing: 3px;
	margin: 4px 0 0 14px;
	z-index: 10;
	position: relative;
}

audio {
	color: #fff;
	width: 100%;
	z-index: 10;
	position: relative;

	&::-webkit-media-controls-enclosure {
		background: transparent;
		border-radius: 0;
	}

	&::-webkit-media-controls-timeline {
		background-color: rgba($audioColor, 0.6);
		border-radius: 1000px;
		margin: 0 20px;
		opacity: 0.8;
	}

	&::-webkit-media-controls-volume-control-container {
		background-color: $audioColor;
		border-radius: 1000px;
		opacity: 0.8;
	}

	&::-webkit-media-controls-play-button {
		background-color: $audioColor;
		border-radius: 1000px;
		margin-right: 20px;
		opacity: 0.8;
	}

	&::-webkit-media-controls-current-time-display {
		color: #fff;
	}

	&::-webkit-media-controls-time-remaining-display {
		color: #aaa;
	}

	&::-webkit-media-controls-seek-back-button,
	&::-webkit-media-controls-seek-forward-button {
		background-color: #fff;
	}
}
</style>
