<template>
	<div>
		<header>
			<nav>
				<NuxtLink class="nav_link" to="/">
					<img src="/img/icon_music.png" />
				</NuxtLink>
			</nav>
		</header>
		<NuxtPage />
	</div>
</template>

<script setup></script>

<style lang="scss">
@import "~/assets/styles/base";
@import "~/assets/styles/theme";

header {
	width: 100%;
	padding: 20px 5rem 0;
}

.nav_link {
	transition: filter 0.3s ease;

	&,
	img {
		max-width: 50px;
		max-height: 50px;
		display: inline-block;
	}

	&:hover {
		filter: drop-shadow(0px 0px 2px #fff) drop-shadow(0px 0px 10px #fff);
	}
}
</style>
