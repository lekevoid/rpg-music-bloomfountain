export default defineEventHandler(async () => {
	function capsAndSplit(str) {
		const words = str.split("_");
		const capitalizedString = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
		return capitalizedString;
	}

	const data = await useStorage("assets:images").getKeys();

	const out = data
		.map((image) => {
			if (image.match(/^category_/)) {
				const id = image.replace(/(.+)\..+/, "$1");
				const label = capsAndSplit(image.replace("category_", "").replace(/(.+)\..+/, "$1"));
				return { id, label, avatar: { src: `/img/${image}` } };
			}
		})
		.filter(Boolean);

	return out;
});
