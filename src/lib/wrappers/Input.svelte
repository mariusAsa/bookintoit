<script lang="ts">
    let { file, selectedBook, blur } = $props();
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

    let div: HTMLDivElement | undefined = $state(undefined);
    $effect(() => {
        if (!selectedBook || !selectedBook.box || !img || !div) return;
        const [x1, y1, x2, y2] = [
            selectedBook.box[0] / 1000 * img.width, 
            selectedBook.box[1] / 1000 * img.height, 
            selectedBook.box[2] / 1000 * img.width, 
            selectedBook.box[3] / 1000 * img.height
        ];
        Object.assign(div.style, {
            right: `${x1}px`,
            width: `${x2 - x1}px`,
            top: `${y1}px`,
            height: `${y2 - y1}px`,
        });
    })
</script>

<div class="w-1/2 max-w-[400px] m-auto mt-4" class:blur={blur}>
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
            Upload an image of a bookshelf here
        </div>
    {/if}

    <div class="flex relative">
        <img bind:this={img} src="" alt="" class="rounded-lg"/>
        <div bind:this={div} class="absolute border border-green-400 z-10"></div>
    </div>
</div>
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
