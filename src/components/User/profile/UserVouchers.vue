<template>
    <div class="user-vouchers-card">
        <h2>Ví Voucher</h2>
        <p>Danh sách voucher của bạn</p>
        <hr>

        <div v-if="userVouchers && userVouchers.length > 0" class="voucher-list">
            <div v-for="voucher in userVouchers" :key="voucher.id"
                :class="['voucher-item', { 'is-expired': isExpired(voucher.expire_At) }]">
                <div class="voucher-icon">
                    <span>🎁</span>
                </div>
                <div class="voucher-details">
                    <strong>{{ voucher.name }}</strong>
                    <span>{{ voucher.description }}</span>
                    <span class="code">Mã: <strong>{{ voucher.code_voucher }}</strong></span>
                    <span class="expiry">HSD: {{ voucher.expire_At }}</span>
                </div>
            </div>
        </div>

        <div v-else>
            <p>Bạn không có voucher nào.</p>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    user: Object,
    lookupData: Object
});

const userVouchers = computed(() => {
    if (!props.user || !props.user.voucher_id || !props.lookupData || !props.lookupData.vouchers) {
        return [];
    }

    return props.user.voucher_id
        .map(id => props.lookupData.vouchers.find(v => v.id === id))
});

const isExpired = (expiryDateString) => {
    if (!expiryDateString) return false;
    return new Date(expiryDateString) < new Date();
};
</script>

<style scoped>
.user-vouchers-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 24px;
    background-color: #fff;
}

.user-vouchers-card h2 {
    margin-top: 0;
}

hr {
    border: 0;
    border-top: 1px solid #eee;
    margin: 16px 0;
}

.voucher-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}

.voucher-item {
    display: flex;
    border: 1px solid #007bff;
    border-radius: 8px;
    background-color: #f0f7ff;
    overflow: hidden;
}

.voucher-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2em;
    padding: 20px;
    background-color: #e0f0ff;
}

.voucher-details {
    display: flex;
    flex-direction: column;
    padding: 15px;
    gap: 5px;
}

.voucher-details strong {
    font-size: 1.1em;
}

.code {
    background: #fff;
    padding: 2px 5px;
    border-radius: 3px;
    align-self: flex-start;
}

.expiry {
    font-size: 0.9em;
    color: #555;
    margin-top: 5px;
}

.voucher-item.is-expired {
    border-color: #ccc;
    background-color: #f5f5f5;
    opacity: 0.7;
}

.voucher-item.is-expired .voucher-icon {
    background-color: #eee;
}

.voucher-item.is-expired .expiry {
    color: red;
    font-weight: bold;
}
</style>