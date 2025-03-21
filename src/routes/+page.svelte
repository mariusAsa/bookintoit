<script lang="ts">
import DisplayBooks from "$lib/DisplayBooks.svelte";
import Spinner from "$lib/Spinner.svelte";
import type { Book } from "$lib/types.js";
import Button from "$lib/wrappers/Button.svelte";
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
let defaultBooks: Array<Book> = [
	{
		author: "Arundhati Roy",
		title: "The God of Small Things",
		box: [472, 434, 654, 480],
	},
];
let books: Array<Book> = $state([]);
let selectedBook: Book | undefined = $state(undefined);
let disabled: boolean = $derived(
	$file.length === 0 || $delayed || $errors._errors !== undefined,
);
</script>

<Input {file} {selectedBook} blur={$delayed}/>
{#if $delayed}
    <div class="justify-center flex mt-4">
        Awaiting response from Gemini<span class="animate-[bounce_1s_infinite_100ms]">.</span><span class="animate-[bounce_1s_infinite_200ms]">.</span><span class="animate-[bounce_1s_infinite_300ms]">.</span>
    </div>
{/if}
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
        <Button type="submit" {disabled}>
            Send to Gemini
        </Button>
    </form>
</div>
<DisplayBooks bind:selectedBook {books}/>