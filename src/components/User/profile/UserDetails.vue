<template>
    <div class="user-details-card">
        <h2>Hồ sơ của tôi</h2>
        <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
        <hr>

        <form v-if="localUser" @submit.prevent="handleUpdateProfile">
            <div class="form-row">
                <div class="form-group">
                    <label for="fullname">Họ và tên</label>
                    <input id="fullname" type="text" v-model="localUser.fullname">
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input id="email" type="email" :value="localUser.email" disabled title="Không thể thay đổi email">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="phone">Số điện thoại</label>
                    <input id="phone" type="text" v-model="localUser.phone">
                </div>
                <div class="form-group">
                    <label for="birthday">Ngày sinh</label>
                    <input id="birthday" type="date" v-model="localUser.birthday">
                </div>
            </div>

            <div class="form-group">
                <label>Giới tính</label>
                <div class="radio-group">
                    <input type="radio" id="male" value="Nam" v-model="localUser.gender">
                    <label for="male">Nam</label>
                    <input type="radio" id="female" value="Nữ" v-model="localUser.gender">
                    <label for="female">Nữ</label>
                    <input type="radio" id="other" value="Khác" v-model="localUser.gender">
                    <label for="other">Khác</label>
                </div>
            </div>

            <button type="submit" class="btn-save" :disabled="isSaving">
                {{ isSaving ? 'Đang lưu...' : 'Lưu thay đổi' }}
            </button>
            <p v-if="saveSuccess" class="save-success-message">
                Đã cập nhật thành công!
            </p>
        </form>

        <div v-else>
            <p>Không có dữ liệu người dùng.</p>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    user: Object
});

const localUser = ref(null);
const isSaving = ref(false);
const saveSuccess = ref(false);

const API_URL = 'http://localhost:3000';

watch(() => props.user, (newUser) => {
    if (newUser) {
        localUser.value = JSON.parse(JSON.stringify(newUser));
    } else {
        localUser.value = null;
    }
}, { immediate: true });

</script>

<style scoped>
.user-details-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 24px;
    background-color: #fff;
}

.user-details-card h2 {
    margin-top: 0;
}

hr {
    border: 0;
    border-top: 1px solid #eee;
    margin: 16px 0;
}

.form-row {
    display: flex;
    gap: 20px;
    width: 100%;
}

.form-group {
    flex: 1;
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    font-size: 0.9em;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="date"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

.form-group input[disabled] {
    background: #f1f1f1;
    cursor: not-allowed;
}

.radio-group {
    display: flex;
    align-items: center;
    gap: 15px;
}

.radio-group input {
    margin-right: 5px;
}

.btn-save {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
}

.btn-save:hover {
    background-color: #0056b3;
}

.btn-save:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.save-success-message {
    color: green;
    font-weight: bold;
    margin-top: 10px;
}
</style>