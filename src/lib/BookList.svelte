<script lang="ts">
import { cubicInOut } from "svelte/easing";
import { slide } from "svelte/transition";
import type { Book } from "./types";
let {
	books,
	handleClick,
}: { books: Book[]; handleClick: (book: Book) => void } = $props();

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
			return books.toSorted(
				(a, b) =>
					ascending * (a.author ?? "zzz").localeCompare(b.author ?? "zzz"),
			);
		case "title":
			return books.toSorted(
				(a, b) =>
					ascending * (a.title ?? "zzz").localeCompare(b.title ?? "zzz"),
			);
		case "box":
			return books;
	}
}
let sortedBooks = $derived(sortBooks(key, ascending, books));
</script>

<div class="grid grid-cols-2 w-full max-w-[600px] self-center" transition:slide={{duration: 250, easing: cubicInOut}}>
    <button class="font-bold hover:underline self-center" onclick={() => setKey("author")}>
        Author {key === "author" ? (ascending === 1 ? "↓" : "↑") : ""}
    </button>
    <button class="font-bold hover:underline self-center" onclick={() => setKey("title")}>
        Title {key === "title" ? (ascending === 1 ? "↓" : "↑") : ""}
    </button>
    {#each sortedBooks as book}
        <button type="button" class="col-span-2 grid grid-cols-2 gap-x-4 hover:bg-uchu-gray cursor-pointer self-center w-full" 
                onclick={() => handleClick(book)}>
            <div>{book.author}</div>
            <div>{book.title}</div>
        </button>
    {/each}
</div>