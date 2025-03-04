<script lang="ts">
    import Dialog from "$lib/wrappers/Dialog.svelte";
import BookInfo from "./BookInfo.svelte";

    let { selectedBook } = $props();
    let bookInfo = $state({
        title: undefined,
        author: undefined,
        date: undefined,
        pages: undefined,
        description: undefined,
        categories: undefined,
        language: undefined,
        link: undefined
    })
    async function fetchBook() {
        for (const key of Object.keys(bookInfo) as (keyof typeof bookInfo)[]) {
            bookInfo[key] = undefined;
        }
        if (!selectedBook.author || !selectedBook.title) return;

        const url = `/api/book?author=${selectedBook.author}&title=${selectedBook.title}`;
        // biome-ignore lint/suspicious/noExplicitAny:
        fetch(url).then((response) => {return response.json();}).then((data: any) => {
            const vol = data[0].volumeInfo;
            bookInfo = {
                title: vol.title, 
                author: vol.authors?.join(", "), 
                date: vol.publishedDate, 
                pages: vol.pageCount, 
                description: vol.description,
                categories: vol.categories?.join(", "),
                language: vol.language,
                link: vol.previewLink
            }
        });
    }

    let dialog: Dialog;
</script>

<Dialog bind:this={dialog}>
    <div class="p-1 bg-primary-100 flex flex-col w-full h-full items-center text-center border-4 border-primary-400 border-l-primary-200 border-b-primary-200 border-r-primary-400 justify-center gap-2">
        {selectedBook.author}, {selectedBook.title} info from google:
        <div class="grid grid-cols-2 py-12 w-full px-12">
            {#each Object.entries(bookInfo) as [key, value]}
                <BookInfo subject={key.charAt(0).toUpperCase() + key.slice(1)}>{value}</BookInfo>
            {/each}
        </div>
    </div>
    <button class="absolute top-2 left-2 hover:bg-primary-200 px-1.5" onclick={()=>dialog.close()}>x</button>
</Dialog>