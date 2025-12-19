<template>
  <div class="admin-container">
    <div class="page-header">
      <div class="header-left">
        <button class="btn-back" @click="cancel">
          <i class="bi bi-arrow-left"></i>
        </button>
        <div>
          <h2 class="page-title">
            {{ isEditMode ? "Cập Nhật Người Dùng" : "Thêm Người Dùng Mới" }}
          </h2>
          <p class="text-muted">Quản lý thông tin tài khoản và phân quyền</p>
        </div>
      </div>
      <div class="header-right">
        <button class="btn-outline-custom" @click="cancel">Hủy bỏ</button>
        <button class="btn-primary-custom" @click="save">
          <i class="bi bi-check2-circle"></i> Lưu lại
        </button>
      </div>
    </div>

    <div class="form-layout">
      <div class="col-left">
        <div class="card-box">
          <h4 class="card-title">Thông tin cá nhân</h4>

          <div class="form-row">
            <div class="form-group half">
              <label class="form-label"
                >Họ và tên <span class="text-red">*</span></label
              >
              <input
                type="text"
                v-model="form.fullname"
                class="form-input"
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div class="form-group half">
              <label class="form-label"
                >Số điện thoại <span class="text-red">*</span></label
              >
              <input
                type="text"
                v-model="form.phone"
                class="form-input"
                placeholder="09xxxxxxxx"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label class="form-label"
                >Email <span class="text-red">*</span></label
              >
              <input
                type="email"
                v-model="form.email"
                class="form-input"
                placeholder="example@gmail.com"
              />
            </div>
            <div class="form-group half">
              <label class="form-label">Ngày sinh</label>
              <input type="date" v-model="form.birthday" class="form-input" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Giới tính</label>
            <div class="gender-options">
              <label class="radio-label">
                <input type="radio" v-model="form.gender" value="1" /> Nam
              </label>
              <label class="radio-label">
                <input type="radio" v-model="form.gender" value="0" /> Nữ
              </label>
              <label class="radio-label">
                <input type="radio" v-model="form.gender" value="2" /> Khác
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Địa chỉ</label>
            <textarea
              v-model="form.addressStr"
              class="form-textarea"
              rows="2"
              placeholder="Số nhà, đường, phường/xã..."
            ></textarea>
          </div>
        </div>

        <div class="card-box mt-4">
          <h4 class="card-title">Bảo mật</h4>
          <div class="form-group">
            <label class="form-label"
              >Mật khẩu
              {{ isEditMode ? "(Bỏ trống nếu không đổi)" : "*" }}</label
            >
            <input
              type="password"
              v-model="form.password"
              class="form-input"
              placeholder="••••••"
            />
          </div>
          <div class="form-group" v-if="!isEditMode">
            <label class="form-label">Xác nhận mật khẩu</label>
            <input
              type="password"
              v-model="form.confirmPassword"
              class="form-input"
              placeholder="••••••"
            />
          </div>
        </div>
      </div>

      <div class="col-right">
        <div class="card-box">
          <h4 class="card-title">Ảnh đại diện</h4>
          <div class="avatar-upload-zone" @click="triggerUpload">
            <img
              v-if="previewAvatar"
              :src="previewAvatar"
              class="avatar-preview"
            />
            <div v-else class="upload-placeholder">
              <i class="bi bi-camera"></i>
              <span>Tải ảnh</span>
            </div>
            <input
              type="file"
              ref="fileInput"
              class="d-none"
              accept="image/*"
              @change="handleFileUpload"
            />
          </div>
          <div class="text-center mt-2">
            <button
              v-if="previewAvatar"
              class="btn-text-red"
              @click.stop="removeAvatar"
            >
              Xóa ảnh
            </button>
          </div>
        </div>

        <div class="card-box mt-4">
          <h4 class="card-title">Phân quyền & Trạng thái</h4>

          <div class="form-group">
            <label class="form-label">Vai trò (Role)</label>
            <select v-model="form.role" class="form-input">
              <option value="0">Khách hàng (User)</option>
              <option value="1">Quản trị viên (Admin)</option>
              <option value="2">Nhân viên (Staff)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Trạng thái</label>
            <div class="status-selection">
              <label
                class="status-option"
                :class="{ active: form.status === 'active' }"
              >
                <input
                  type="radio"
                  v-model="form.status"
                  value="active"
                  hidden
                />
                <span class="dot success"></span>
                <span>Hoạt động</span>
                <i
                  class="bi bi-check-lg ms-auto"
                  v-if="form.status === 'active'"
                ></i>
              </label>
              <label
                class="status-option"
                :class="{ active: form.status === 'suspended' }"
              >
                <input
                  type="radio"
                  v-model="form.status"
                  value="suspended"
                  hidden
                />
                <span class="dot danger"></span>
                <span>Bị khóa</span>
                <i
                  class="bi bi-check-lg ms-auto"
                  v-if="form.status === 'suspended'"
                ></i>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const API_URL = 'http://localhost:3000/users';

const isEditMode = computed(() => !!route.query.id);
const previewAvatar = ref(null);
const fileInput = ref(null);

const form = reactive({
  id: null,
  fullname: '',
  email: '',
  phone: '',
  password: '',
  gender: '1',
  role: '0',
  status: 'active',
  addressStr: '',
  avatar: ''
});

<<<<<<< Updated upstream
onMounted(async () => {
  if (isEditMode.value) {
    try {
      const response = await axios.get(`${API_URL}/${route.query.id}`);
      const data = response.data;
      Object.assign(form, data);
      if (Array.isArray(data.address) && data.address.length > 0) {
          form.addressStr = data.address[0].place_id;
      }
      previewAvatar.value = data.avatar;
    } catch (error) { 
        console.error("Lỗi tải dữ liệu user:", error);
        alert("Không tìm thấy dữ liệu người dùng hoặc Server chưa chạy (Port 3000).");
=======
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

onMounted(() => {
  if (isEditMode.value) {
    const userId = parseInt(route.query.id);
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userFound = users.find(u => u.id === userId);

    if (userFound) {
      form.id = userFound.id;
      form.fullname = userFound.name;
      form.email = userFound.email;
      form.phone = userFound.phone;
      form.role = String(userFound.role);
      form.status = userFound.status;
      form.gender = String(userFound.gender || '1');
      form.birthday = userFound.birthday || '';
      form.addressStr = userFound.address || '';
      
      if (userFound.avatar) {
        form.avatar = userFound.avatar;
        previewAvatar.value = userFound.avatar;
      }
>>>>>>> Stashed changes
    }
  }
});

const save = async () => {
  if (!form.fullname || !form.email) return alert("Nhập đủ thông tin!");
  
  const userData = {
    ...form,
    address: [{ id: Date.now(), place_id: form.addressStr }]
  };

<<<<<<< Updated upstream
  try {
    if (isEditMode.value) {
      await axios.put(`${API_URL}/${route.query.id}`, userData);
      alert("Cập nhật thành công!");
    } else {
      await axios.post(API_URL, { 
        ...userData, 
        totalSpend: 0, 
        orderCount: 0, 
        joinDate: new Date().toLocaleDateString('vi-VN') 
      });
      alert("Thêm mới thành công!");
    }
    router.push({ name: 'user' }); 
  } catch (error) { 
    console.error("Chi tiết lỗi:", error);
    if (error.code === "ERR_NETWORK" || error.code === "ERR_CONNECTION_REFUSED") {
        alert("Không thể kết nối đến Server! Hãy kiểm tra xem JSON Server (Port 3000) đã bật chưa.");
    } else {
        alert("Lỗi khi lưu: " + error.message);
=======
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    previewAvatar.value = URL.createObjectURL(file);
    try {
      const base64 = await fileToBase64(file);
      form.avatar = base64;
    } catch (e) {
      console.error("Lỗi xử lý ảnh", e);
>>>>>>> Stashed changes
    }
  }
};

<<<<<<< Updated upstream
const cancel = () => {
  router.push({ name: 'user' });
=======
const removeAvatar = () => {
  previewAvatar.value = null;
  form.avatar = '';
  if(fileInput.value) fileInput.value.value = '';
};

const save = () => {
  if (!form.fullname || !form.email) return alert("Vui lòng nhập họ tên và email!");
  if (!isEditMode.value && !form.password) return alert("Vui lòng nhập mật khẩu!");

  const users = JSON.parse(localStorage.getItem('users') || '[]');

  if (isEditMode.value) {
    const index = users.findIndex(u => u.id === form.id);
    if (index !== -1) {
      users[index] = {
        ...users[index],
        name: form.fullname,
        email: form.email,
        phone: form.phone,
        role: form.role,
        status: form.status,
        gender: form.gender,
        birthday: form.birthday,
        address: form.addressStr,
        avatar: form.avatar,
        password: form.password ? form.password : users[index].password 
      };
      alert("Cập nhật thành công!");
    }
  } else {
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = {
      id: newId,
      name: form.fullname,
      email: form.email,
      phone: form.phone,
      role: form.role,
      status: form.status,
      gender: form.gender,
      birthday: form.birthday,
      address: form.addressStr,
      password: form.password,
      avatar: form.avatar || ''
    };
    users.unshift(newUser); 
    alert("Thêm người dùng mới thành công!");
  }

  localStorage.setItem('users', JSON.stringify(users));

  router.push({ name: 'user-list' }); 
>>>>>>> Stashed changes
};

const triggerUpload = () => fileInput.value.click();
const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "DAX_BE"); 

  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dm623a8ue/image/upload",
      formData
    );

    form.avatar = res.data.secure_url; 
    previewAvatar.value = res.data.secure_url;
    
    console.log("Đã upload xong:", res.data.secure_url);

  } catch (error) {
    console.error("Lỗi upload ảnh:", error);
    alert("Upload ảnh lên Cloud thất bại!");
  }
};
const removeAvatar = () => { previewAvatar.value = null; form.avatar = ''; };
</script>

<style scoped>
.admin-container {
  padding: 20px;
  background: #f3f4f6;
  min-height: 100vh;
  font-family: -apple-system, sans-serif;
  color: #374151;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.btn-back {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #e5e7eb;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #6b7280;
  transition: 0.2s;
}
.btn-back:hover {
  background: #f9fafb;
  color: #111;
}
.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #111;
}
.text-muted {
  color: #9ca3af;
  font-size: 13px;
  margin: 2px 0 0 0;
}
.btn-primary-custom {
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-primary-custom:hover {
  background: #1d4ed8;
}
.btn-outline-custom {
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}
.btn-outline-custom:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}
.form-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 25px;
}
.card-box {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
.card-title {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 700;
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 15px;
}
.mt-4 {
  margin-top: 25px;
}
.form-group {
  margin-bottom: 20px;
}
.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 6px;
}
.text-red {
  color: #ef4444;
}
.form-input,
.form-textarea,
select.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: 0.2s;
  background: #fff;
}
.form-input:focus,
.form-textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
.form-row {
  display: flex;
  gap: 20px;
}
.half {
  flex: 1;
}
.gender-options {
  display: flex;
  gap: 20px;
  padding-top: 5px;
}
.radio-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
}
.status-selection {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.status-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
  font-size: 14px;
  font-weight: 500;
}
.status-option:hover {
  background: #f9fafb;
}
.status-option.active {
  border-color: #2563eb;
  background: #eff6ff;
  color: #2563eb;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.dot.success {
  background-color: #10b981;
}
.dot.danger {
  background-color: #ef4444;
}
.ms-auto {
  margin-left: auto;
}
.avatar-upload-zone {
  width: 150px;
  height: 150px;
  margin: 0 auto;
  border-radius: 50%;
  border: 2px dashed #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  background: #f9fafb;
}
.avatar-upload-zone:hover {
  border-color: #2563eb;
  background: #eff6ff;
}
.avatar-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.upload-placeholder {
  text-align: center;
  color: #9ca3af;
}
.upload-placeholder i {
  font-size: 24px;
  display: block;
  margin-bottom: 2px;
}
.upload-placeholder span {
  font-size: 12px;
}
.btn-text-red {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 13px;
  cursor: pointer;
  text-decoration: underline;
}
.d-none {
  display: none;
}
.text-center {
  text-align: center;
}
</style>