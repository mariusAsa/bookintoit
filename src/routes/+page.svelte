<script lang="ts">
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
    const defaultBooks: Array<Book> = [];
    let books: Array<Book> = $state(defaultBooks);
    const file = fileProxy(form, 'image');
</script>

<div class:blur={$delayed}>
    <Input {file} />
</div>

<div class="w-full justify-center flex pt-4">
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
        <button type="submit" class="rounded border py-1 px-2 m-auto disabled:hidden" disabled={$file.length === 0 || $delayed}>
            Send to OCR
        </button>
    </form>
</div>