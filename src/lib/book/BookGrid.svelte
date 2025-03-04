<script lang="ts">
    import Dialog from "$lib/wrappers/Dialog.svelte";
    import type { Book } from "../../routes/+page.svelte";
    import SortableColumn from "./SortableColumn.svelte";
    let { books, displayBoundingBox } = $props();
    
    let key: keyof Book = $state("box");
    function sortBooks(books: Book[], key: keyof Book): Book[] {
        switch (key) {
            case "author":
                return books.toSorted((a, b) =>
                    (a.author ?? "zzz").localeCompare(b.author ?? "zzz"),
                );
            case "title":
                return books.toSorted((a, b) =>
                    (a.title ?? "zzz").localeCompare(b.title ?? "zzz"),
                );
            case "box":
                return books;
        }
    }
    let filteredBooks: Array<Book> = $derived(sortBooks(books, key));

    let selectedBook: Book = $state({author: null, title: null, box: null});
    let dialog: Dialog | undefined = $state(undefined);
    function showModal(book: Book){
        selectedBook = book;
        dialog?.open();
    }
</script>

<div class="flex justify-center grow">
    <div class="grid grid-cols-3 w-3/4 min-w-72">
        <SortableColumn name="Author" on:click={() => key="author"} sortable/>
        <SortableColumn name="Title" on:click={() => key="title"} sortable/>
        <SortableColumn name="Box" />
        {#each filteredBooks as book}
            <button class="text-xs sm:text-sm border-b border-x p-1 break-words hover:bg-primary-200" onclick={() => showModal(book)}>
                {book.author}
            </button>
            <button class="text-xs sm:text-sm border-b border-x p-1 break-words hover:bg-primary-200" onclick={() => showModal(book)}>
                {book.title}
            </button>
            <button 
                class="text-xs sm:text-sm border-b border-x p-1 truncate hover:bg-primary-200" 
                onclick={displayBoundingBox(book)}
            >
                {book.box}
            </button>
        {/each}
    </div>
</div>

<Dialog bind:this={dialog} {selectedBook} />