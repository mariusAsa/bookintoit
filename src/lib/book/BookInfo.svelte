<script lang="ts">
    let { subject } = $props();
</script>

<div class="col-span-2 border px-2 py-1 grid grid-cols-[20%_80%]">
    <div class="col-span-1 border-r">
        {subject}
    </div>
    <!-- svelte-ignore slot_element_deprecated -->
    <div class="col-span-1 line-clamp-1">
        <slot />
    </div>
</div>