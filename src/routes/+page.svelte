<script lang="ts">
    import DisplayBooks from "$lib/DisplayBooks.svelte";
    import type { Book } from "$lib/types.js";
    import Input from "$lib/wrappers/Input.svelte";
    import { fileProxy, superForm } from "sveltekit-superforms";

    let { data } = $props();
    const { form, message, enhance, delayed } = superForm(data.form, {
        delayMs: 500,
        onUpdated({ form }) {
            console.log($message);
            if (form.message) books = $message;
        },
    });
    const file = fileProxy(form, 'image');
    let books: Array<Book> = $state([]);
    let selectedBook: Book | undefined = $state(undefined)
    let disabled = $derived($file.length === 0 || $delayed)
</script>

<div class:blur={$delayed}>
    <Input {file} {selectedBook}/>
</div>

<div class="justify-center flex {disabled ? '' : 'pt-4'}">
    <form 
        method="POST" 
        use:enhance 
        enctype="multipart/form-data"
    >
        <input
            accept="image/jpeg"
            type="file"
            name="image"
            required
            hidden
            bind:files={$file}
        />
        <button type="submit" class="rounded border py-1 px-2 hover:bg-stone-200 disabled:hidden" {disabled}>
            Send to OCR
        </button>
    </form>
</div>
<DisplayBooks {books} handleClick={(book: Book) => selectedBook = book}/>