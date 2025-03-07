<script lang="ts">
let { file, selectedBook, blur } = $props();
let showDropZone = $state(true);
let canvas: HTMLCanvasElement | undefined = $state(undefined);
function handleFileChange(event: DragEvent | Event) {
	if (event instanceof DragEvent) {
		$file = event.dataTransfer?.files.item(0);
	} else if (event.target instanceof HTMLInputElement) {
		$file = event.target.files?.item(0);
	}
	if ($file) {
		const reader = new FileReader();
		reader.addEventListener("load", () => {
			let img = new Image();
			img.addEventListener("load", () => {
				if (canvas) {
					if (img.width > img.height) {
						canvas.width = 768 * 4;
						canvas.height = ((768 * 4) / img.width) * img.height;
					} else {
						canvas.height = 768 * 4;
						canvas.width = ((768 * 4) / img.height) * img.width;
					}
					canvas
						.getContext("2d")
						?.drawImage(img, 0, 0, canvas.width, canvas.height);
					canvas.toBlob(
						(blob) => {
							if (blob) {
								$file = new File([blob], "image.jpg");
								console.log($file[0].size / 1024 / 1024);
							}
						},
						"image/jpeg",
						0.95,
					);
				}
			});
			img.setAttribute("src", reader.result as string);
			showDropZone = false;
		});
		reader.readAsDataURL($file.item(0));
	}
}
let input: HTMLInputElement | undefined = $state(undefined);
</script>

<div class="w-4/5 max-w-[400px] m-auto mt-4" class:blur={blur}>
    {#if showDropZone}
        <div
            class="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 aspect-video items-center flex justify-center"
            role="button"
            tabindex="0"
            ondragover={e => e.preventDefault()}
            ondrop={e => { e.preventDefault(); handleFileChange(e); }}
            onclick={() => input?.click()}
            onkeydown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input?.click(); } }}
        >
            Upload an image of a bookshelf here
        </div>
    {/if}

    <div class="flex relative">
        <canvas bind:this={canvas} class="rounded-lg w-full" height=0 width=0></canvas>
    </div>
</div>
<input
            bind:this={input}
            bind:files={$file}
            onchange={e => handleFileChange(e)}
            type="file"
            name="image"
            accept="image/jpeg"
            required
            hidden
    />
