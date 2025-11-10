<template>
  <footer class="bg-white border-t border-gray-200 text-sm text-gray-700">
    <div
      class="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8"
    >
      <!-- Thông tin công ty -->
      <div>
        <h3 class="font-bold text-lg mb-3">Thông tin công ty</h3>
        <p class="font-semibold">
          CÔNG TY TNHH SẢN XUẤT VÀ THƯƠNG MẠI TUẤN TRANG
        </p>
        <p>
          Giấy chứng nhận đăng ký kinh doanh số <strong>0106062077</strong> do
          Sở kế hoạch và đầu tư Thành phố Hà Nội cấp ngày 17/12/2012
        </p>
        <p>
          Địa chỉ: Số 147 đường Thanh Lãm, Phường Phú Lương, Thành phố Hà Nội,
          Việt Nam
        </p>
        <p>Điện thoại: 0972.359.666</p>
        <p>
          Email:
          <a href="mailto:thoitrangorchid@gmail.com" class="text-blue-600"
            >thoitrangorchid@gmail.com</a
          >
        </p>
        <p>Đại diện theo pháp luật: <strong>HÀ QUỐC VIỆT</strong></p>
        <img
          src="https://online.gov.vn/seals/2020logoSaleNoti.png"
          alt="Bộ Công Thương"
          class="mt-3 w-40"
        />
      </div>

      <!-- Chính sách khách hàng -->
      <div>
        <h3 class="font-bold text-lg mb-3">Chính sách khách hàng</h3>
        <ul class="space-y-1">
          <li>
            <RouterLink to="/chinh-sach-vip">Chính sách thẻ VIP</RouterLink>
          </li>
          <li>
            <RouterLink to="/chinh-sach-tich-diem"
              >Chính sách tích điểm - tiêu điểm</RouterLink
            >
          </li>
          <li>
            <RouterLink to="/chinh-sach-uu-dai"
              >Chính sách ưu đãi sinh nhật</RouterLink
            >
          </li>
        </ul>
      </div>

      <!-- Hỗ trợ khách hàng -->
      <div>
        <h3 class="font-bold text-lg mb-3">Hỗ trợ khách hàng</h3>
        <ul class="space-y-1">
          <li><RouterLink to="/bao-hanh">Chính sách bảo hành</RouterLink></li>
          <li>
            <RouterLink to="/bao-mat">Chính sách bảo mật thông tin</RouterLink>
          </li>
          <li>
            <RouterLink to="/doi-tra"
              >Chính sách đổi trả hàng và hoàn tiền</RouterLink
            >
          </li>
          <li>
            <RouterLink to="/quy-dinh"
              >Chính sách hoạt động và quy định chung</RouterLink
            >
          </li>
          <li><RouterLink to="/kiem-hang">Chính sách kiểm hàng</RouterLink></li>
          <li>
            <RouterLink to="/van-chuyen">Chính sách vận chuyển</RouterLink>
          </li>
          <li>
            <RouterLink to="/thanh-toan"
              >Thông tin về hình thức thanh toán</RouterLink
            >
          </li>
          <li>
            <RouterLink to="/giao-dich"
              >Thông tin về điều kiện giao dịch chung</RouterLink
            >
          </li>
          <li><RouterLink to="/san-pham">Thông tin sản phẩm</RouterLink></li>
        </ul>
      </div>

      <!-- Đăng ký nhận ưu đãi -->
      <div>
        <h3 class="font-bold text-lg mb-3">Đăng ký để nhận ưu đãi mới nhất</h3>
        <form @submit.prevent="submitForm" class="space-y-3">
          <input
            type="text"
            v-model="form.name"
            placeholder="Họ và tên"
            class="border rounded-md px-3 py-2 w-full"
          />
          <input
            type="text"
            v-model="form.phone"
            placeholder="Số điện thoại"
            class="border rounded-md px-3 py-2 w-full"
          />
          <input
            type="email"
            v-model="form.email"
            placeholder="Email"
            class="border rounded-md px-3 py-2 w-full"
          />
          <button
            type="submit"
            class="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 w-full"
          >
            Đăng ký ngay
          </button>
        </form>
      </div>
    </div>

    <div class="border-t mt-8 py-4 text-center text-gray-500 text-sm">
      <p>Kết nối với chúng tôi:</p>
      <div class="flex justify-center space-x-4 mt-2">
        <a href="#" aria-label="Facebook"
          ><i class="fab fa-facebook text-2xl"></i
        ></a>
        <a href="#" aria-label="TikTok"
          ><i class="fab fa-tiktok text-2xl"></i
        ></a>
        <a href="#" aria-label="YouTube"
          ><i class="fab fa-youtube text-2xl"></i
        ></a>
        <a href="#" aria-label="Zalo"
          ><img
            src="https://stc-zaloid.zdn.vn/zaloid/zalo.png"
            alt="Zalo"
            class="w-6 h-6 inline"
        /></a>
        <a href="#" aria-label="Shopee"
          ><i class="fab fa-shopify text-2xl"></i
        ></a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";

const form = ref({
  name: "",
  phone: "",
  email: "",
});

function submitForm() {
  alert(`Cảm ơn ${form.value.name}! Chúng tôi sẽ liên hệ sớm.`);
  form.value = { name: "", phone: "", email: "" };
}
</script>

<style scoped>
footer a:hover {
  color: #1d4ed8;
  text-decoration: underline;
}
</style>
