<script lang="ts">
let { file, selectedBook, blur } = $props();
let showDropZone = $state(true);
let canvas: HTMLCanvasElement | undefined = $state(undefined);
let shapeCanvas: HTMLCanvasElement | undefined = $state(undefined);
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
				const pixels = 768 * 4;
				if (canvas && shapeCanvas) {
					if (img.width > img.height) {
						canvas.width = pixels;
						canvas.height = (pixels / img.width) * img.height;
					} else {
						canvas.height = pixels;
						canvas.width = (pixels / img.height) * img.width;
					}
					shapeCanvas.width = canvas.width;
					shapeCanvas.height = canvas.height;
					canvas
						.getContext("2d")
						?.drawImage(img, 0, 0, canvas.width, canvas.height);
					canvas.toBlob(
						(blob) => {
							if (blob) {
								$file = new File([blob], "image.jpg");
							}
						},
						"image/jpeg",
						0.975,
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

$effect(() => {
	if (!selectedBook || !selectedBook.box || !shapeCanvas) return;
	const [ymin, xmin, ymax, xmax] = [
		selectedBook.box[0] / 1000,
		selectedBook.box[1] / 1000,
		selectedBook.box[2] / 1000,
		selectedBook.box[3] / 1000,
	];
	const ctx = shapeCanvas.getContext("2d");
	ctx?.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height);
	if (ctx) {
		ctx.strokeStyle = "yellow";
		ctx.lineWidth = 7.5;
		ctx.strokeRect(
			shapeCanvas.width * xmin,
			shapeCanvas.height * ymin,
			shapeCanvas.width * (xmax - xmin),
			shapeCanvas.height * (ymax - ymin),
		);
	}
});
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
            Upload an image of a bookshelf
        </div>
    {/if}

    <div class="flex relative">
        <canvas bind:this={canvas} class="rounded-lg w-full" height=0 width=0></canvas>
		<canvas bind:this={shapeCanvas} class="rounded-lg absolute w-full" height=0 width=0></canvas>
    </div>
</div>
<input
            bind:this={input}
            bind:files={$file}
            onchange={e => handleFileChange(e)}
            type="file"
            name="image"
            accept="image/*"
            required
            hidden
    />
