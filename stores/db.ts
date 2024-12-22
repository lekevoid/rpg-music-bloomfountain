export const useDBStore = defineStore("db", () => {
	const { $chronicle } = useNuxtApp();
	const chronicle = $chronicle.id;

	const supabase = useSupabaseClient();

	const dbFetchTracks = ref([]);
	const sbUser = ref(null);

	async function insertDBRow(track) {
		const trackToInsert = {
			chronicle: track.chronicle || "",
			filename: track.filename || "",
			category: track.category || "",
			subcategory: track.subcategory || "",
			prefix: track.prefix || "",
			tags: track.tags || [],
		};

		const { data, error } = await supabase.from("music_tracks").insert(trackToInsert).select();

		if (error) {
			throw new Error(error);
		}

		return data;
	}

	async function updateDBRow(track) {
		const trackToUpdate = {
			chronicle: track.chronicle || "",
			filename: track.filename || "",
			category: track.category || "",
			subcategory: track.subcategory || "",
			prefix: track.prefix || "",
			tags: track.tags || [],
		};

		console.log(trackToUpdate);

		const { data, error } = await supabase.from("music_tracks").update(trackToUpdate).eq("id", track.id).select();

		if (error) {
			throw new Error(error);
		}

		return data;
	}

	async function updateDBCell(id, field, value) {
		const trackToUpdate = {
			[field]: value,
		};

		const { data, error } = await supabase.from("music_tracks").update(trackToUpdate).eq("id", id).select();

		if (error) {
			throw new Error(error);
		}

		return data;
	}

	async function deleteDBRow(id) {
		const { error } = await supabase.from("music_tracks").delete().eq("id", id);
		if (error) throw new Error(error);
		return true;
	}

	async function fetchTracks() {
		console.log("Fetching tracks");
		await useAsyncData("dbFetchTracks", async () => {
			const { data } = await supabase
				.from("music_tracks")
				.select("id, chronicle, filename, category, subcategory, prefix, tags")
				.eq("chronicle", chronicle);
			dbFetchTracks.value = data;
		});
	}

	async function fetchUser() {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		sbUser.value = user;
	}

	fetchTracks();
	fetchUser();

	return { sbUser, dbFetchTracks, insertDBRow, updateDBRow, updateDBCell, deleteDBRow };
});
