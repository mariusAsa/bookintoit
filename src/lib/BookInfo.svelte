<script lang="ts">
import Spinner from "./Spinner.svelte";
import type { ApiResponse, Book } from "./types";

let {
	selectedBook = $bindable(undefined),
}: { selectedBook: Book | undefined } = $props();
async function searchBook(book: Book) {
	const f: Promise<ApiResponse> = fetch(
		`/api/book?title=${book.title}&author=${book.author}`,
		{
			method: "GET",
			headers: {
				"content-type": "application/json",
			},
		},
	).then((res) => res.json());
	return f;
}
</script>
{#if selectedBook}
<div class="flex items-center gap-2 flex-col">
    <button onclick={() => selectedBook = undefined} class="hover:bg-uchu-gray rounded text-lg border border-uchu-gray shadow-sm py-0.5 px-3 mb-3">
        &larr; {selectedBook.author}, {selectedBook.title}
    </button>
    {#await searchBook(selectedBook)}
        <Spinner />
    {:then booksInfo}
        {#if booksInfo?.length === undefined}
            <p class="text-uchu-blue">No books found</p>
        {:else}
            {#each booksInfo as info}
                    <a class="max-w-xl w-full p-4 mb-4 border rounded-lg shadow-md border-uchu-dark-gray" href={info.document.slug ? `https://hardcover.app/books/${info.document.slug}` : "#"} target="_blank">
                        <h3 class="text-xl font-bold">{info.document.title || 'Unknown'}</h3>
                        <p class="text-sm text-uchu-dark-gray">{info.document.author_names?.join(', ') || 'Unknown'}</p>
                        <p class="text-yellow-500">average rating★: {(info.document.rating || 0).toFixed(1)}</p>
                        <p class="text-xs text-uchu-dark-gray">ISBN: {info.document.isbns[0] ?? ""}</p>
                    </a>
            {/each}
        {/if}
    {:catch error}
        {error}
    {/await}
</div>
{/if}