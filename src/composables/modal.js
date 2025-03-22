import { ref } from 'vue';

export function useModal() {
    const isVisible = ref(false);
    const action = ref(null);
    const targetId = ref(null);

    const openModal = (modalAction, id = null) => {
        isVisible.value = true;
        targetId.value = id;
        action.value = modalAction;
    };

    const closeModal = () => {
        isVisible.value = false;
        targetId.value = null;
        action.value = null;
    };

    return { isVisible, action, targetId, openModal, closeModal };
}
