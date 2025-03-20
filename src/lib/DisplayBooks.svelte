<script lang="ts">
import BookInfo from "./BookInfo.svelte";
import BookList from "./BookList.svelte";
import type { Book } from "./types";
let {
	books,
	selectedBook = $bindable(undefined),
}: { books: Book[]; selectedBook: Book | undefined } = $props();
</script>

<div class="flex justify-center flex-col items-center w-full gap-3">
    <div class="text-xl font-bold">{books.length === 0 ? "" : selectedBook ? "Book:" : `Books: (${books.length})`}</div>
    {#if !selectedBook && books.length > 0}
        <BookList {books} handleClick={(book: Book) => selectedBook = book} />
    {:else if selectedBook}
        <BookInfo bind:selectedBook />
    {/if}
</div>