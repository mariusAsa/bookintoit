<script lang="ts">
import Spinner from "./Spinner.svelte";
import type { ApiResponse, Book } from "./types";

let {
	selectedBook = $bindable(undefined),
}: { selectedBook: Book | undefined } = $props();
async function searchBook(book: Book) {
	const f: Promise<ApiResponse> = fetch(
		`/api/book?title=${book.title}&author=${book.author}`,
	).then((res) => res.json());
	return f;
}

function numberToStars(num: number) {
	if (num === 0) return "";
	return "★".repeat(Math.round(num));
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
        {#each booksInfo as info}
            <a class="max-w-xl w-full p-4 mb-4 border rounded-lg shadow-md border-uchu-dark-gray" href={info.document.slug ? `https://hardcover.app/books/${info.document.slug}` : "#"} target="_blank">
                <h3 class="text-xl font-bold">{info.document.title || 'Unknown'}</h3>
                <p class="text-sm text-gray-600 mb-2">{info.document.author_names.join(', ') || 'Unknown'}</p>
                <p class="text-yellow-500">{info.document.ratings_count} ratings: {numberToStars(info.document.rating)}</p>
                <p class="text-xs mt-2 text-gray-500">ISBN: {info.document.isbns[0]}</p>
            </a>
        {/each}
        {#if booksInfo?.length === undefined}
            <p class="text-uchu-blue">No books found</p>
        {/if}
    {:catch error}
        {error}
    {/await}
</div>
{/if}