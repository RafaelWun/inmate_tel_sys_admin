<script setup>
import { ref } from 'vue';

const props = defineProps({
    targetId: String,
    targetName: String,
    action: String
});
const emits = defineEmits(['close']);

const pinInput = ref('');

const handleReset = () => {
    const payload = {
        prisoner_uuid: props.targetId,
        pin: pinInput.value
    };
    console.log('payload: ', payload);
};
</script>

<template>
    <form class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4 max-w-4xl">
            <div class="flex flex-col gap-2">
                <label v-text="'ID'" />
                <InputText :value="props.targetId" placeholder="ID Tahanan" disabled type="text" />
            </div>
            <div class="flex flex-col gap-2">
                <label v-text="'Nama'" />
                <InputText :value="props.targetName" placeholder="Nama Tahanan" disabled type="text" />
            </div>
        </div>
        <div class="flex flex-col gap-2">
            <label v-text="'Pin Baru'" />
            <InputText v-model="pinInput" placeholder="Masukkan PIN baru" type="text" @input="pinInput = pinInput.replace(/\D/g, '').slice(0, 6)" />
        </div>
        <div class="flex justify-end gap-2">
            <Button @click="emits('close')" type="button" icon="pi pi-angle-left" label="Batalkan" severity="secondary" />
            <Button @click="handleReset" icon="pi pi-refresh" label="Reset" severity="warn" />
        </div>
    </form>
</template>
