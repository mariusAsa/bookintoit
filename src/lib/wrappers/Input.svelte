<script lang="ts">
    let { file } = $props();
    let showDropZone = $state(true);
    let img: HTMLImageElement | undefined = $state(undefined);
    function handleFileChange(event: DragEvent | Event) {
        if (event instanceof DragEvent) {
            $file = event.dataTransfer?.files.item(0);
        } else if (event.target instanceof HTMLInputElement) {
            $file = event.target.files?.item(0);
        }
        if ($file) {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                img?.setAttribute("src", reader.result as string);
                showDropZone = false;
            });
            reader.readAsDataURL($file.item(0));
        }
    }
    let input: HTMLInputElement | undefined = $state(undefined)
</script>

<div class="w-1/3 m-auto mt-4">
    {#if showDropZone}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore event_directive_deprecated -->
        <div
            class="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 aspect-video items-center flex justify-center"
            on:dragover|preventDefault
            on:drop|preventDefault={handleFileChange}
            on:click={() => input?.click()}
        >
            Upload an image here
        </div>
    {/if}
    <!-- svelte-ignore event_directive_deprecated -->
    <input
            bind:this={input}
            bind:files={$file}
            on:change={handleFileChange}
            type="file"
            name="image"
            accept="image/jpeg"
            required
            hidden
    />
    <img bind:this={img} src="" alt="" class="rounded-lg"/>
</div>
