<template>
    <div class="form-container">
        <div class="header-actions">
            <h4 class="fw-bold text-primary mb-0">Thêm Sản Phẩm Mới</h4>
            <router-link to="/products" class="btn-back">
                &larr; Quay lại danh sách
            </router-link>
        </div>

        <div class="form-card">
            <form>
                <div class="form-section-title">Thông tin chung</div>
                <div class="form-row">
                    <div class="form-group col-half">
                        <label>Tên Sản Phẩm <span class="required">*</span></label>
                        <input type="text" class="form-control" placeholder="Nhập tên sản phẩm..." required />
                    </div>
                    <div class="form-group col-half">
                        <label>Mã SKU <span class="required">*</span></label>
                        <input type="text" class="form-control" placeholder="Ví dụ: SP001" required />
                    </div>
                </div>

                <div class="form-section-title">Giá bán & Tồn kho</div>
                <div class="form-row">
                    <div class="form-group col-half">
                        <label>Giá Bán (VNĐ)</label>
                        <input type="number" class="form-control" placeholder="0" required />
                    </div>
                    <div class="form-group col-half">
                        <label>Số Lượng Tồn Kho</label>
                        <input type="number" class="form-control" placeholder="0" required />
                    </div>
                </div>

                <div class="form-section-title">Hình ảnh & Danh mục</div>
                <div class="form-row">
                    <div class="form-group col-half">
                        <label>Danh Mục <span class="required">*</span></label>
                        <select class="form-control">
                            <option value="" disabled selected>-- Chọn danh mục --</option>
                            <optgroup label="Thời trang nữ">
                                <option value="2">Áo thun</option>
                                <option value="3">Đầm</option>
                                <option value="4">Quần</option>
                            </optgroup>
                            <optgroup label="Thời trang nam">
                                <option value="6">Áo sơ mi</option>
                                <option value="7">Quần jeans</option>
                            </optgroup>
                        </select>
                    </div>

                    <div class="form-group col-half">
                        <label>Ảnh đại diện</label>
                        <div class="custom-file-upload">
                            <input type="file" id="product-img" accept="image/*" />
                            <label for="product-img" class="upload-btn">
                                <i class="bi bi-cloud-upload"></i> Chọn ảnh từ máy
                            </label>
                        </div>
                    </div>
                </div>

                <div class="form-section-title">Chi tiết sản phẩm</div>
                <div class="form-group">
                    <label>Mô tả chi tiết</label>
                    <textarea rows="5" class="form-control" placeholder="Nhập mô tả sản phẩm..."></textarea>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn btn-secondary">Hủy bỏ</button>
                    <button type="button" class="btn btn-primary">Lưu Sản Phẩm</button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
.form-container {
    margin: 30px auto;
    padding: 0 15px;
    font-family: 'Segoe UI', sans-serif;
}

.header-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
}

.text-primary {
    color: #007bff;
}

.fw-bold {
    font-weight: 700;
}

.btn-back {
    text-decoration: none;
    color: #666;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
}

.btn-back:hover {
    color: #000;
}

.form-card {
    background: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    border: 1px solid #f0f0f0;
}

.form-section-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #444;
    margin-bottom: 20px;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 8px;
    margin-top: 10px;
}

.form-section-title:first-child {
    margin-top: 0;
}

.form-row {
    display: flex;
    gap: 30px;
    margin-bottom: 20px;
}

.col-half {
    flex: 1;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #555;
    font-size: 0.95rem;
}

.required {
    color: #dc3545;
}

.form-control {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #dde2e5;
    border-radius: 8px;
    font-size: 14px;
    box-sizing: border-box;
    transition: border-color 0.2s;
}

.form-control:focus {
    border-color: #6c63ff;
    outline: none;
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
}

.custom-file-upload input[type="file"] {
    display: none;
}

.upload-btn {
    display: inline-block;
    padding: 12px 20px;
    border: 1px dashed #ccc;
    border-radius: 8px;
    cursor: pointer;
    background: #fafafa;
    color: #666;
    font-weight: 500;
    transition: all 0.2s;
    width: 100%;
    text-align: center;
    box-sizing: border-box;
}

.upload-btn:hover {
    background: #f0f0f0;
    border-color: #6c63ff;
    color: #6c63ff;
}

.upload-btn i {
    margin-right: 8px;
    font-size: 1.1rem;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #f0f0f0;
}

.btn {
    padding: 12px 30px;
    border-radius: 8px;
    cursor: pointer;
    border: none;
    font-weight: 600;
    font-size: 15px;
    transition: background 0.2s;
}

.btn-secondary {
    background: #f1f3f5;
    color: #495057;
}

.btn-secondary:hover {
    background: #e9ecef;
}

.btn-primary {
    background: #6c63ff;
    color: white;
    box-shadow: 0 4px 10px rgba(108, 99, 255, 0.3);
}

.btn-primary:hover {
    background: #5a52d5;
    transform: translateY(-1px);
}
</style>