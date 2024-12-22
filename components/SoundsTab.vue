<template>
	<div class="playlist_border">
		<ClientOnly>
			<div class="inner">
				<div class="list">
					<section class="subcategory">
						<h3>Humans</h3>
						<SoundTrack file="man_scream" label="Man Scream, Terrified" @playSound="(f) => playSound(f)" />
						<SoundTrack file="woman_scream_terrified" label="Woman Scream, Terrified" @playSound="(f) => playSound(f)" />
						<SoundTrack file="boy_nervous_laugh_01" label="Young Boy, Nervous & Creepy Laugh 01" @playSound="(f) => playSound(f)" />
						<SoundTrack file="boy_nervous_laugh_02" label="Young Boy, Nervous & Creepy Laugh 02" @playSound="(f) => playSound(f)" />
						<SoundTrack file="boy_nervous_laugh_03" label="Young Boy, Nervous & Creepy Laugh 03" @playSound="(f) => playSound(f)" />
						<SoundTrack file="girl_creepy_laugh_echo_01" label="Young Girl, Creepy Laugh, Echo 01" @playSound="(f) => playSound(f)" />
						<SoundTrack file="girl_creepy_laugh_echo_02" label="Young Girl, Creepy Laugh, Echo 02" @playSound="(f) => playSound(f)" />
						<SoundTrack file="girl_creepy_laugh_echo_03" label="Young Girl, Creepy Laugh, Echo 03" @playSound="(f) => playSound(f)" />
						<SoundTrack file="girl_creepy_laugh_echo_04" label="Young Girl, Creepy Laugh, Echo 04" @playSound="(f) => playSound(f)" />
					</section>
					<section class="subcategory">
						<h3>Monsters</h3>
						<SoundTrack file="demon_chuckle" label="Demon Chuckle" @playSound="(f) => playSound(f)" />
						<SoundTrack file="gene_screech" label="Gene Screech" @playSound="(f) => playSound(f)" />
						<SoundTrack file="ghostly_whispers" label="Ghostly Whispers" @playSound="(f) => playSound(f)" />
					</section>
					<section class="subcategory">
						<h3>Environment</h3>
						<SoundTrack file="door_slamming_01" label="Door Slamming 01" @playSound="(f) => playSound(f)" />
						<SoundTrack file="door_slamming_02" label="Door Slamming 02" @playSound="(f) => playSound(f)" />
						<SoundTrack file="chain_rattling" label="Chains Rattling" @playSound="(f) => playSound(f)" />
						<SoundTrack file="metal_screech" label="Metal Screech" @playSound="(f) => playSound(f)" />
					</section>
					<section class="subcategory">
						<h3>Technology</h3>
						<SoundTrack file="vibrating_phone" label="Vibrating Phone" @playSound="(f) => playSound(f)" />
					</section>
					<section class="subcategory">
						<h3>Explosions</h3>
						<SoundTrack file="small_explosion" label="Small Explosion" @playSound="(f) => playSound(f)" />
						<SoundTrack file="big_explosion" label="Big Explosion" @playSound="(f) => playSound(f)" />
					</section>
					<section class="subcategory">
						<h3>Weapons</h3>
						<SoundTrack file="knife_sharpen" label="Knife Sharpening" @playSound="(f) => playSound(f)" />
						<SoundTrack file="sword_unsheath" label="Sword Unsheathing" @playSound="(f) => playSound(f)" />
						<SoundTrack file="sword_slash" label="Sword Slashing" @playSound="(f) => playSound(f)" />
						<SoundTrack file="gunshot" label="Gunshot" @playSound="(f) => playSound(f)" />
					</section>
					<section class="subcategory">
						<h3>One-time use</h3>
						<SoundTrack file="demon_insane_laughter" label="Demon Insane Laughter" @playSound="(f) => playSound(f)" />
					</section>
					<section class="subcategory">
						<h3>Special</h3>
						<SoundTrack file="empty" label="Stop Sound" @playSound="(f) => playSound(f)" />
					</section>
				</div>
			</div>
		</ClientOnly>
		<audio class="audio_hide" :src="playingSound" autoplay="autoplay" />
	</div>
</template>

<script setup>
const playingSound = ref("");

function playSound(filename) {
	playingSound.value = "";
	setTimeout(() => (playingSound.value = `/sounds/${filename}.mp3`), 10);
}
</script>

<style lang="scss" scoped>
.audio_hide {
	height: 0;
	width: 0;
	overflow: hidden;
	position: absolute;
	opacity: 0;
}
</style>
