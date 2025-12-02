<template>
  <div class="product-management-container">
    <div class="header-actions">
      <h4 class="fw-bold text-primary mb-0">Thêm Mới Cửa Hàng</h4>
      <button class="btn btn-back" @click="goBack">
        <i class="bi bi-arrow-left"></i> Quay lại
      </button>
    </div>

    <div class="form-card">
      <form @submit.prevent="handleSubmit">
        
        <div class="card-body">
          <h5 class="section-title"><i class="bi bi-info-circle"></i> Thông Tin Cửa Hàng</h5>
          
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label">Tên Cửa Hàng <span class="required">*</span></label>
                <div class="input-group">
                  <span class="input-icon"><i class="bi bi-shop"></i></span>
                  <input 
                    type="text" 
                    v-model="form.name" 
                    class="form-control" 
                    placeholder="Ví dụ: Poly-Smartshop HCM..." 
                    required
                  >
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Email Liên Hệ <span class="required">*</span></label>
                <div class="input-group">
                  <span class="input-icon"><i class="bi bi-envelope"></i></span>
                  <input 
                    type="email" 
                    v-model="form.email" 
                    class="form-control" 
                    placeholder="contact@store.com" 
                    required
                  >
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Số Điện Thoại</label>
                <div class="input-group">
                  <span class="input-icon"><i class="bi bi-telephone"></i></span>
                  <input 
                    type="text" 
                    v-model="form.phone" 
                    class="form-control" 
                    placeholder="0988..."
                  >
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label">Địa Chỉ <span class="required">*</span></label>
                <div class="input-group">
                  <span class="input-icon"><i class="bi bi-geo-alt"></i></span>
                  <input 
                    type="text" 
                    v-model="form.address" 
                    class="form-control" 
                    placeholder="Số nhà, đường, quận/huyện..." 
                    required
                  >
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Trạng Thái</label>
                <div class="input-group">
                  <span class="input-icon"><i class="bi bi-toggle-on"></i></span>
                  <select v-model="form.status" class="form-control">
                    <option value="active">Đang Mở</option>
                    <option value="closed">Đóng Cửa</option>
                    <option value="maintenance">Bảo Trì</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="form-group mt-3">
            <label class="form-label">Mô Tả / Ghi Chú</label>
            <textarea 
              v-model="form.description" 
              class="form-control textarea-custom" 
              rows="3" 
              placeholder="Ghi chú thêm về cửa hàng này..."
            ></textarea>
          </div>
        </div>

        <div class="card-footer">
          <button type="button" class="btn btn-cancel" @click="goBack">Hủy Bỏ</button>
          <button type="submit" class="btn btn-save">
            <i class="bi bi-check-lg"></i> Lưu Cửa Hàng
          </button>
        </div>

      </form>
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
  const newStoreData = {
    id: "STORE-" + Math.floor(Math.random() * 10000),
    ...form,
    created_at: new Date().toISOString()
  };

  console.log("=== DỮ LIỆU CHUẨN BỊ GỬI ĐI ===");
  console.log(JSON.stringify(newStoreData, null, 2));

  alert("Đã thêm cửa hàng thành công! (Kiểm tra Console log)");

};

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>

.product-management-container {
  padding: 5px;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
  background-color: #f8f9fa; 
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding: 0 5px;
}

.header-actions h4 {
  margin: 0;
  text-align: left;
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e2a78;
  border-bottom: 3px solid #6c63ff;
  display: inline-block;
  padding-bottom: 5px;
}
.form-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.08); 
  border: 1px solid #eaeaea;;
  margin: 0 auto; 
  overflow: hidden;
}

.card-body {
  padding: 30px;
}

.section-title {
  color: #6c63ff;
  font-weight: 600;
  margin-bottom: 25px;
  font-size: 1.1rem;
  border-bottom: 1px dashed #eee;
  padding-bottom: 10px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}

.col-md-6 {
  flex: 0 0 50%;
  max-width: 50%;
  padding-right: 15px;
  padding-left: 15px;
  box-sizing: border-box;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.required { color: #f44336; }

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  color: #adb5bd;
  font-size: 1.1rem;
  z-index: 2;
}

.form-control {
  width: 100%;
  padding: 10px 15px 10px 40px; 
  font-size: 14px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  transition: all 0.2s;
  box-sizing: border-box;
}

.form-control:focus {
  border-color: #6c63ff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.15);
}

.textarea-custom {
  padding: 10px 15px;
  resize: vertical;
}


.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}


.btn-back {
  background-color: white;
  border: 1px solid #ddd;
  color: #555;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.btn-back:hover { background-color: #f1f1f1; }

.card-footer {
  background-color: #f8f9fa;
  padding: 20px 30px;
  display: flex;
  justify-content: flex-end; 
  gap: 10px;
  border-top: 1px solid #eaeaea;
}

.btn-cancel {
  background: transparent;
  color: #666;
}
.btn-cancel:hover { color: #333; background-color: rgba(0,0,0,0.05); }

.btn-save {
  background-color: #6c63ff;
  color: white;
  padding: 10px 20px;
  box-shadow: 0 4px 6px rgba(108, 99, 255, 0.3);
}
.btn-save:hover {
  background-color: #5a54e5;
  box-shadow: 0 6px 10px rgba(108, 99, 255, 0.4);
}

@media (max-width: 768px) {
  .col-md-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style>