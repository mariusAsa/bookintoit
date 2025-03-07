<script lang="ts">
import DisplayBooks from "$lib/DisplayBooks.svelte";
import Spinner from "$lib/Spinner.svelte";
import type { Book } from "$lib/types.js";
import Input from "$lib/wrappers/Input.svelte";
import { fileProxy, superForm } from "sveltekit-superforms";

let { data } = $props();
const { form, errors, message, enhance, delayed } = superForm(data.form, {
	delayMs: 500,
	onUpdated({ form }) {
		if (form.message) {
			books = $message;
		}
	},
});
const file = fileProxy(form, "image");
let books: Array<Book> = $state([]);
let selectedBook: Book | undefined = $state(undefined);
let disabled = $derived($file.length === 0 || $delayed);
</script>


<div class="relative">
    <Input {file} {selectedBook} blur={$delayed}/>
    {#if $delayed}
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"><Spinner /></div>  
    {/if}
</div>
<div class="justify-center flex {disabled ? '' : 'pt-4'}">
    <form 
        method="POST" 
        use:enhance 
        enctype="multipart/form-data"
    >
        <input
            accept="image/*"
            type="file"
            name="image"
            required
            hidden
            bind:files={$file}
        />
        <button type="submit" class="rounded border py-1 px-2 hover:bg-stone-300 disabled:hidden" {disabled}>
            {#if $errors._errors}
                <span class="text-red-500">
                    {$errors._errors}
                </span>
            {:else}
                Send to Gemini
            {/if}
        </button>
    </form>
</div>
<DisplayBooks {books} handleClick={(book: Book) => selectedBook = book}/>