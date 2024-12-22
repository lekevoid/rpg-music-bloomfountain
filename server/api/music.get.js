export default defineEventHandler(async () => {
	const data = await useStorage("assets:music").getKeys();
	return data;
});
