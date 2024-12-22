<template>
	<Body class="admin">
		<div class="px-20 pt-10 pb-80">
			<div v-if="isDev">
				<div class="search_bar flex py-5">
					<UInput v-model="filterFilename" placeholder="Search titles, filenames" class="search_element mr-4" />
					<USelectMenu
						v-model="filterCategory"
						placeholder="Search category"
						:options="[{ label: 'None' }, ...optionsCategories]"
						class="search_element mr-4"
					/>
					<UInput v-model="filterSubcategory" placeholder="Search sub-categories" class="search_element mr-4" />
					<UButton @click="resetFilters" variant="outline">
						<UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
					</UButton>
				</div>
				<UTable :columns="columns" :rows="filteredTracks">
					<template #id-data="{ row }">
						<button class="hover_red_glow" v-if="currentlyPlaying.title === row.filename" @click="playTrack('')">
							<UIcon name="i-heroicons-stop" class="w-5 h-5" />
						</button>
						<button class="hover_green_glow" v-else @click="playTrack(row.filename)">
							<UIcon name="i-heroicons-play" class="w-5 h-5" />
						</button>
					</template>
					<template #filename-data="{ row }">
						<button @click="playTrack(row.filename)">
							{{ row.filename }}
						</button>
					</template>
					<template #category-data="{ row }">
						<USelectMenu
							:disabled="!row.id"
							v-model="row.category"
							:options="optionsCategories"
							@update:model-value="updateTrackField(row.id, 'category', row.category.label)"
						/>
					</template>
					<template #subcategory-data="{ row }">
						<UInputMenu
							:disabled="!row.id"
							trailing-icon="i-heroicons-chevron-up-down-20-solid"
							v-model="row.subcategory"
							v-model:query="row.subcategory"
							:options="optionsSubcategories"
							@change="updateTrackField(row.id, 'subcategory', row.subcategory)"
							@blur="updateTrackField(row.id, 'subcategory', row.subcategory)"
							@keyup.enter="onPressEnter(false, row.id, 'subcategory', row.subcategory)"
							:nullable="true"
						>
							<template #leading>
								<UIcon name="clear_btn i-heroicons-x-mark" class="w-5 h-5" @click="updateTrackField(row.id, 'subcategory', '')" />
							</template>
							<template #option="{ option: track }">
								<span class="truncate">{{ track }}</span>
							</template>
						</UInputMenu>
					</template>
					<template #prefix-data="{ row }">
						<UInput :disabled="!row.id" v-model="row.prefix" @change="updateTrackField(row.id, 'prefix', row.prefix)" />
					</template>
					<template #tags-data="{ row }">
						<div class="flex">
							<div>
								<USelectMenu
									class="tags_select mr-4"
									:disabled="!row.id"
									v-model="row.tags"
									:options="optionsTags"
									multiple
									@update:model-value="updateTrackField(row.id, 'tags', row.tags)"
								/>
							</div>
							<div class="tags_chips flex items-center gap-1" v-if="row.tags.length > 0">
								<UTooltip v-for="tag of row.tags" :text="tag.label">
									<img class="tag_img" :src="tag.avatar.src" />
								</UTooltip>
							</div>
						</div>
					</template>
					<template #hasFile-data="{ row }">
						<span v-if="row.hasFile" class="cursor-default">✅</span>
						<button v-else class="hover_red_glow text-red-500">
							<UIcon name="i-heroicons-trash" class="w-5 h-5" @click="deleteTrackRecord(row.id)" />
						</button>
					</template>
					<template #hasDBEntry-data="{ row }">
						<span v-if="row.hasDBEntry" class="cursor-default">✅</span>
						<button v-else class="hover_green_glow text-green-500">
							<UIcon name="i-heroicons-circle-stack " class="w-5 h-5" @click="newTrack(row)" />
						</button>
					</template>
				</UTable>
			</div>
			<div v-else class="full-screen">
				<p>It is not advised to make changes to files here.</p>
				<p>Please <NuxtLink to="/">be safe.</NuxtLink></p>
			</div>
		</div>
		<Player v-if="currentlyPlaying.title" :currentTrack="currentlyPlaying" />
	</Body>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useDBStore } from "@/stores/db";
const { insertDBRow, updateDBRow, updateDBCell, deleteDBRow } = useDBStore();
const { dbFetchTracks } = storeToRefs(useDBStore());

const { data: musicFiles } = await useFetch("/api/music");
const { data: optionsCategories } = await useFetch("/api/categories");
const { data: optionsTags } = await useFetch("/api/tags");

const { $chronicle } = useNuxtApp();
const chronicle = $chronicle.id;

const allTracks = ref([]);

const { ENVIRONMENT } = useRuntimeConfig().public;
const isDev = ENVIRONMENT === "development" ? true : false;

const initOptionsSubcategories = ref([]);
const filterFilename = ref("");
const filterCategory = ref("");
const filterSubcategory = ref("");
const currentlyPlaying = ref("");

const optionsSubcategories = computed(() => {
	const out = allTracks.value.map(({ subcategory }) => subcategory).filter(Boolean);
	return [...new Set(out), ""];
});

const filteredTracks = computed(() => {
	let out = [...allTracks.value];

	if (filterFilename.value) {
		const filenameRegex = new RegExp("(" + filterFilename.value.split(" ").filter(Boolean).join("|") + ")", "i");
		out = out.filter((track) => track.filename.match(filenameRegex));
	}

	if (filterCategory.value && filterCategory.value.label !== "None") {
		out = out.filter((track) => track.category === filterCategory.value.label);
	}

	if (filterSubcategory.value) {
		const subcategoryRegex = new RegExp(filterSubcategory.value, "i");
		out = out.filter((track) => track?.subcategory?.match(subcategoryRegex));
	}

	return out;
});

function populateOptionsFromExistingTracks() {
	for (const key in allTracks.value) {
		const track = allTracks.value[key];

		if (track.subcategory && !initOptionsSubcategories.value.includes(track.subcategory)) {
			initOptionsSubcategories.value.push(track.subcategory);
		}

		if (track.hasFile && !track.hasDBEntry) {
			allTracks.value[key].class = "needs_db_entry";
		} else if (!track.hasFile && track.hasDBEntry) {
			allTracks.value[key].class = "needs_file";
		} else {
			allTracks.value[key].class = "";
		}
	}
}

async function newTrack(track) {
	const data = await insertDBRow(track);

	if (data) {
		const insertedTrack = data[0];
		const trackToAmendIndex = allTracks.value.findIndex((t) => t.filename === insertedTrack.filename);
		allTracks.value[trackToAmendIndex].id = insertedTrack.id;
		allTracks.value[trackToAmendIndex].hasDBEntry = true;
		populateOptionsFromExistingTracks();
	}
}

async function updateTrack(track) {
	const data = await updateDBRow(track);

	if (data) {
		const updatedTrack = data[0];
		const trackToAmendIndex = allTracks.value.findIndex((t) => t.filename === updatedTrack.filename);
		allTracks.value[trackToAmendIndex].hasDBEntry = true;
		populateOptionsFromExistingTracks();
	}
}

async function updateTrackField(id, field, value) {
	if (field === "tags") {
		value = value
			.map((v) => {
				if (typeof v === "string") return v;
				if (typeof v?.label) return v.label;
				return null;
			})
			.filter(Boolean);
	}

	const data = await updateDBCell(id, field, value);

	if (data) {
		const trackToAmendIndex = allTracks.value.findIndex((t) => t.id === id);
		if (field !== "tags") {
			allTracks.value[trackToAmendIndex][field] = value;
		}
		populateOptionsFromExistingTracks();
	}
}

async function deleteTrackRecord(id) {
	console.log(id);
	const isDeleted = await deleteDBRow(id);

	if (isDeleted) {
		allTracks.value = allTracks.value.filter((t) => t.id !== id);
	}
}

function onPressEnter(track, id, field, value) {
	if (track) {
		updateTrack(track);
	} else {
		updateTrackField(id, field, value);
	}
}

function resetFilters() {
	filterFilename.value = "";
	filterCategory.value = "";
	filterSubcategory.value = "";
}

const columns = [
	{
		key: "id",
		label: "",
	},
	{
		key: "filename",
		label: "File Name",
		sortable: true,
	},
	{
		key: "category",
		label: "Category",
		sortable: true,
	},
	{
		key: "subcategory",
		label: "Sub-Category",
		sortable: true,
	},
	{
		key: "prefix",
		label: "Prefix",
	},
	{
		key: "tags",
		label: "Tags",
	},
	{
		key: "hasFile",
		label: "File",
	},
	{
		key: "hasDBEntry",
		label: "In DB",
	},
];

console.log(allTracks.value);

watch(
	dbFetchTracks,
	() => {
		if (dbFetchTracks.value.length === 0) return;

		const defaultTrackProps = { id: "", chronicle, category: "", subcategory: "", prefix: "" };

		for (const track of musicFiles.value) {
			const filename = track.replace(".mp3", "");
			allTracks.value.push({ ...defaultTrackProps, tags: [], filename, hasFile: true });
		}

		for (const track of dbFetchTracks.value) {
			const trackToAmendIndex = allTracks.value.findIndex((t) => t.filename === track.filename);

			if (trackToAmendIndex >= 0) {
				allTracks.value[trackToAmendIndex].hasDBEntry = true;
			} else {
				allTracks.value.push({ ...defaultTrackProps, ...track, hasDBEntry: true, hasFile: false });
				continue;
			}

			for (const property in track) {
				if (property === "tags") {
					for (const tag of optionsTags.value) {
						if (track["tags"].includes(tag.label)) {
							allTracks.value[trackToAmendIndex]["tags"].push(tag);
						}
					}
				}

				if (!allTracks.value[trackToAmendIndex][property]) {
					allTracks.value[trackToAmendIndex][property] = track[property];
				}
			}
		}

		populateOptionsFromExistingTracks();
	},
	{ immediate: true }
);

function playTrack(filename) {
	currentlyPlaying.value = { title: filename, filepath: `/music/${filename}.mp3` };
}

definePageMeta({
	layout: "admin",
});
</script>

<style lang="scss">
.admin #__nuxt {
	position: relative;
	height: auto;
}

#player {
	position: fixed;
	top: 0;
	left: 0;
	width: 0px;
	height: 0px;
	pointer-events: none;
	overflow: hidden;
}

.search_bar {
}

.search_element {
	flex: 1 1 100%;
}

div:has(> table.table-fixed) {
	min-height: 80vh;
}

table tr {
	transition: box-shadow 0.3s ease;
}

.needs_db_entry {
	box-shadow: 0px 0px 30px inset #330;

	&:hover {
		box-shadow: 0px 0px 40px inset #550;
	}
}

.needs_file {
	box-shadow: 0px 0px 30px inset #500;

	&:hover {
		box-shadow: 0px 0px 40px inset #800;
	}
}

.absolute:has(> .clear_btn) {
	pointer-events: all;
	z-index: 10;
	cursor: pointer;

	&:hover {
		color: FFF;
	}
}

.tags_select {
	width: 60px;

	& > .group {
		width: 300px;
		max-width: 40vw;
	}
}

.tags_chips {
}

.tag_img {
	width: 24px;
	height: 24px;
	object-fit: contain;
}

.create_btn {
	transition: background-color 0.3s ease, filter 0.3s ease;

	&:hover {
		background-color: #fff;
	}
}

.hover_red_glow {
	transition: filter 0.3s ease;

	&:hover {
		filter: drop-shadow(0px 0px 4px #f00) drop-shadow(0px 0px 6px #f00) drop-shadow(0px 0px 8px #f00);
	}

	&[class*="heroicons"] {
		background-color: #fff;
	}
}

.hover_green_glow {
	transition: filter 0.3s ease;

	&:hover {
		filter: drop-shadow(0px 0px 4px #0f0) drop-shadow(0px 0px 6px #0f0) drop-shadow(0px 0px 8px #0f0);

		&[class*="heroicons"] {
			background-color: #fff;
		}
	}
}

.clear_btn {
}

.full-screen {
	height: calc(100vh - 430px);
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	justify-content: center;
	font-size: 30px;

	a {
		color: #04a;
		font-weight: bold;
	}
}
</style>
