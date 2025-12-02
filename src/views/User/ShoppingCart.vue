<template>
    <div class="container">
        <div class="cart-wrapper">

            <div class="cart-list">
                <h2 class="section-title">GIỎ HÀNG</h2>

                <div class="cart-header-line">
                    <label class="checkbox-wrapper select-all">
                        <input type="checkbox" v-model="isAllSelected" />
                        <span>Chọn tất cả ({{ cart.length }} sản phẩm)</span>
                    </label>
                </div>

                <div v-if="cart.length === 0" class="empty-cart">
                    Giỏ hàng trống
                </div>

                <div v-else v-for="(item, index) in cart" :key="item.id" class="product-row">

                    <div class="checkbox-col">
                        <input type="checkbox" v-model="item.selected" />
                    </div>

                    <div class="product-image">
                        <img :src="item.image" :alt="item.name" />
                    </div>

                    <div class="product-info">
                        <div class="info-top">
                            <div class="name-price">
                                <h3 class="product-name">{{ item.name }}</h3>
                                <span class="unit-price">{{ formatCurrency(item.price) }}</span>
                            </div>
                            <button class="btn-remove" @click="removeItem(index)">Xóa</button>
                        </div>

                        <div class="product-code">Mã: {{ item.code }}</div>

                        <div class="controls-row">
                            <div class="quantity-control">
                                <button @click="decreaseQuantity(index)" :disabled="item.quantity <= 1">-</button>
                                <input type="text" v-model.number="item.quantity" readonly />
                                <button @click="increaseQuantity(index)">+</button>
                            </div>

                            <div class="item-total-price">
                                {{ formatCurrency(item.price * item.quantity) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="cart-summary">
                <h2 class="section-title">ĐƠN HÀNG CỦA BẠN</h2>

                <div class="summary-box">
                    <div class="summary-row">
                        <span>Đã chọn:</span>
                        <span>{{ totalSelectedItems }} sản phẩm</span>
                    </div>
                    <div class="summary-row">
                        <span>Tạm tính:</span>
                        <span>{{ formatCurrency(subtotal) }}</span>
                    </div>
                    <div class="summary-row">
                        <span>Phí vận chuyển:</span>
                        <span class="shipping-text">Chưa có</span>
                    </div>

                    <div class="summary-divider"></div>

                    <div class="summary-row total-row">
                        <span>Thành tiền:</span>
                        <span class="total-amount">{{ formatCurrency(subtotal) }}</span>
                    </div>
                    <router-link to="/CheckoutPage">
                        <button class="btn-checkout" :disabled="totalSelectedItems === 0"
                            :class="{ 'btn-disabled': totalSelectedItems === 0 }">
                            ĐẶT HÀNG NGAY
                        </button>
                    </router-link>

                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const cart = ref([
    {
        id: 1,
        name: "OD4B453 - Áo nhung the - M - Đỏ đô",
        code: "OD4B453DO/M/1",
        price: 599000,
        quantity: 1,
        image: "https://pos.nvncdn.com/af3c03-152482/ps/20251112_kwRZ3ZkLE4.jpeg?v=1762929741",
        selected: true // Mặc định được chọn
    },
    {
        id: 2,
        name: "OD4B454 - Váy lụa - L - Đen",
        code: "OD4B454DE/L/1",
        price: 450000,
        quantity: 2,
        image: "https://pos.nvncdn.com/af3c03-152482/ps/20251112_kwRZ3ZkLE4.jpeg?v=1762929741", // Dùng tạm ảnh cũ demo
        selected: false
    }
]);

// Computed: Xử lý logic "Chọn tất cả"
const isAllSelected = computed({
    get() {
        return cart.value.length > 0 && cart.value.every(item => item.selected);
    },
    set(value) {
        cart.value.forEach(item => item.selected = value);
    }
});

// Computed: Chỉ tính tổng số lượng các item ĐANG ĐƯỢC CHỌN
const totalSelectedItems = computed(() => {
    return cart.value
        .filter(item => item.selected)
        .reduce((sum, item) => sum + item.quantity, 0);
});

// Computed: Chỉ tính tổng tiền các item ĐANG ĐƯỢC CHỌN
const subtotal = computed(() => {
    return cart.value
        .filter(item => item.selected)
        .reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const increaseQuantity = (index) => {
    cart.value[index].quantity++;
};

const decreaseQuantity = (index) => {
    if (cart.value[index].quantity > 1) {
        cart.value[index].quantity--;
    }
};

const removeItem = (index) => {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
        cart.value.splice(index, 1);
    }
};
</script>

<style scoped>
/* Các style cũ giữ nguyên, thêm style mới cho checkbox */

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: sans-serif;
    color: #333;
}

.cart-wrapper {
    display: flex;
    gap: 40px;
}

.section-title {
    font-size: 18px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 15px;
}

.cart-list {
    flex: 2;
}

.cart-header-line {
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;
    padding-bottom: 10px;
    display: flex;
    align-items: center;
}

/* Style cho checkbox */
.checkbox-wrapper {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
}

.checkbox-wrapper input {
    margin-right: 10px;
    width: 18px;
    height: 18px;
    cursor: pointer;
}

/* Cột checkbox trong list item */
.checkbox-col {
    display: flex;
    align-items: center;
    margin-right: 15px;
}

.checkbox-col input {
    width: 18px;
    height: 18px;
    cursor: pointer;
}

.product-row {
    display: flex;
    gap: 15px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;
}

.product-image img {
    width: 120px;
    height: auto;
    object-fit: cover;
}

.product-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.info-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.product-name {
    font-size: 16px;
    font-weight: 500;
    margin: 0 0 5px 0;
    line-height: 1.4;
}

.unit-price {
    color: #4caf50;
    font-weight: 500;
    font-size: 16px;
}

.btn-remove {
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    font-size: 13px;
    text-decoration: underline;
}

.btn-remove:hover {
    color: #d9534f;
}

.product-code {
    color: #888;
    font-size: 13px;
    margin-top: 5px;
}

.controls-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 15px;
}

.quantity-control {
    display: flex;
    border: 1px solid #ddd;
    height: 36px;
}

.quantity-control button {
    width: 30px;
    background: #fff;
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: #333;
}

.quantity-control input {
    width: 40px;
    border: none;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    text-align: center;
    outline: none;
    color: #333;
}

.item-total-price {
    font-size: 18px;
    font-weight: 500;
    color: #333;
}

.cart-summary {
    flex: 1;
}

.summary-box {
    background-color: #f9f9f9;
    padding: 20px;
    border: 1px solid #eee;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 14px;
    color: #666;
}

.summary-row span:last-child {
    color: #333;
    font-weight: 500;
}

.shipping-text {
    color: #666 !important;
    font-weight: normal !important;
}

.summary-divider {
    border-top: 1px solid #ddd;
    margin: 15px 0;
}

.total-row {
    align-items: center;
    margin-bottom: 20px;
}

.total-amount {
    font-size: 20px;
    font-weight: bold;
    color: #333 !important;
}

.btn-checkout {
    width: 100%;
    background-color: #000;
    color: #fff;
    padding: 15px 0;
    border: none;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    text-transform: uppercase;
    transition: background 0.3s;
}

.btn-checkout:hover {
    background-color: #333;
}

/* Thêm trạng thái disabled cho nút checkout */
.btn-disabled {
    background-color: #ccc !important;
    cursor: not-allowed !important;
}

@media (max-width: 768px) {
    .cart-wrapper {
        flex-direction: column;
    }

    .info-top {
        flex-direction: column;
    }

    .btn-remove {
        align-self: flex-end;
        margin-top: -20px;
    }
}
</style>