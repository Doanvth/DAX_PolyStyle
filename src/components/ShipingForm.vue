<template>
    <div class="checkout-page">
        <div class="checkout-container">

            <div class="form-section">
                <div class="logo-container">
                    <h1 class="logo-text">Orchid</h1>
                    <p class="logo-tagline">Dẫn Lối Thời Trang Phái Đẹp</p>
                </div>

                <div class="mobile-header">
                    <a href="#" class="back-link">&lt; Giỏ hàng</a>
                    <h2>Thanh toán</h2>
                </div>

                <section class="info-section">
                    <h3>Thông tin giao hàng</h3>
                    <p class="login-prompt">
                        Bạn đã có tài khoản? <a href="#">Đăng nhập</a>
                    </p>

                    <form @submit.prevent="handleSubmit">
                        <div class="form-group">
                            <input type="text" v-model="formData.name" placeholder="Họ và tên *" required>
                        </div>
                        <div class="form-group">
                            <input type="email" v-model="formData.email" placeholder="Email *" required>
                        </div>
                        <div class="form-group">
                            <input type="tel" v-model="formData.phone" placeholder="Số điện thoại *" required>
                        </div>
                        <div class="form-group">
                            <input type="text" v-model="formData.address" placeholder="Địa chỉ *" required>
                        </div>
                        <div class="form-group select-wrapper">
                            <select v-model="formData.city" required>
                                <option value="" disabled selected>Chọn tỉnh / thành *</option>
                                <option value="hcm">TP. Hồ Chí Minh</option>
                                <option value="hn">Hà Nội</option>
                                <option value="ct">Cần Thơ</option>
                            </select>
                        </div>
                        <div class="form-group select-wrapper">
                            <select v-model="formData.district" required>
                                <option value="" disabled selected>Chọn quận / huyện *</option>
                                <option value="q1">Quận 1</option>
                                <option value="q2">Quận 2</option>
                                <option value="q3">Quận 3</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <textarea v-model="formData.note" placeholder="Lời nhắn"></textarea>
                        </div>
                    </form>
                </section>

                <section class="payment-section">
                    <h3>Phương thức thanh toán</h3>
                    <div class="payment-option">
                        <input type="radio" id="cod" value="cod" v-model="paymentMethod" checked>
                        <label for="cod">Thanh toán tại nhà</label>
                    </div>
                </section>

                <a href="#" class="back-link-desktop">&lt; Giỏ hàng</a>
            </div>

            <div class="summary-section">
                <h3>Tóm tắt đơn hàng</h3>
                <div class="summary-item">
                    <span>Sản phẩm A (x1)</span>
                    <span>100.000đ</span>
                </div>
                <div class="summary-item">
                    <span>Sản phẩm B (x2)</span>
                    <span>150.000đ</span>
                </div>
                <hr>
                <div class="summary-total">
                    <strong>Tổng cộng</strong>
                    <strong>250.000đ</strong>
                </div>
                <button class="order-button" @click="handleSubmit">Đặt hàng</button>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

// Dữ liệu giả lập cho v-model
const formData = ref({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    note: '',
});

const paymentMethod = ref('cod');

// Hàm xử lý khi nhấn nút (chỉ để demo)
const handleSubmit = () => {
    if (!formData.value.name || !formData.value.email || !formData.value.phone || !formData.value.address || !formData.value.city || !formData.value.district) {
        alert('Vui lòng điền đầy đủ các trường bắt buộc (*)');
        return;
    }
    console.log('Đang gửi dữ liệu:', formData.value);
    console.log('Phương thức thanh toán:', paymentMethod.value);
    alert('Đặt hàng thành công! (Demo)');
};
</script>

<style scoped>
/*
 * ===============================================
 * CSS TONE TRẮNG (Giao diện gốc)
 * ===============================================
*/

/* Biến màu (Theme Trắng) */
:root {
    --primary-color: #333;
    --border-color: #ddd;
    --background-color: #f9f9f9;
    --text-color: #222;
    --text-light: #777;
}

/* Thiết lập cơ bản (Mobile First) */
.checkout-page {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background-color: white;
    color: var(--text-color);
    line-height: 1.6;
}

.checkout-container {
    display: flex;
    flex-direction: column;
    max-width: 1200px;
    margin: 0 auto;
}

.form-section {
    width: 100%;
    padding: 20px;
    order: 2;
}

.summary-section {
    width: 100%;
    padding: 20px;
    background-color: var(--background-color);
    border-bottom: 1px solid var(--border-color);
    order: 1;
}

/* Logo (Căn giữa) */
.logo-container {
    text-align: center;
    margin-bottom: 20px;
}

.logo-text {
    font-size: 2.5rem;
    font-weight: bold;
    margin: 0;
    letter-spacing: -1px;
}

.logo-tagline {
    font-size: 0.9rem;
    color: var(--text-light);
    margin: 0;
}

/* Tiêu đề & link quay lại trên Mobile */
.mobile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 10px;
    margin-bottom: 20px;
}

.mobile-header h2 {
    margin: 0;
    font-size: 1.2rem;
}

.back-link {
    font-size: 0.9rem;
    color: var(--primary-color);
    text-decoration: none;
}

.back-link-desktop {
    display: none;
}

/* Phần Form */
.info-section,
.payment-section {
    margin-bottom: 25px;
}

h3 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 15px;
}

.login-prompt {
    font-size: 0.9rem;
    margin-bottom: 15px;
}

.login-prompt a {
    color: var(--primary-color);
    font-weight: 500;
    text-decoration: none;
}

/* Kiểu input, select, textarea */
.form-group {
    margin-bottom: 15px;
}

input[type="text"],
input[type="email"],
input[type="tel"],
select,
textarea {
    width: 100%;
    padding: 12px 15px;
    font-size: 0.95rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    background-color: white; /* Đảm bảo nền trắng */
    color: var(--text-color); /* Đảm bảo chữ đen */
}

textarea {
    min-height: 80px;
    resize: vertical;
}

::placeholder {
    color: #999;
}

/* Tùy chỉnh mũi tên cho select */
.select-wrapper {
    position: relative;
}

select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: white;
}

.select-wrapper::after {
    content: '▼';
    font-size: 0.8rem;
    color: #888;
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
}

/* Phương thức thanh toán */
.payment-option {
    display: flex;
    align-items: center;
    background-color: #f7f7f7;
    border: 1px solid var(--border-color);
    padding: 15px;
    border-radius: 5px;
}

.payment-option input[type="radio"] {
    width: auto;
    margin-right: 10px;
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid var(--primary-color);
    border-radius: 50%;
    cursor: pointer;
}

.payment-option input[type="radio"]:checked {
    background-color: var(--primary-color);
    border-width: 3px;
    background-clip: content-box;
}

.payment-option label {
    font-size: 0.95rem;
    font-weight: 500;
}

/* Phần Tóm tắt đơn hàng (Summary) */
.summary-item,
.summary-total {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 0.95rem;
}

.summary-total {
    font-size: 1.1rem;
    margin-top: 15px;
}

.summary-section hr {
    border: 0;
    border-top: 1px solid var(--border-color);
    margin: 15px 0;
}

/* Nút Đặt hàng */
.order-button {
    width: 100%;
    padding: 15px;
    font-size: 1rem;
    font-weight: 600;
    color: white;
    background-color: var(--primary-color);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 15px;
}

/* Nút FAB (Ẩn) */
.fab { display: none; }


/* Thiết lập cho Desktop (Responsive) */
@media (min-width: 1024px) {
    .checkout-container {
        flex-direction: row;
        padding: 40px 20px;
        gap: 40px;
    }

    .form-section {
        flex: 6;
        order: 1;
        padding: 0;
    }

    .summary-section {
        flex: 4;
        order: 2;
        border: 1px solid var(--border-color);
        border-radius: 5px;
        background-color: white;
        height: fit-content;
    }

    .logo-container {
        text-align: left;
    }

    .mobile-header {
        display: none;
    }

    .back-link-desktop {
        display: block;
        font-size: 0.9rem;
        color: var(--primary-color);
        text-decoration: none;
        margin-top: 20px;
    }
}
</style>