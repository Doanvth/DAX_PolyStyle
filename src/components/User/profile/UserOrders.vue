<template>
    <div class="user-orders-card">
        <h2>Đơn hàng của tôi</h2>
        <hr>

        <div v-if="user && user.order && user.order.length > 0" class="order-list">
            <div v-for="order in user.order" :key="order.id" class="order-item">
                <div class="order-header">
                    <span>Mã đơn hàng: <strong>#{{ order.id }}</strong></span>
                    <span :class="['status-badge', getStatusClass(order.order_detail[0].status)]">
                        {{ order.order_detail[0].status }}
                    </span>
                </div>

                <div v-for="item in order.order_detail" :key="item.product_id" class="product-item">
                    <img :src="getProductDetails(item.product_id)?.image[0].url"
                        alt="Sản phẩm">
                    <div class="product-info">
                        <strong>{{ getProductDetails(item.product_id)?.name || 'Sản phẩm không tồn tại' }}</strong>
                        <span>Số lượng: {{ item.quantity }}</span>
                    </div>
                    <span class="product-price">
                        {{ formatPrice(getProductDetails(item.product_id)?.price) }}
                    </span>
                </div>

                <div class="order-footer">
                    <strong>Tổng tiền: {{ formatPrice(calculateOrderTotal(order)) }}</strong>
                </div>
            </div>
        </div>

        <div v-else>
            <p>Bạn chưa có đơn hàng nào.</p>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    user: Object,
    lookupData: Object 
});

const getProductDetails = (productId) => {
    if (!props.lookupData || !props.lookupData.products) return null;
    return props.lookupData.products.find(p => p.id === productId);
};

const calculateOrderTotal = (order) => {
    return order.order_detail.reduce((total, item) => total + item.total, 0);
};

const formatPrice = (value) => {
    if (!value && value !== 0) return '...';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const getStatusClass = (status) => {
    if (status === 'Đã giao') return 'status-delivered';
    if (status === 'Đang giao') return 'status-shipping';
    if (status === 'Đã hủy') return 'status-cancelled';
    return 'status-pending'; 
};
</script>

<style scoped>
.user-orders-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 24px;
    background-color: #fff;
}

.user-orders-card h2 {
    margin-top: 0;
}

hr {
    border: 0;
    border-top: 1px solid #eee;
    margin: 16px 0;
}

.order-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.order-item {
    border: 1px solid #e0e0e0;
    border-radius: 5px;
}

.order-header {
    display: flex;
    justify-content: space-between;
    padding: 10px 15px;
    background-color: #f9f9f9;
    border-bottom: 1px solid #e0e0e0;
}

.status-badge {
    font-weight: bold;
}

.status-delivered {
    color: green;
}

.status-shipping {
    color: #007bff;
}

.status-cancelled {
    color: red;
}

.status-pending {
    color: #555;
}

.product-item {
    display: flex;
    align-items: center;
    padding: 15px;
    gap: 15px;
    border-bottom: 1px solid #f0f0f0;
}

.product-item:last-child {
    border-bottom: none;
}

.product-item img {
    width: 60px;
    height: 60px;
    border-radius: 4px;
    border: 1px solid #eee;
    background-color: #f0f0f0;
}

.product-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.product-info span {
    font-size: 0.9em;
    color: #555;
}

.product-price {
    font-weight: bold;
}

.order-footer {
    text-align: right;
    padding: 15px;
    background-color: #f9f9f9;
    border-top: 1px solid #e0e0e0;
}
</style>