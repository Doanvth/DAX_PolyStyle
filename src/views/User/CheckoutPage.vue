<template>
  <div class="checkout-container">
    <div class="container">
      <h1 class="page-title">THANH TOÁN</h1>
      
      <div class="checkout-layout">
        
        <!-- CỘT TRÁI: THÔNG TIN GIAO HÀNG & THANH TOÁN -->
        <div class="col-left">
          
          <!-- 1. Thông tin giao hàng -->
          <section class="section-group">
            <h2 class="section-heading">THÔNG TIN GIAO HÀNG</h2>
            
            <div class="form-grid">
              <div class="form-group full-width">
                <input type="text" v-model="form.name" placeholder="Họ và tên" />
              </div>
              
              <div class="form-group half-width">
                <input type="text" v-model="form.phone" placeholder="Số điện thoại" />
              </div>
              
              <div class="form-group half-width">
                <input type="email" v-model="form.email" placeholder="Email (Không bắt buộc)" />
              </div>

              <div class="form-group half-width">
                <select v-model="form.city" @change="onCityChange">
                  <option value="">Chọn Tỉnh/Thành phố</option>
                  <option v-for="city in cities" :key="city.id" :value="city.id">{{ city.name }}</option>
                </select>
              </div>

              <div class="form-group half-width">
                <select v-model="form.district" :disabled="!form.city">
                  <option value="">Chọn Quận/Huyện</option>
                  <option v-for="dist in availableDistricts" :key="dist.id" :value="dist.id">{{ dist.name }}</option>
                </select>
              </div>

              <div class="form-group full-width">
                <input type="text" v-model="form.address" placeholder="Địa chỉ cụ thể (Số nhà, tên đường...)" />
              </div>
              
              <div class="form-group full-width">
                <textarea v-model="form.note" placeholder="Ghi chú đơn hàng (Ví dụ: Giao giờ hành chính)"></textarea>
              </div>
            </div>
          </section>

          <!-- 2. Phương thức thanh toán -->
          <section class="section-group">
            <h2 class="section-heading">PHƯƠNG THỨC THANH TOÁN</h2>
            <div class="payment-methods">
              
              <label class="payment-option">
                <input type="radio" name="payment" value="cod" v-model="form.paymentMethod">
                <div class="payment-content">
                  <span class="payment-name">Thanh toán khi nhận hàng (COD)</span>
                  <span class="payment-desc">Bạn chỉ phải thanh toán khi nhận được hàng.</span>
                </div>
              </label>

              <label class="payment-option">
                <input type="radio" name="payment" value="banking" v-model="form.paymentMethod">
                <div class="payment-content">
                  <span class="payment-name">Chuyển khoản ngân hàng</span>
                  <div class="payment-desc" v-if="form.paymentMethod === 'banking'">
                     <p>Ngân hàng: Vietcombank - CN Hà Nội</p>
                     <p>STK: 001100xxxxxxx - Chủ TK: TUAN TRANG CO LTD</p>
                     <p>Nội dung: SĐT + Tên</p>
                  </div>
                </div>
              </label>

              <label class="payment-option">
                <input type="radio" name="payment" value="momo" v-model="form.paymentMethod">
                <div class="payment-content">
                  <span class="payment-name">Ví điện tử MoMo</span>
                </div>
              </label>

            </div>
          </section>

        </div>

        <!-- CỘT PHẢI: TÓM TẮT ĐƠN HÀNG -->
        <div class="col-right">
          <div class="order-summary">
            <h2 class="section-heading">ĐƠN HÀNG CỦA BẠN ({{ cartItems.length }})</h2>
            
            <!-- List sản phẩm -->
            <div class="cart-items-scroll">
              <div class="cart-item" v-for="item in cartItems" :key="item.id">
                <div class="item-img">
                  <img :src="item.image" :alt="item.name">
                  <span class="item-qty">{{ item.quantity }}</span>
                </div>
                <div class="item-info">
                  <h4 class="item-name">{{ item.name }}</h4>
                  <p class="item-variant">{{ item.size }} / {{ item.color }}</p>
                </div>
                <div class="item-price">{{ formatCurrency(item.price * item.quantity) }}</div>
              </div>
            </div>

            <!-- Mã giảm giá -->
            <div class="coupon-box">
              <input type="text" placeholder="Nhập mã giảm giá" v-model="couponCode">
              <button @click="applyCoupon">ÁP DỤNG</button>
            </div>

            <div class="summary-divider"></div>

            <!-- Tính tiền -->
            <div class="cost-row">
              <span>Tạm tính</span>
              <span>{{ formatCurrency(subtotal) }}</span>
            </div>
            <div class="cost-row">
              <span>Phí vận chuyển</span>
              <span>{{ shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee) }}</span>
            </div>
            <div class="cost-row" v-if="discountAmount > 0">
              <span>Giảm giá</span>
              <span class="text-red">- {{ formatCurrency(discountAmount) }}</span>
            </div>

            <div class="summary-divider"></div>

            <div class="total-row">
              <span>TỔNG CỘNG</span>
              <span class="total-price">{{ formatCurrency(finalTotal) }}</span>
            </div>

            <router-link to="/OrderSuccessPage"><button class="btn-checkout" @click="handleCheckout">ĐẶT HÀNG</button></router-link>
            <router-link to="/shoppingCart"><a href="#" class="back-link">← Quay lại giỏ hàng</a></router-link>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router'; // Thêm router để điều hướng

// Khởi tạo router
const router = useRouter();

// 1. DATA FORM
const form = ref({
  name: '',
  phone: '',
  email: '',
  city: '',
  district: '',
  address: '',
  note: '',
  paymentMethod: 'cod'
});

const couponCode = ref('');
const discountAmount = ref(0);

// 2. DATA GIẢ LẬP ĐỊA ĐIỂM
const cities = ref([
  { id: 'HN', name: 'Hà Nội' },
  { id: 'HCM', name: 'TP Hồ Chí Minh' },
  { id: 'DN', name: 'Đà Nẵng' }
]);

const districts = {
  'HN': [{ id: 'BD', name: 'Ba Đình' }, { id: 'HK', name: 'Hoàn Kiếm' }, { id: 'CG', name: 'Cầu Giấy' }],
  'HCM': [{ id: 'Q1', name: 'Quận 1' }, { id: 'Q3', name: 'Quận 3' }, { id: 'TB', name: 'Tân Bình' }],
  'DN': [{ id: 'HC', name: 'Hải Châu' }, { id: 'TK', name: 'Thanh Khê' }]
};

const availableDistricts = computed(() => {
  return form.value.city ? districts[form.value.city] : [];
});

const onCityChange = () => {
  form.value.district = ''; 
};

// 3. DATA GIỎ HÀNG
const cartItems = ref([
  {
    id: 1,
    name: "OD4S439 - Áo len lông ghi",
    price: 659000,
    quantity: 1,
    size: 'M',
    color: 'Ghi đá',
    image: "https://pos.nvncdn.com/af3c03-152482/ps/20251112_kwRZ3ZkLE4.jpeg?v=1762929741"
  },
  {
    id: 2,
    name: "OD4B453 - Áo nhung the",
    price: 599000,
    quantity: 1,
    size: 'S',
    color: 'Đỏ đô',
    image: "https://pos.nvncdn.com/af3c03-152482/ps/20251112_kwRZ3ZkLE4.jpeg?v=1762929741"
  }
]);

// 4. LOGIC TÍNH TIỀN
const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

const shippingFee = computed(() => {
  return subtotal.value > 1000000 ? 0 : 30000; 
});

const finalTotal = computed(() => {
  return subtotal.value + shippingFee.value - discountAmount.value;
});

const formatCurrency = (val) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

// --- CHỨC NĂNG THANH TOÁN ---

const applyCoupon = () => {
  if (couponCode.value === 'ORCHID2025') {
    discountAmount.value = 50000;
    alert("Đã áp dụng mã giảm giá 50k!");
  } else {
    alert("Mã giảm giá không hợp lệ");
    discountAmount.value = 0;
  }
};

// Hàm xử lý thanh toán chính
const handleCheckout = async () => {
  // 1. Validate thông tin bắt buộc
  if (!form.value.name || !form.value.phone || !form.value.address || !form.value.city || !form.value.district) {
    alert("Vui lòng điền đầy đủ thông tin giao hàng bắt buộc!");
    return;
  }

  // Chặn trường hợp giỏ hàng trống
  if (cartItems.value.length === 0) {
    alert("Giỏ hàng của bạn đang trống!");
    return;
  }

  try {
    // 2. Gọi API lấy danh sách users
    const response = await fetch('http://localhost:3000/users');
    const users = await response.json();

    // 3. Tìm user hiện có
    let user = users.find(u => u.phone === form.value.phone || (form.value.email && u.email === form.value.email));
    
    const orderId = "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    const cartId = "CART-" + Math.floor(Math.random() * 1000000);

    // 4. Chuẩn bị chi tiết đơn hàng
    const orderDetails = cartItems.value.map(item => ({
      product_id: item.id,
      product_name: item.name,   // THÊM DÒNG NÀY
  product_image: item.image, // THÊM DÒNG NÀY
      quantity: item.quantity,
      total: item.price * item.quantity,
      payment: form.value.paymentMethod,
      status: form.value.paymentMethod === 'cod' ? 'pending' : 'paid'
    }));

    const newOrder = {
      id: orderId,
      cart_id: cartId,
      order_detail: orderDetails
    };

    // 5. Cập nhật db.json qua API
    if (user) {
      const updatedUser = { ...user, order: [...(user.order || []), newOrder] };
      await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });
    } else {
      const newUser = {
        id: "U-" + Date.now(),
        fullname: form.value.name,
        email: form.value.email || "",
        password: "",
        phone: form.value.phone,
        address: [{ id: "ADDR-1", place_id: `${form.value.address}, ${form.value.district}, ${form.value.city}` }],
        gender: "",
        role: "customer",
        status: "active",
        birthday: "",
        create_At: new Date().toISOString(),
        avatar: "",
        voucher_id: [],
        cart: [],
        order: [newOrder]
      };
      await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
    }

    // 6. QUAN TRỌNG: Lưu thông tin vào LocalStorage ĐỂ TRANG SUCCESS HIỂN THỊ
    // Tạo một bản sao sâu (deep copy) của cartItems để không bị ảnh hưởng khi clear giỏ hàng
    const productsForSuccessPage = JSON.parse(JSON.stringify(cartItems.value));
    
    const infoToSave = {
      customer: {
        fullname: form.value.name,
        phone: form.value.phone,
        address: `${form.value.address}, ${form.value.district}, ${form.value.city}`
      },
      order: newOrder,
      products: productsForSuccessPage // Chứa đầy đủ thông tin Image, Name, Price để render giao diện
    };
    
    localStorage.setItem('last_order_info', JSON.stringify(infoToSave));

    // 7. Kết thúc: Clear giỏ hàng và chuyển trang
    cartItems.value = [];
    // Sử dụng điều hướng của Router thay vì để router-link bao ngoài nút bấm
    router.push('/OrderSuccessPage');

  } catch (error) {
    console.error("Lỗi thanh toán:", error);
    alert("Đã xảy ra lỗi trong quá trình đặt hàng. Vui lòng thử lại!");
  }
};
</script>

<style scoped>
.checkout-container {
  font-family: Arial, sans-serif;
  color: #333;
  background-color: #f9f9f9;
  min-height: 100vh;
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.page-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
  letter-spacing: 1px;
}

/* LAYOUT 2 CỘT */
.checkout-layout {
  display: flex;
  gap: 30px;
}

.col-left { flex: 3; }
.col-right { flex: 2; }

/* SECTIONS */
.section-group {
  background: #fff;
  padding: 25px;
  border: 1px solid #eee;
  margin-bottom: 20px;
  border-radius: 4px;
}

.section-heading {
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

/* FORM STYLES */
.form-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.form-group { margin-bottom: 5px; }
.full-width { width: 100%; }
.half-width { width: calc(50% - 7.5px); }

input, select, textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  font-size: 14px;
  transition: border-color 0.3s;
}

input:focus, select:focus, textarea:focus {
  border-color: #000;
}

textarea { resize: vertical; height: 80px; }

/* PAYMENT METHODS */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.payment-option {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.payment-option:hover { background: #fafafa; }
.payment-option input { width: auto; margin-top: 5px; }

.payment-name {
  display: block;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 5px;
}
.payment-desc {
  font-size: 13px;
  color: #666;
}

/* ORDER SUMMARY (Sticky Sidebar) */
.order-summary {
  background: #fff;
  padding: 25px;
  border: 1px solid #eee;
  position: sticky;
  top: 20px;
  border-radius: 4px;
}

.cart-items-scroll {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 20px;
  padding-right: 5px;
}
/* Scrollbar mảnh */
.cart-items-scroll::-webkit-scrollbar { width: 4px; }
.cart-items-scroll::-webkit-scrollbar-track { background: #f1f1f1; }
.cart-items-scroll::-webkit-scrollbar-thumb { background: #ccc; }

.cart-item {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f9f9f9;
}

.item-img {
  position: relative;
  width: 60px;
  height: 80px;
  border: 1px solid #eee;
}
.item-img img { width: 100%; height: 100%; object-fit: cover; }
.item-qty {
  position: absolute;
  top: -8px; right: -8px;
  background: #666;
  color: #fff;
  width: 20px; height: 20px;
  border-radius: 50%;
  font-size: 11px;
  display: flex; align-items: center; justify-content: center;
}

.item-info { flex: 1; }
.item-name { font-size: 13px; font-weight: bold; margin: 0 0 5px 0; }
.item-variant { font-size: 12px; color: #888; }
.item-price { font-size: 13px; font-weight: bold; }

/* COUPON */
.coupon-box {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.coupon-box input { flex: 1; margin: 0; }
.coupon-box button {
  background: #eee;
  border: 1px solid #ddd;
  padding: 0 15px;
  cursor: pointer;
  font-weight: bold;
  color: #555;
  transition: all 0.2s;
}
.coupon-box button:hover { background: #ddd; color: #000; }

.summary-divider {
  border-top: 1px solid #eee;
  margin: 15px 0;
}

/* TOTALS */
.cost-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  color: #555;
}
.text-red { color: #d0011b; }

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  font-size: 16px;
  color: #000;
}
.total-price {
  font-size: 22px;
  font-weight: bold;
  color: #d0011b;
}

.btn-checkout {
  width: 100%;
  background: #000;
  color: #fff;
  padding: 15px;
  border: none;
  font-size: 15px;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.3s;
}
.btn-checkout:hover { background: #333; }

.back-link {
  display: block;
  text-align: center;
  margin-top: 15px;
  font-size: 13px;
  color: #666;
  text-decoration: none;
}
.back-link:hover { color: #000; text-decoration: underline; }

/* RESPONSIVE */
@media (max-width: 900px) {
  .checkout-layout { flex-direction: column; }
  .col-right { order: -1; } /* Đưa tóm tắt lên đầu trên mobile */
}

@media (max-width: 600px) {
  .half-width { width: 100%; }
}
</style>