<template>
    <div class="container my-5" style="max-width: 600px">
        <div class="card p-4 shadow-sm">
            <h2 class="text-center text-primary mb-4">Đăng ký tài khoản</h2>

            <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                    <label for="email" class="form-label">Email (dùng để đăng nhập) *</label>
                    <input type="email" class="form-control" id="email" v-model="formData.email"
                        @input="errors.email = ''" :class="{ 'is-invalid': errors.email }" />
                    <div v-if="errors.email" class="invalid-feedback">
                        {{ errors.email }}
                    </div>
                </div>

                <div class="mb-3">
                    <label for="password" class="form-label">Mật khẩu *</label>
                    <input type="password" class="form-control" id="password" v-model="formData.password"
                        @input="errors.password = ''" :class="{ 'is-invalid': errors.password }" />
                    <div v-if="errors.password" class="invalid-feedback">
                        {{ errors.password }}
                    </div>
                </div>

                <div class="mb-3">
                    <label for="passwordConfirm" class="form-label">Xác nhận Mật khẩu *</label>
                    <input type="password" class="form-control" id="passwordConfirm" v-model="formData.passwordConfirm"
                        @input="errors.passwordConfirm = ''" :class="{ 'is-invalid': errors.passwordConfirm }" />
                    <div v-if="errors.passwordConfirm" class="invalid-feedback">
                        {{ errors.passwordConfirm }}
                    </div>
                </div>

                <div class="mb-3">
                    <label for="fullName" class="form-label">Họ và tên *</label>
                    <input type="text" class="form-control" id="fullName" v-model="formData.fullName"
                        @input="errors.fullName = ''" :class="{ 'is-invalid': errors.fullName }" />
                    <div v-if="errors.fullName" class="invalid-feedback">
                        {{ errors.fullName }}
                    </div>
                </div>

                <div class="mb-3">
                    <label for="phone" class="form-label">Điện thoại *</label>
                    <input type="tel" class="form-control" id="phone" v-model="formData.phone" @input="validatePhone"
                        :class="{ 'is-invalid': errors.phone }" />
                    <div v-if="errors.phone" class="invalid-feedback">
                        {{ errors.phone }}
                    </div>
                </div>

                <div class="mb-3">
                    <label for="city" class="form-label">Thành phố *</label>
                    <select class="form-select" id="city" v-model="formData.city" @change="errors.city = ''"
                        :class="{ 'is-invalid': errors.city }">
                        <option value="" disabled>-- Chọn Tỉnh/Thành phố --</option>
                        <option v-for="city in cities" :key="city" :value="city">
                            {{ city }}
                        </option>
                    </select>
                    <div v-if="errors.city" class="invalid-feedback">
                        {{ errors.city }}
                    </div>
                </div>

                <div class="mb-3">
                    <label for="district" class="form-label">Quận Huyện *</label>
                    <select class="form-select" id="district" v-model="formData.district" :disabled="!formData.city"
                        @change="errors.district = ''" :class="{ 'is-invalid': errors.district }">
                        <option value="" disabled>-- Chọn Quận/Huyện --</option>
                        <option v-for="district in availableDistricts" :key="district" :value="district">
                            {{ district }}
                        </option>
                    </select>
                    <div v-if="errors.district" class="invalid-feedback">
                        {{ errors.district }}
                    </div>
                </div>

                <div class="mb-3">
                    <label for="address" class="form-label">Địa chỉ (Số nhà, đường) *</label>
                    <input type="text" class="form-control" id="address" v-model="formData.address"
                        placeholder="Số nhà, tên đường, phường/xã..." @input="errors.address = ''"
                        :class="{ 'is-invalid': errors.address }" />
                    <div v-if="errors.address" class="invalid-feedback">
                        {{ errors.address }}
                    </div>
                </div>

                <button typeS="submit" class="btn btn-primary w-100 mt-3" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"
                        aria-hidden="true"></span>
                    {{ loading ? "Đang xử lý..." : "Đăng ký" }}
                </button>
            </form>
        </div>
    </div>
</template>


<script setup>
import { ref, computed, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
// import Swal from 'sweetalert2'; // <-- ĐÃ XÓA

const router = useRouter();
const loading = ref(false);

// 1. Dữ liệu (State) cho form và lỗi
const formData = ref({
    email: '',
    password: '',
    passwordConfirm: '',
    fullName: '',
    phone: '',
    city: '',
    district: '',
    address: '',
});

const errors = ref({});

// 2. Dữ liệu mẫu cho Tỉnh/Thành
const locationData = {
    'An Giang': ['Long Xuyên', 'Châu Đốc', 'Tân Châu'],
    'Hồ Chí Minh': ['Quận 1', 'Quận 3', 'Thành phố Thủ Đức'],
    'Hà Nội': ['Ba Đình', 'Hoàn Kiếm', 'Cầu Giấy'],
    'Cần Thơ': ['Ninh Kiều', 'Bình Thủy', 'Cái Răng'],
};
const cities = Object.keys(locationData);

// 3. Logic động cho Quận/Huyện
const availableDistricts = computed(() => {
    return locationData[formData.value.city] || [];
});

watch(
    () => formData.value.city,
    (newCity, oldCity) => {
        if (newCity !== oldCity) {
            formData.value.district = '';
        }
    }
);

// 4. Hàm Validate (Bắt lỗi)
const validatePhone = () => {
    errors.value.phone = '';
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})\b$/;
    if (formData.value.phone && !phoneRegex.test(formData.value.phone)) {
        errors.value.phone = 'Số điện thoại không đúng định dạng.';
    }
};

const validateForm = () => {
    errors.value = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // (Phần logic validate giữ nguyên)
    if (!formData.value.email.trim()) {
        errors.value.email = 'Email là bắt buộc.';
    } else if (!emailRegex.test(formData.value.email)) {
        errors.value.email = 'Email không đúng định dạng.';
    }
    if (!formData.value.password) {
        errors.value.password = 'Mật khẩu là bắt buộc.';
    } else if (formData.value.password.length < 6) {
        errors.value.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
    }
    if (formData.value.password !== formData.value.passwordConfirm) {
        errors.value.passwordConfirm = 'Mật khẩu xác nhận không khớp.';
    }
    if (!formData.value.fullName.trim()) {
        errors.value.fullName = 'Họ và tên là bắt buộc.';
    }
    if (!formData.value.phone.trim()) {
        errors.value.phone = 'Điện thoại là bắt buộc.';
    } else {
        validatePhone();
    }
    if (!formData.value.city) {
        errors.value.city = 'Vui lòng chọn Thành phố.';
    }
    if (!formData.value.district) {
        errors.value.district = 'Vui lòng chọn Quận/Huyện.';
    }
    if (!formData.value.address.trim()) {
        errors.value.address = 'Địa chỉ (Số nhà, đường) là bắt buộc.';
    }

    return Object.keys(errors.value).length === 0;
};

// 5. Hàm xử lý khi submit form (ĐÃ CẬP NHẬT DÙNG alert)
const handleSubmit = async () => {
    if (!validateForm()) {
        // THAY THẾ 1
        alert('Vui lòng kiểm tra lại thông tin!');
        return;
    }

    loading.value = true;

    // (Phần biến đổi dữ liệu giữ nguyên)
    const fullAddressPlace = `${formData.value.address}, ${formData.value.district}, ${formData.value.city}`;
    const userToPost = {
        fullname: formData.value.fullName,
        email: formData.value.email,
        password: formData.value.password,
        phone: formData.value.phone,
        address: [
            {
                id: 'default',
                place: fullAddressPlace,
            },
        ],
        gender: '',
        role: 'user',
        status: 'active',
        birthday: '',
        create_At: new Date().toISOString(),
        avatar: '',
        cart: [],
    };

    try {
        // Bước 1: Kiểm tra xem email đã tồn tại chưa
        const { data } = await axios.get(
            `http://localhost:3000/users?email=${userToPost.email}`
        );
        if (data.length > 0) {
            errors.value.email = 'Email này đã tồn tại!';
            // THAY THẾ 2
            alert('Email này đã tồn tại!');
            loading.value = false;
            return;
        }

        // Bước 2: Nếu email chưa tồn tại, tiến hành POST dữ liệu
        await axios.post('http://localhost:3000/users', userToPost);

        // THAY THẾ 3
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        router.push('/login'); // Chuyển đến trang đăng nhập

    } catch (err) {
        console.error(err);
        // THAY THẾ 4
        alert('Lỗi khi đăng ký! Vui lòng thử lại.');
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.form-select.is-invalid+.invalid-feedback,
.invalid-feedback {
    display: block;
}

.form-label {
    font-weight: 500;
}
</style>