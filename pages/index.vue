<template>
	<main id="global">
		<MusicListTabs :currentCategory="currentCategory" @set-category="(to) => setCategory(to)" />
		<SoundsTab v-if="currentCategory === 'sounds'" />
		<div class="playlist_border" v-else>
			<ClientOnly>
				<div class="inner">
					<div class="list">
						<template v-for="(tracks, subcategory) in sortedTracks" :key="subcategory">
							<section v-if="subcategory !== '' && subcategory !== 'null'">
								<div class="subcategory">
									<h3>{{ subcategory }}</h3>
									<MusicListTrack
										v-for="track in tracks"
										:track="track"
										:currentlyPlayingTracks="[track1Playing.filename, track2Playing.filename]"
										@play-track-1="(trackFilename) => playTrack1(trackFilename)"
										@play-track-2="(trackFilename) => playTrack2(trackFilename)"
										:key="track.filename"
									/>
								</div>
							</section>
						</template>
						<section v-if="sortedTracksTBD.length > 0">
							<div class="subcategory">
								<h3>TBD</h3>
								<MusicListTrack
									v-for="track in sortedTracksTBD"
									:track="track"
									:currentlyPlayingTracks="[track1Playing.filename, track2Playing.filename]"
									@play-track-1="(trackFilename) => playTrack1(trackFilename)"
									@play-track-2="(trackFilename) => playTrack2(trackFilename)"
									:key="track.filename"
								/>
							</div>
						</section>
					</div>
				</div>
			</ClientOnly>
		</div>
		<DoublePlayer :track1="track1Playing" :track2="track2Playing" />
	</main>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useDBStore } from "@/stores/db";
const { dbFetchTracks: allTracks } = storeToRefs(useDBStore());

function sortByPrefix(a, b) {
	if (a.prefix > b.prefix) {
		return 1;
	} else if (a.prefix < b.prefix) {
		return -1;
	}
	return 0;
}

function sortByTitle(a, b) {
	if (a.filename > b.filename) {
		return 1;
	} else if (a.filename < b.filename) {
		return -1;
	}
	return 0;
}

const sortedTracks = computed(() => {
	function sortBySubcategory(a, b) {
		// Make "General" surface
		if (a.subcategory !== "General" && b.subcategory === "General") {
			return 1;
		} else if (a.subcategory === "General" && b.subcategory !== "General") {
			return -1;
		}

		if (a.subcategory > b.subcategory) {
			return 1;
		} else if (a.subcategory < b.subcategory) {
			return -1;
		}

		return 0;
	}

	let out = {};
	const _sortedTracks =
		allTracks.value
			.filter((t) => t.category === currentCategory.value)
			.sort(sortByTitle)
			.sort(sortByPrefix)
			.sort(sortBySubcategory) || [];

	_sortedTracks.forEach((track) => {
		const { subcategory } = track;

		if (!out[subcategory]) {
			out[subcategory] = [];
		}

		out[subcategory].push({ ...track });
	});

	return out;
});

const sortedTracksTBD = computed(() => {
	let out = [];

	if (sortedTracks.value?.[""] && sortedTracks.value[""].length > 0) {
		out = [...out, ...sortedTracks.value[""]];
	}

	if (sortedTracks.value?.["null"] && sortedTracks.value["null"].length > 0) {
		out = [...out, ...sortedTracks.value["null"]];
	}

	return out.sort(sortByTitle);
});

const currentCategory = ref("Ambience");

const track1Playing = ref({ id: "", title: "", filepath: "" });
const track2Playing = ref({ id: "", title: "", filepath: "" });

function playTrack1(filename) {
	track1Playing.value = { title: filename, filepath: `/music/${filename}.mp3` };
}

function playTrack2(filename) {
	track2Playing.value = { title: filename, filepath: `/music/${filename}.mp3` };
}

function setCategory(to) {
	currentCategory.value = to;
}
</script>

<style lang="scss">
@import "~/assets/styles/view";
</style>
