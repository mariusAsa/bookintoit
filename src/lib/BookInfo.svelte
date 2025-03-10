<script lang="ts">
import Spinner from "./Spinner.svelte";
import type { Book, GoogleBookVolume } from "./types";

let {
	selectedBook = $bindable(undefined),
}: { selectedBook: Book | undefined } = $props();
async function searchBook(book: Book) {
	const f: Promise<{ items: GoogleBookVolume[] }> = fetch(
		`/api/book?title=${book.title}&author=${book.author}`,
	).then((res) => res.json());
	return f;
}
</script>
{#if selectedBook}
<div class="flex items-center gap-2 flex-col">
    <button onclick={() => selectedBook = undefined} class="hover:underline pb-2 rounded text-lg">
        &larr; {selectedBook.author}, {selectedBook.title}
    </button>
    {#await searchBook(selectedBook)}
        <Spinner />
    {:then booksInfo}
        {#each booksInfo.items as info}
            <a href={info.volumeInfo.previewLink} target="_blank" class="border rounded p-4 mb-4 w-full max-w-xl shadow-sm">
                <h3 class="text-xl font-bold">{info.volumeInfo.title}</h3>
                <p class="text-sm text-gray-600">by {info.volumeInfo.authors?.join(', ') || 'Unknown author'}</p>
                
                <div class="mt-3 grid grid-cols-2 gap-2 text-sm">
                    {#if info.volumeInfo.publishedDate}
                        <div><span class="font-semibold">Published:</span> {info.volumeInfo.publishedDate}</div>
                    {/if}
                    {#if info.volumeInfo.pageCount}
                        <div class="text-right"><span class="font-semibold">Pages:</span> {info.volumeInfo.pageCount}</div>
                    {/if}
                    {#if info.volumeInfo.publisher}
                        <div><span class="font-semibold">Publisher:</span> {info.volumeInfo.publisher}</div>
                    {/if}
                </div>
            </a>
        {/each}
        {#if booksInfo?.items?.length === undefined}
            <p class="text-uchu-blue">No books found</p>
        {/if}
    {:catch error}
        {error}
    {/await}
</div>
{/if}