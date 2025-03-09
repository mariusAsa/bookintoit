<script lang="ts">
import type { Book } from "./types";

let {
	books,
	handleClick,
}: { books: Book[]; handleClick: (book: Book) => void } = $props();

function searchBook(book: Book) {
    fetch(`/api/book?title=${book.title}&author=${book.author}`)
        .then((res) => res.json())
        .then((data) => {
        });
}

let key: keyof Book = $state("box");
let ascending = $state(1);
function setKey(newKey: keyof Book) {
    if (key === newKey && ascending === 1) {
        ascending = -1;
    } else {
        ascending = 1;
    }
    key = newKey;
}
function sortBooks(sortBy: keyof Book, ascending: number, books: Book[]) {
    switch (sortBy) {
        case "author":
            return books.toSorted((a, b) => ascending * (a.author ?? "zzz").localeCompare(b.author ?? "zzz"));
        case "title":
            return books.toSorted((a, b) => ascending * (a.title ?? "zzz").localeCompare(b.title ?? "zzz"));
        case "box":
            return books;
    };
}
let sortedBooks = $derived(sortBooks(key, ascending, books));
</script>

<div class="flex flex-col gap-1 items-center justify-center py-4">
    <span class="text-xl font-bold mb-2">Books {books.length === 0 ? "" : `(${books.length})`}:</span>
    {#if books.length > 0}
        <div class="flex justify-center text-lg font-bold">
            Sort by:&nbsp<button class="hover:underline" onclick={() => setKey("author")}>Author</button>,&nbsp<button class="hover:underline" onclick={() => setKey("title")}>Title</button>
        </div>
        {#each sortedBooks as book}
            <button class="hover:underline" onclick={() => {
                handleClick(book);
                searchBook(book);
                }}>
                {book.author}, {book.title}
            </button>
        {/each}
    {/if}
</div>