<script lang="ts">
    import type { Book } from "./types";

    let { books, handleClick }: {books: Book[], handleClick: (book: Book) => {} } = $props();
</script>

<div class="flex flex-col gap-1 items-center justify-center py-4">
    <span class="text-xl font-bold mb-2">Books:</span>
    {#each books as book}
        <button class="hover:underline" onclick={() => handleClick(book)}>{book.author}, {book.title}</button>
    {/each}
</div>