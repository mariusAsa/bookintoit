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
	ascending = key === newKey && ascending === 1 ? -1 : 1;
	key = newKey;
}
function sortBooks(sortBy: keyof Book, ascending: number, books: Book[]) {
	switch (sortBy) {
		case "author":
			return books.toSorted(
				(a, b) =>
					ascending * (a.author ?? "zzz").localeCompare(b.author ?? "zzzz"),
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

<div class="grid grid-cols-3 w-full max-w-[700px] self-center" transition:slide={{duration: 250, easing: cubicInOut}}>
	<button class="font-bold hover:underline self-center col-span-1" onclick={() => setKey("author")}>
		Author {key === "author" ? (ascending === 1 ? "↓" : "↑") : ""}
	</button>
	<button class="font-bold hover:underline self-center col-span-2 border-l border-uchu-gray" onclick={() => setKey("title")}>
		Title {key === "title" ? (ascending === 1 ? "↓" : "↑") : ""}
	</button>
	{#each sortedBooks as book}
		<button class="col-span-3 grid grid-cols-3 hover:bg-uchu-gray self-center w-full border-t border-uchu-gray" onclick={() => handleClick(book)}>
			<div class="col-span-1 text-sm py-1 ">{book.author}</div>
			<div class="col-span-2 border-l border-uchu-gray text-sm py-1">{book.title}</div>
		</button>
	{/each}
</div>