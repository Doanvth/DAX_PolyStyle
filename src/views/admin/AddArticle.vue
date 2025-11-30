<template>
    <div class="form-container">
        <div class="header-actions">
            <h4 class="fw-bold text-primary mb-0">Quản Lý Bài Viết</h4>
            <router-link to="posts" class="btn btn-add">
                + Thêm Bài Viết Mới
            </router-link>
        </div>

        <div class="form-card">
            <form>
                <div class="form-section-title">Nội dung chính</div>
                <div class="form-row">
                    <div class="form-group col-half">
                        <label>Tiêu Đề Bài Viết <span class="required">*</span></label>
                        <input type="text" class="form-control" placeholder="Nhập tiêu đề..." required />
                    </div>
                    <div class="form-group col-half">
                        <label>Danh Mục</label>
                        <select class="form-control">
                            <option value="CAT_TECH">Công Nghệ</option>
                            <option value="CAT_LIFE">Đời Sống</option>
                            <option value="CAT_SPORT">Thể Thao</option>
                        </select>
                    </div>
                </div>

                <div class="form-section-title">Thông tin bổ sung</div>
                <div class="form-row">
                    <div class="form-group col-half">
                        <label>Tác Giả <span class="required">*</span></label>
                        <input type="text" class="form-control" placeholder="Tên tác giả" required />
                    </div>
                    <div class="form-group col-half">
                        <label>Trạng Thái</label>
                        <select class="form-control">
                            <option value="active">Hiển thị</option>
                            <option value="hidden">Ẩn bài</option>
                        </select>
                    </div>
                </div>

                <div class="form-section-title">Hình ảnh minh họa</div>
                <div class="form-row">
                    <div class="form-group col-full">
                        <label>Thumbnail</label>
                        <div class="custom-file-upload">
                            <input type="file" id="post-img" accept="image/*" />
                            <label for="post-img" class="upload-btn">
                                <i class="bi bi-cloud-upload"></i> Chọn ảnh bìa bài viết
                            </label>
                        </div>
                    </div>
                </div>
                <div class="form-section-title">Nội dung chi tiết</div>
                <div class="form-group">
                    <textarea rows="8" class="form-control" placeholder="Viết nội dung tại đây..."></textarea>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn btn-secondary">Hủy bỏ</button>
                    <button type="button" class="btn btn-primary">Đăng Bài</button>
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

.col-full {
    flex: 100%;
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
