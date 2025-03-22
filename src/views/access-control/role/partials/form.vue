<script setup>
const props = defineProps({
    targetId: String,
    action: String
});
</script>

<template>
    <div>{{ props.targetId + props.action }}</div>
</template>
