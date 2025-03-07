<script lang="ts">
let dialog: HTMLDialogElement | null = $state(null);
export function open() {
	dialog?.showModal();
}
export function close() {
	dialog?.close();
}
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore slot_element_deprecated -->
<dialog bind:this={dialog} onclick={(e) => {if (e.target == dialog) {
        dialog?.close()
    }}} class="backdrop:bg-black/30 w-5/6 h-fit"
>
    <slot />
</dialog>