export default defineNuxtPlugin(() => {
	return {
		provide: {
			chronicle: { id: "bloomfountain", name: "Bloomfountain" },
		},
	};
});
