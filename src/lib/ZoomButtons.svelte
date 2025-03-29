<script lang="ts">
let { scale }: { scale: (factor: number) => void } = $props();
</script>

<div class="absolute top-1 right-1 flex flex-col opacity-75 hover:opacity-100">
    <button class="px-1.5 bg-uchu-light-gray hover:bg-uchu-gray rounded-t active:bg-uchu-dark-gray border-x border-t border-uchu-dark-gray" onclick={() => scale(1.25)}>
        +
    </button>
    <button class="px-1.5 bg-uchu-light-gray hover:bg-uchu-gray rounded-b border border-uchu-dark-gray active:bg-uchu-dark-gray" onclick={() => scale(0.75)}>
        -
    </button>
</div>
