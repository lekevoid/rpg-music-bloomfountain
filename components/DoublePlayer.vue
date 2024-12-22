<template>
	<div class="players_wrapper">
		<div class="player">
			<div class="track_title">{{ track1.title }}</div>
			<audio :src="track1.filepath" :autoplay="track1Volume === 0 ? false : 'autoplay'" controls="controls" loop="loop" ref="player1Ref" />
			<div class="volume" :style="{ width: track1Volume + '%' }"></div>
		</div>
		<UPopover class="players_tooltip z-10" :popper="{ placement: 'top' }">
			<UButton variant="outline" size="xs" :ui="{ rounded: 'rounded-full' }">i</UButton>
			<template #panel>
				<div class="p-4 text-center">
					<p><UBadge variant="outline">⬅️➡️</UBadge> Transfer some volume from player to player</p>
					<p><UBadge variant="outline">Ctrl + ⬅️➡️</UBadge> Play/Pause player</p>
					<p><UBadge variant="outline">Alt + ⬅️➡️</UBadge> Play player, mute other player</p>
				</div>
			</template>
		</UPopover>
		<div class="player">
			<div class="track_title">{{ track2.title }}</div>
			<audio :src="track2.filepath" :autoplay="track2Volume === 0 ? false : 'autoplay'" controls="controls" loop="loop" ref="player2Ref" />
			<div class="volume" :style="{ width: track2Volume + '%' }"></div>
		</div>
	</div>
</template>

<script setup>
const { track1, track2 } = defineProps(["track1", "track2"]);

function calculateBezier(num) {
	const t = num / 100;

	// Control points
	const P0 = { x: 0, y: 0 };
	const P1 = { x: 0.4, y: 0.8 };
	const P2 = { x: 0.8, y: 1 };

	// Calculate the point on the curve using the formula
	const Bx = (1 - t) * (1 - t) * P0.x + 2 * (1 - t) * t * P1.x + t * t * P2.x;
	const By = (1 - t) * (1 - t) * P0.y + 2 * (1 - t) * t * P1.y + t * t * P2.y;

	// Return the y-coordinate of the point
	return By * 100;
}

function adjustVolume(direction) {
	if (direction === "left") {
		track1VolumeBase.value = Math.min(track1VolumeBase.value + 2, 100);
		track2VolumeBase.value = Math.max(track2VolumeBase.value - 2, 0);

		if (track1VolumeBase.value > 0) {
			player1Ref.value.play();
		}

		if (track2VolumeBase.value === 0) {
			player2Ref.value.pause();
		}
	}

	if (direction === "right") {
		track1VolumeBase.value = Math.max(track1VolumeBase.value - 2, 0);
		track2VolumeBase.value = Math.min(track2VolumeBase.value + 2, 100);

		if (track1VolumeBase.value === 0) {
			player1Ref.value.pause();
		}

		if (track2VolumeBase.value > 0) {
			player2Ref.value.play();
		}
	}
}

function keyboardControls($evt) {
	if (["ArrowRight", "ArrowLeft"].includes($evt.key) || $evt.altKey || $evt.ctrlKey) {
		$evt.stopPropagation();
		$evt.preventDefault();
	}

	if ($evt.key === "ArrowLeft" && !$evt.ctrlKey) {
		adjustVolume("left");
	}

	if ($evt.key === "ArrowRight" && !$evt.ctrlKey) {
		adjustVolume("right");
	}

	if ($evt.key === "ArrowLeft" && $evt.altKey) {
		track1VolumeBase.value = 100;
		track2VolumeBase.value = 0;

		if (player1Ref?.value?.readyState > 0) {
			player1Ref.value.play();
		}

		if (player2Ref?.value?.readyState > 0) {
			player2Ref.value.pause();
		}
	}

	if ($evt.key === "ArrowRight" && $evt.altKey) {
		track1VolumeBase.value = 0;
		track2VolumeBase.value = 100;

		if (player2Ref?.value?.readyState > 0) {
			player2Ref.value.play();
		}

		if (player1Ref?.value?.readyState > 0) {
			player1Ref.value.pause();
		}
	}

	if ($evt.key === "ArrowLeft" && $evt.ctrlKey) {
		const player = player1Ref.value;

		if (!player) {
			return;
		}

		if (player.paused) {
			player.play();
		} else {
			player.pause();
		}
	}

	if ($evt.key === "ArrowRight" && $evt.ctrlKey) {
		const player = player2Ref.value;

		if (!player) {
			return;
		}

		if (player.paused) {
			player.play();
		} else {
			player.pause();
		}
	}
}

const track1VolumeBase = ref(-1);
const track2VolumeBase = ref(-1);

const track1Volume = computed(() => calculateBezier(track1VolumeBase.value));
const track2Volume = computed(() => calculateBezier(track2VolumeBase.value));

const player1Ref = ref(null);
const player2Ref = ref(null);

const player1Paused = ref(false);
const player2Paused = ref(false);

onMounted(() => {
	window.addEventListener("keydown", keyboardControls);
	track1VolumeBase.value = 100;
	track2VolumeBase.value = 0;

	player1Ref.value.addEventListener("play", () => {
		console.log("player 1 play");
		player1Paused.value = false;
	});
	player2Ref.value.addEventListener("play", () => {
		console.log("player 2 play");
		player2Paused.value = false;
	});
	player1Ref.value.addEventListener("pause", () => {
		console.log("player 1 pause");
		player1Paused.value = true;
	});
	player2Ref.value.addEventListener("pause", () => {
		console.log("player 2 pause");
		player2Paused.value = true;
	});
});

watch(
	[track1Volume, track2Volume],
	() => {
		if (player1Ref.value && player2Ref.value) {
			player1Ref.value.volume = track1Volume.value / 100;
			player2Ref.value.volume = track2Volume.value / 100;
		}
	},
	{ immediate: true }
);
</script>

<style lang="scss" scoped>
@import "../assets/styles/theme.scss";

.players_wrapper {
	bottom: 0;
	flex: 0 0 10%;
	left: 0;
	position: fixed;
	width: 100%;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	padding: 10px 10px;

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

.player {
	flex: 0 0 calc(50% - 15px);
	padding-bottom: 6px;

	&:first-of-type {
		.volume {
			right: 0;
			background: linear-gradient(to left, rgba(#fff, 0) 0%, rgba(#fff, 0.8) 99%, rgba(#fff, 0) 100%);
		}
	}

	&:last-of-type {
		.volume {
			left: 0;
			background: linear-gradient(to right, rgba(#fff, 0) 0%, rgba(#fff, 0.8) 99%, rgba(#fff, 0) 100%);
		}
	}
}

.track_title {
	font-size: 16px;
	font-weight: bold;
	letter-spacing: 3px;
	margin: 4px 0 0 14px;
	z-index: 10;
	height: 24px;
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

.volume {
	position: absolute;
	bottom: 0;

	height: 6px;
	background-color: #fff;

	transition: width 0.1s ease;
}

.players_tooltip {
	margin-top: 20px;

	button {
		width: 28px;
		justify-content: center;
	}

	p {
		line-height: 240%;
		font-size: 12px;
		& > .inline-flex {
			margin-right: 1ch;
		}
	}
}
</style>
