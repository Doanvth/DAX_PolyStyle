<template>
  <div class="success-page-container">
    <div class="card-success">
      
      <!-- 1. ICON & LỜI CẢM ƠN -->
      <div class="success-header">
        <div class="icon-circle">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h1 class="title">ĐẶT HÀNG THÀNH CÔNG!</h1>
        <p class="subtitle">Cảm ơn bạn đã mua sắm tại Orchid. Đơn hàng của bạn đã được tiếp nhận và đang xử lý.</p>
        <div class="order-id">Mã đơn hàng: <strong>#ORD-20258899</strong></div>
      </div>

      <!-- 2. THÔNG TIN ĐƠN HÀNG -->
      <div class="order-details">
        
        <!-- Cột thông tin khách hàng -->
        <div class="info-column">
          <h3>Thông tin nhận hàng</h3>
          <p><strong>Người nhận:</strong> Nguyễn Văn A</p>
          <p><strong>SĐT:</strong> 0988 123 456</p>
          <p><strong>Địa chỉ:</strong> 123 Đường Láng, Đống Đa, Hà Nội</p>
          <p><strong>Phương thức thanh toán:</strong> Chuyển khoản ngân hàng</p>
          
          <!-- Box thông tin chuyển khoản nếu chọn Banking -->
          <div class="banking-info">
            <p class="bank-title">Vui lòng chuyển khoản tới:</p>
            <p>Vietcombank - CN Hà Nội</p>
            <p>STK: <strong>001100999999</strong></p>
            <p>Chủ TK: CONG TY TNHH ORCHID</p>
            <p>Nội dung: <strong>ORD-20258899</strong></p>
          </div>
        </div>

        <!-- Cột sản phẩm -->
        <div class="product-column">
          <h3>Sản phẩm đã đặt</h3>
          <div class="item-row" v-for="item in purchasedItems" :key="item.id">
            <div class="item-img">
              <img :src="item.image" :alt="item.name">
              <span class="qty">x{{ item.quantity }}</span>
            </div>
            <div class="item-text">
              <p class="name">{{ item.name }}</p>
              <p class="variant">{{ item.size }} / {{ item.color }}</p>
            </div>
            <div class="item-price">{{ formatCurrency(item.price) }}</div>
          </div>

          <div class="divider"></div>

          <div class="total-row">
            <span>Tổng cộng:</span>
            <span class="price-final">1,258,000 ₫</span>
          </div>
        </div>

      </div>

      <!-- 3. BUTTONS -->
      <div class="action-buttons">
        <button class="btn-continue">TIẾP TỤC MUA SẮM</button>
        <button class="btn-track">THEO DÕI ĐƠN HÀNG</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Data giả lập các món vừa mua
const demoImg = "https://pos.nvncdn.com/af3c03-152482/ps/20251112_kwRZ3ZkLE4.jpeg?v=1762929741";

const purchasedItems = ref([
  {
    id: 1,
    name: "OD4S439 - Áo len lông ghi",
    price: 659000,
    quantity: 1,
    size: 'M',
    color: 'Ghi đá',
    image: demoImg
  },
  {
    id: 2,
    name: "OD4B453 - Áo nhung the",
    price: 599000,
    quantity: 1,
    size: 'S',
    color: 'Đỏ đô',
    image: demoImg
  }
]);

const formatCurrency = (val) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};
</script>

<style scoped>
.success-page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
  color: #333;
  padding: 40px 15px;
}

.card-success {
  background: #fff;
  width: 100%;
  max-width: 800px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  overflow: hidden;
  text-align: center;
}

/* HEADER */
.success-header {
  background: #000;
  color: #fff;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-circle {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #28a745; /* Màu xanh lá thành công */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 0 0 5px rgba(40, 167, 69, 0.3);
}

.title {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
}

.subtitle {
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #ccc;
  max-width: 500px;
  line-height: 1.5;
}

.order-id {
  background: rgba(255,255,255,0.1);
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 14px;
}

/* DETAILS */
.order-details {
  display: flex;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.info-column, .product-column {
  flex: 1;
  padding: 30px;
}

.info-column {
  border-right: 1px solid #eee;
  background: #fafafa;
}

h3 {
  font-size: 16px;
  text-transform: uppercase;
  margin-bottom: 20px;
  border-bottom: 2px solid #000;
  display: inline-block;
  padding-bottom: 5px;
}

.info-column p {
  font-size: 14px;
  margin-bottom: 10px;
  line-height: 1.5;
}

.banking-info {
  margin-top: 20px;
  background: #fff;
  border: 1px dashed #000;
  padding: 15px;
  border-radius: 4px;
}
.bank-title { font-weight: bold; color: #d0011b; margin-bottom: 5px; }

/* Product List in Success Page */
.item-row {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.item-img {
  width: 50px;
  height: 65px;
  position: relative;
  margin-right: 15px;
  border: 1px solid #eee;
}
.item-img img { width: 100%; height: 100%; object-fit: cover; }
.qty {
  position: absolute;
  top: -5px; right: -5px;
  background: #666;
  color: #fff;
  font-size: 10px;
  width: 18px; height: 18px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}

.item-text { flex: 1; }
.item-text .name { font-size: 13px; font-weight: bold; margin: 0 0 3px 0; }
.item-text .variant { font-size: 12px; color: #888; margin: 0; }
.item-price { font-weight: bold; font-size: 13px; }

.divider { border-top: 1px solid #eee; margin: 20px 0; }

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
}
.price-final { color: #d0011b; font-size: 20px; }

/* BUTTONS */
.action-buttons {
  padding: 30px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

button {
  padding: 12px 30px;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.btn-continue {
  background: #000;
  color: #fff;
  border: 1px solid #000;
}
.btn-continue:hover { background: #333; }

.btn-track {
  background: #fff;
  color: #000;
  border: 1px solid #000;
}
.btn-track:hover { background: #f0f0f0; }

/* Responsive */
@media (max-width: 768px) {
  .order-details { flex-direction: column; }
  .info-column { border-right: none; border-bottom: 1px solid #eee; }
  .action-buttons { flex-direction: column; }
  button { width: 100%; }
}
</style>