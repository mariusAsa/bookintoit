<script lang="ts">
export let name: string;
export let sortable = false;
</script>

<button
    class="border-y border-x text-bold p-1 bg-primary-100 text-center {sortable
        ? 'hover:bg-primary-300'
        : 'cursor-default'}"
    on:click
>
    {name}
</button>
