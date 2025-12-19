<template>
  <div class="admin-container">
    <!-- HEADER ACTION -->
    <div class="page-header">
      <div class="header-left">
        <button class="btn-back" @click="goBack">
          <i class="bi bi-arrow-left"></i>
        </button>
        <div>
          <h2 class="page-title">Thêm Mới Cửa Hàng</h2>
          <p class="text-muted">Quản lý thông tin chi nhánh và điểm bán</p>
        </div>
      </div>
      <div class="header-right">
        <button class="btn-outline-custom" @click="goBack">Hủy bỏ</button>
        <button class="btn-primary-custom" @click="handleSubmit">
          <i class="bi bi-check2-circle"></i> Lưu Cửa Hàng
        </button>
      </div>
    </div>

    <!-- FORM LAYOUT -->
    <div class="form-layout">
      
      <!-- LEFT COLUMN: MAIN INFO -->
      <div class="col-left">
        
        <!-- 1. General Info -->
        <div class="card-box">
          <h4 class="card-title">Thông tin chung</h4>
          
          <div class="form-group">
            <label class="form-label">Tên cửa hàng <span class="text-red">*</span></label>
            <div class="input-wrapper">
                <span class="input-prefix"><i class="bi bi-shop"></i></span>
                <input type="text" v-model="form.name" class="form-input pl-40" placeholder="Ví dụ: Poly-Smartshop HCM..." />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Mô tả / Ghi chú</label>
            <textarea v-model="form.description" class="form-textarea" rows="4" placeholder="Nhập ghi chú hoặc giới thiệu về cửa hàng này..."></textarea>
          </div>
        </div>

        <!-- 2. Address -->
        <div class="card-box mt-4">
            <h4 class="card-title">Địa chỉ & Vị trí</h4>
            <div class="form-group">
                <label class="form-label">Địa chỉ chi tiết <span class="text-red">*</span></label>
                <div class="input-wrapper">
                    <span class="input-prefix"><i class="bi bi-geo-alt"></i></span>
                    <input type="text" v-model="form.address" class="form-input pl-40" placeholder="Số nhà, đường, quận/huyện..." />
                </div>
            </div>
        </div>

      </div>

      <!-- RIGHT COLUMN: CONTACT & STATUS -->
      <div class="col-right">
        
        <!-- Contact Info -->
        <div class="card-box">
          <h4 class="card-title">Thông tin liên hệ</h4>
          
          <div class="form-group">
             <label class="form-label">Email <span class="text-red">*</span></label>
             <div class="input-wrapper">
                 <span class="input-prefix"><i class="bi bi-envelope"></i></span>
                 <input type="email" v-model="form.email" class="form-input pl-40" placeholder="contact@store.com" />
             </div>
          </div>

          <div class="form-group">
             <label class="form-label">Số điện thoại</label>
             <div class="input-wrapper">
                 <span class="input-prefix"><i class="bi bi-telephone"></i></span>
                 <input type="text" v-model="form.phone" class="form-input pl-40" placeholder="0988..." />
             </div>
          </div>
        </div>

        <!-- Status -->
        <div class="card-box mt-4">
            <h4 class="card-title">Trạng thái hoạt động</h4>
            
            <div class="status-selection">
                <label class="status-option" :class="{ active: form.status === 'active' }">
                    <input type="radio" v-model="form.status" value="active" hidden>
                    <span class="dot success"></span>
                    <span>Đang hoạt động</span>
                    <i class="bi bi-check-lg ms-auto" v-if="form.status === 'active'"></i>
                </label>

                <label class="status-option" :class="{ active: form.status === 'maintenance' }">
                    <input type="radio" v-model="form.status" value="maintenance" hidden>
                    <span class="dot warning"></span>
                    <span>Bảo trì</span>
                    <i class="bi bi-check-lg ms-auto" v-if="form.status === 'maintenance'"></i>
                </label>

                <label class="status-option" :class="{ active: form.status === 'closed' }">
                    <input type="radio" v-model="form.status" value="closed" hidden>
                    <span class="dot danger"></span>
                    <span>Đóng cửa</span>
                    <i class="bi bi-check-lg ms-auto" v-if="form.status === 'closed'"></i>
                </label>
            </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = reactive({
  name: '',
  address: '',
  email: '',
  phone: '',
  status: 'active',
  description: ''
});

const handleSubmit = () => {
    // Basic validation
    if(!form.name || !form.email || !form.address) {
        return alert("Vui lòng điền đầy đủ các trường bắt buộc (*)");
    }

    const newStoreData = {
        id: "STORE-" + Math.floor(Math.random() * 10000),
        ...form,
        created_at: new Date().toISOString()
    };

    console.log("=== SUBMITTING ===", JSON.stringify(newStoreData, null, 2));
    alert("Đã thêm cửa hàng thành công!");
};

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push('/');
  }
};
</script>

<style scoped>
/* --- BASE STYLE --- */
.admin-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #f3f4f6;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #374151;
}

/* HEADER */
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
.header-left { display: flex; align-items: center; gap: 15px; }
.btn-back {
  width: 40px; height: 40px; border-radius: 50%; border: 1px solid #e5e7eb; background: white;
  cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; color: #6b7280; transition: all 0.2s;
}
.btn-back:hover { background: #f9fafb; color: #111; transform: translateX(-2px); }
.page-title { margin: 0; font-size: 24px; font-weight: 700; color: #111; }
.text-muted { color: #9ca3af; font-size: 13px; margin: 2px 0 0 0; }
.header-right { display: flex; gap: 10px; }

/* BUTTONS */
.btn-primary-custom {
  background: #2563eb; color: white; border: none; padding: 10px 24px;
  border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s;
  box-shadow: 0 2px 5px rgba(37, 99, 235, 0.2);
}
.btn-primary-custom:hover { background: #1d4ed8; transform: translateY(-1px); }
.btn-outline-custom {
  background: white; border: 1px solid #d1d5db; color: #374151; padding: 10px 20px;
  border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s;
}
.btn-outline-custom:hover { background: #f9fafb; border-color: #9ca3af; }

/* LAYOUT GRID */
.form-layout { display: grid; grid-template-columns: 2fr 1.2fr; gap: 25px; }
@media (max-width: 1024px) { .form-layout { grid-template-columns: 1fr; } }

/* CARDS */
.card-box { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.02); }
.card-title { margin: 0 0 20px 0; font-size: 16px; font-weight: 700; color: #1f2937; border-bottom: 1px solid #f3f4f6; padding-bottom: 15px; }
.mt-4 { margin-top: 25px; }

/* INPUTS */
.form-group { margin-bottom: 20px; }
.form-label { display: block; font-size: 13px; font-weight: 600; color: #4b5563; margin-bottom: 6px; }
.text-red { color: #ef4444; }
.form-input, .form-textarea {
  width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px;
  font-size: 14px; color: #111; outline: none; transition: all 0.2s; background: #fff;
}
.form-input:focus, .form-textarea:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }

/* INPUT WITH ICON */
.input-wrapper { position: relative; }
.input-prefix {
  position: absolute; left: 1px; top: 1px; bottom: 1px; width: 40px;
  display: flex; align-items: center; justify-content: center;
  color: #9ca3af; font-size: 16px; border-right: 1px solid transparent;
}
.form-input.pl-40 { padding-left: 40px; }

/* STATUS SELECTION */
.status-selection { display: flex; flex-direction: column; gap: 8px; }
.status-option {
    display: flex; align-items: center; gap: 10px; padding: 12px 15px;
    border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; transition: 0.2s;
    font-size: 14px; color: #374151; font-weight: 500;
}
.status-option:hover { background: #f9fafb; border-color: #d1d5db; }
.status-option.active { border-color: #2563eb; background: #eff6ff; color: #2563eb; }

.dot { width: 10px; height: 10px; border-radius: 50%; display: block; }
.dot.success { background-color: #10b981; }
.dot.warning { background-color: #f59e0b; }
.dot.danger { background-color: #ef4444; }

.ms-auto { margin-left: auto; }

</style>