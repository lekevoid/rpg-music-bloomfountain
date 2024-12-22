export default defineNuxtRouteMiddleware((to, from) => {
	if (process.server) return;

	const supabase = useSupabaseClient();

	supabase.auth.onAuthStateChange((session) => {
		if (session?.user?.aud === "authenticated" && from.name === "login") {
			return navigateTo("/admin");
		}
	});
});
