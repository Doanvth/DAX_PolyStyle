<template>
  <div class="product-management-container">
    <div class="header-actions">
      <h4 class="fw-bold text-primary mb-0">Quản Lý Sản Phẩm</h4>
      <router-link to="addproducts" class="btn btn-add">
        + Thêm Sản Phẩm Mới
      </router-link>
    </div>

    <div v-if="errorMessage" class="error-alert">
      {{ errorMessage }}
    </div>

    <div class="table-responsive shadow-sm">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ảnh</th>
            <th>Mã SKU</th>
            <th>Tên Sản Phẩm</th>
            <th>Giá Bán</th>
            <th>Tồn Kho</th>
            <th>Danh Mục</th> <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="8" style="text-align: center; padding: 20px;">Đang tải dữ liệu...</td>
          </tr>
          
          <tr v-else-if="products.length === 0">
            <td colspan="8" style="text-align: center; padding: 20px;">Không có sản phẩm nào.</td>
          </tr>

          <tr v-else v-for="(product, index) in products" :key="product.id || product.sku || index">
            <td>#{{ product.id || index + 1 }}</td>
            
            <td>
              <img 
                :src="getProductImage(product.image)" 
                alt="Product Img" 
                class="product-image"
                @error="handleImageError" 
              />
            </td>
            
            <td>{{ product.sku }}</td>
            
            <td class="product-name">
              {{ product.name }}
            </td>
            
            <td class="product-price">{{ formatPrice(product.price) }}</td>

            <td>
              <span v-if="product.stock === 0" class="out-of-stock">
                Hết hàng
              </span>
              <span v-else-if="product.stock < 10" class="low-stock">
                {{ product.stock }} (Sắp hết)
              </span>
              <span v-else>
                {{ product.stock }}
              </span>
            </td>

            <td>{{ product.categoryId }}</td>

            <td>
              <button class="btn btn-edit" title="Sửa"><i class="bi bi-pencil-square"></i></button>
              <button class="btn btn-delete" title="Xóa"><i class="bi bi-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';


const API_URL = 'http://localhost:3000/products';

const PLACEHOLDER_IMG = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2250%22%20height%3D%2250%22%20viewBox%3D%220%200%2050%2050%22%3E%3Crect%20fill%3D%22%23e0e0e0%22%20width%3D%2250%22%20height%3D%2250%22%2F%3E%3Ctext%20fill%3D%22%23999%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%20font-family%3D%22Arial%22%20font-size%3D%2210%22%3ENo%20Img%3C%2Ftext%3E%3C%2Fsvg%3E";

const products = ref([]);
const loading = ref(false);
const errorMessage = ref('');

const fetchProducts = async () => {
  loading.value = true;
  try {
    const response = await axios.get(API_URL);
    
    if (response.data && response.data.products) {
        products.value = response.data.products;
    } else if (Array.isArray(response.data)) {
        products.value = response.data;
    } else {
        products.value = [];
    }

    console.log("Products loaded:", products.value);
  } catch (error) {
    console.error("Lỗi tải sản phẩm:", error);
    errorMessage.value = "Không thể kết nối đến server.";
  } finally {
    loading.value = false;
  }
};

const formatPrice = (value) => {
  if (!value) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const getProductImage = (images) => {
  if (Array.isArray(images) && images.length > 0 && images[0].url && images[0].url.trim() !== "") {
    return images[0].url;
  }
  return PLACEHOLDER_IMG;
};
const handleImageError = (e) => {
  e.target.src = PLACEHOLDER_IMG;
};

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.product-management-container {
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 5px;
}

.header-actions h4 {
  margin: 0;
  text-align: left;
}

.table-responsive {
  overflow-x: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #fff;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  vertical-align: middle; /* Căn giữa theo chiều dọc */
}

thead th {
  background-color: #f4f4f4;
  color: #333;
  font-weight: bold;
}

tbody tr:hover {
  background-color: #f9f9f9;
}

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #eee;
}

.product-name {
  font-weight: 500;
  color: #333;
  max-width: 250px; /* Giới hạn chiều rộng tên */
}

.product-price {
  font-weight: bold;
  color: #2c3e50;
}

/* Stock Status Colors */
.low-stock {
  font-weight: bold;
  color: orange;
}

.out-of-stock {
  font-weight: bold;
  color: red;
}

/* Buttons */
.btn {
  padding: 8px 10px;
  margin-right: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: opacity 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.btn:hover {
  opacity: 0.7;
  background-color: rgba(0,0,0,0.05);
}

.btn-edit {
  color: #4caf50;
}

.btn-delete {
  color: #f44336;
}

.btn-add {
  background-color: #6c63ff;
  color: white;
  padding: 10px 15px;
  font-weight: bold;
}

.btn-add:hover {
    background-color: #5a52d5;
    opacity: 1;
}

.error-alert {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
}
</style>