<script lang="ts">
let { file, selectedBook, blur } = $props();
let showDropZone = $state(true);
let canvas: HTMLCanvasElement | undefined = $state(undefined);
let zoomCanvas: HTMLCanvasElement | undefined = $state(undefined);
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
				if (canvas && zoomCanvas) {
					if (img.width > img.height) {
						canvas.width = pixels;
						canvas.height = (pixels / img.width) * img.height;
					} else {
						canvas.height = pixels;
						canvas.width = (pixels / img.height) * img.width;
					}
					zoomCanvas.width = canvas.width;
					zoomCanvas.height = canvas.height;
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

function getCorner(middle: number, zoomedSpace: number, space: number): number {
	const halfZoom = Math.floor(zoomedSpace / 2);
	if (middle < halfZoom) return 0;
	if (space - middle < halfZoom) return space - zoomedSpace;
	return middle - halfZoom;
}

let zoom = $state(0);
$effect(() => {
	if (!selectedBook) zoom = 3;
});
$effect(() => {
	if (!zoomCanvas || !canvas) return;
	const zoomCtx = zoomCanvas.getContext("2d");
	if (!zoomCtx) return;
	zoomCtx.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);
	if (!selectedBook) return;

	const [ymin, xmin, ymax, xmax] = [
		selectedBook.box[0] / 1000,
		selectedBook.box[1] / 1000,
		selectedBook.box[2] / 1000,
		selectedBook.box[3] / 1000,
	];

	// Calculate the middle of the selected book
	const midX = Math.floor((zoomCanvas.width * (xmin + xmax)) / 2);
	const midY = Math.floor((zoomCanvas.height * (ymin + ymax)) / 2);
	const zoomedWidth = Math.floor(zoomCanvas.width / zoom);
	const zoomedHeight = Math.floor(zoomCanvas.height / zoom);

	// Calculate top-left corner of the zoomed area
	const topX = getCorner(midX, zoomedWidth, zoomCanvas.width);
	const topY = getCorner(midY, zoomedHeight, zoomCanvas.height);

	zoomCtx.drawImage(
		canvas,
		topX,
		topY,
		zoomedWidth,
		zoomedHeight,
		0,
		0,
		zoomCanvas.width,
		zoomCanvas.height,
	);
	zoomCtx.strokeStyle = "yellow";
	zoomCtx.lineWidth = 7.5;
	zoomCtx.strokeRect(
		(zoomCanvas.width * xmin - topX) * zoom,
		(zoomCanvas.height * ymin - topY) * zoom,
		zoomCanvas.width * (xmax - xmin) * zoom,
		zoomCanvas.height * (ymax - ymin) * zoom,
	);
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

	<div class="flex relative" 
		onwheel={(e) => {
			e.preventDefault();
			if (e.deltaY < 0 && selectedBook) {
				zoom = Math.min(zoom * 1.05, 10); // Zoom in, with a max limit
			} else if (selectedBook !== undefined) {
				zoom = Math.max(zoom / 1.05, 1); // Zoom out, with a min limit
			}
		}}
		ontouchstart={(e) => {
			if (e.touches.length !== 2) return;
			const dist = Math.hypot(
				e.touches[0].pageX - e.touches[1].pageX,
				e.touches[0].pageY - e.touches[1].pageY
			);
			e.currentTarget.dataset.pinchDistance = dist.toString();
		}}
		ontouchmove={(e) => {
			if (e.touches.length !== 2 || !selectedBook) return;
			e.preventDefault();
			
			const startDist = Number(e.currentTarget.dataset.pinchDistance || 0);
			const currentDist = Math.hypot(
				e.touches[0].pageX - e.touches[1].pageX,
				e.touches[0].pageY - e.touches[1].pageY
			);
			
			if (startDist > 0) {
				const scale = currentDist / startDist;
				if (scale > 1.02) {
					zoom = Math.min(zoom * 1.02, 10);
				} else if (scale < 0.98) {
					zoom = Math.max(zoom / 1.02, 1);
				}
				e.currentTarget.dataset.pinchDistance = currentDist.toString();
			}
		}}>
		<canvas bind:this={canvas} class="rounded-lg w-full" height=0 width=0></canvas>
		<canvas bind:this={zoomCanvas} class="rounded-lg absolute w-full" height=0 width=0></canvas>
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
