<template>
	<UContainer class="max-w-80">
		<div class="h-screen flex flex-col justify-center">
			<UForm :state="state" class="flex flex-col items-start justify-center gap-4" @submit="onSubmit">
				<UInput type="email" v-model="state.email" placeholder="Email" class="w-full" />
				<UInput type="password" v-model="state.password" placeholder="Password" class="w-full" />
				<UButton type="submit">Submit</UButton>
			</UForm>
		</div>
	</UContainer>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";

const supabase = useSupabaseClient();

const state = reactive({
	email: "gagnon.kev@gmail.com",
	password: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
	const { email, password } = event.data;
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (data?.user?.aud === "authenticated") {
		await navigateTo("/");
	}
}
</script>
