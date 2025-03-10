<script lang="ts">
let {
	disabled = false,
	type = "button",
}: { disabled: boolean; type: "button" | "submit" | "reset" } = $props();
</script>
<!-- svelte-ignore event_directive_deprecated, slot_element_deprecated -->
<button {type} class="rounded-sm border border-uchu-dark-gray py-1 px-2 hover:bg-uchu-gray disabled:hidden" {disabled} on:click>
    <slot />
</button>