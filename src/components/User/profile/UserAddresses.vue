<template>
  <div class="user-addresses-card">
    
    <div v-if="!showAddForm">
      <div class="header">
        <h2>Sổ địa chỉ</h2>
        <button class="btn-add" @click="showAddForm = true">+ Thêm địa chỉ mới</button>
      </div>
      <p>Quản lý địa chỉ nhận hàng của bạn</p>
      <hr>

      <div v-if="user && user.address && user.address.length > 0" class="address-list">
        <div v-for="address in user.address" :key="address.id" class="address-item">
          <div v-if="getPlaceDetails(address.place_id)" class="address-content">
            <div class="item-header">
              <strong>{{ getPlaceDetails(address.place_id).name }}</strong>
              <span v-if="address.id === user.address[0].id" class="default-badge">
                Mặc định
              </span>
            </div>
            <p class="phone">{{ getPlaceDetails(address.place_id).phone }}</p>
            <p class="address-full">
              {{ getPlaceDetails(address.place_id).place_detail }}, 
              {{ getPlaceDetails(address.place_id).commune }}, 
              {{ getPlaceDetails(address.place_id).province }}
            </p>
          </div>
          <div v-else class="address-content">
            <p>Lỗi: Không tìm thấy chi tiết địa chỉ (ID: {{ address.place_id }})</p>
          </div>
          <div class="item-actions">
            <button class="btn-action">Sửa</button>
            <button class="btn-action btn-delete">Xóa</button>
          </div>
        </div>
      </div>
      <div v-else>
        <p>Bạn chưa có địa chỉ nào.</p>
      </div>
    </div>

    <div v-else>
      <div class="header">
        <h2>Địa chỉ mới</h2>
        <button class="btn-cancel" @click="handleCancel">Hủy</button>
      </div>
      <p>Vui lòng điền thông tin bên dưới</p>
      <hr>

      <form @submit.prevent="handleSaveNewAddress">
        <div class="form-group">
          <label for="name">Họ và tên</label>
          <input type="text" id="name" v-model="newAddress.name" placeholder="Nguyễn Văn A">
        </div>
        <div class="form-group">
          <label for="phone">Số điện thoại</label>
          <input type="text" id="phone" v-model="newAddress.phone" placeholder="0901234567">
        </div>
        <div class="form-group">
          <label for="province">Tỉnh/Thành phố</label>
          <input type="text" id="province" v-model="newAddress.province" placeholder="TP. Cần Thơ">
        </div>
        <div class="form-group">
          <label for="commune">Quận/Huyện/Xã</label>
          <input type="text" id="commune" v-model="newAddress.commune" placeholder="Quận Ninh Kiều">
        </div>
        <div class="form-group">
          <label for="detail">Địa chỉ cụ thể</label>
          <input type="text" id="detail" v-model="newAddress.place_detail" placeholder="Số 1, Đường A, Phường B">
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn-save">Lưu</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'; 

const props = defineProps({
  user: Object,
  lookupData: Object
});

const showAddForm = ref(false);

const newAddress = ref({
  name: '',
  phone: '',
  province: '',
  commune: '',
  place_detail: ''
});

const resetForm = () => {
  newAddress.value = {
    name: '',
    phone: '',
    province: '',
    commune: '',
    place_detail: ''
  };
};

const handleCancel = () => {
  showAddForm.value = false;
  resetForm(); 
};

const getPlaceDetails = (placeId) => {
  if (!props.lookupData || !props.lookupData.places) return null;
  return props.lookupData.places.find(p => p.id === placeId);
};
</script>

<style scoped>
.user-addresses-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 24px;
  background-color: #fff;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0;
}
.header h2 { margin: 0; }
.btn-add {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
}
hr {
  border: 0;
  border-top: 1px solid #eee;
  margin: 16px 0;
}
.address-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.address-item {
  border: 1px solid #f0f0f0;
  border-radius: 5px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
}
.address-content { flex: 1; }
.item-header { margin-bottom: 8px; }
.item-header strong { font-size: 1.1em; }
.default-badge {
  background-color: #f0f0f0;
  color: #555;
  font-size: 0.8em;
  padding: 3px 6px;
  border-radius: 3px;
  margin-left: 10px;
}
.phone,
.address-full {
  color: #555;
  margin: 5px 0;
}
.item-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 15px;
}
.btn-action {
  background: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
}
.btn-delete { color: red; border-color: red; }

.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
.form-group input[type="text"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
.btn-save {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.btn-save:hover {
  background-color: #0056b3;
}
.btn-cancel {
  background-color: #6c757d;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.header .btn-cancel {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
}
</style>