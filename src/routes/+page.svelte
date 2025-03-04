<script lang="ts" module>
    export type Book = {
        author: string | null;
        title: string | null;
        box: Array<number> | null;
    };
</script>
<script lang="ts">
    import BookGrid from "$lib/book/BookGrid.svelte";
    import Spinner from "$lib/icons/Spinner.svelte";
    import { superForm } from "sveltekit-superforms";
    let { data } = $props();
    const { message, enhance, delayed } = superForm(data.form, {
        delayMs: 500,
        onUpdated({ form }) {
            if (form.message) books = $message;
        },
    });
    
    let img: HTMLImageElement;
    function handleFileChange(event: Event & { currentTarget: HTMLInputElement }) {
        if (event?.currentTarget?.files?.[0]) {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                img.setAttribute("src", reader.result as string);
            });
            reader.readAsDataURL(event?.currentTarget?.files?.[0]);
        }
    }
    
    const defaultBooks: Array<Book> = [];
    let books: Array<Book> = $state(defaultBooks);
    
    let div: HTMLDivElement;
    function displayBoundingBox(book: Book) {
        if (!book.box) return;
        const [x1, y1, x2, y2] = book.box.map((coord, i) => 
            coord * (i % 2 === 0 ? img.width : img.height) / 1000
        );
        Object.assign(div.style, {
            right: `${x1}px`,
            width: `${x2 - x1}px`,
            top: `${y1}px`,
            height: `${y2 - y1}px`,
        });
    }
</script>
    
<div class="h-full w-full relative justify-center flex">
    <form 
        method="POST" 
        use:enhance 
        enctype="multipart/form-data" 
        class="flex flex-col items-center gap-3 p-3 justify-center {$delayed ? "blur-sm" : ""}"
    >
        <div class="group">
            <label for="file">Image:</label>
            <input
            type="file"
            id="file"
            name="fileToUpload"
            accept=".jpg, .jpeg"
            required
            onchange={handleFileChange}
            />
        </div>
        <div class="w-1/4 min-w-72">
            <div class="flex relative">
                <img bind:this={img} src="" alt=""/>
                <div bind:this={div} class="absolute border border-green-400 z-10" style="top: -1000px;"></div>
            </div>
        </div>
        <button type="submit" class="rounded px-2 py-1 border bg-primary-100 hover:bg-primary-200" disabled={$delayed}>
            Send to Gemini
        </button>
    </form>
    {#if $delayed}
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Spinner />
        </div>
    {/if}
</div>

<BookGrid {books} {displayBoundingBox}/>