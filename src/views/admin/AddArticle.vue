<template>
  <div class="admin-container">
    <div class="page-header">
      <div class="header-left">
        <button class="btn-back" @click="goBack">
          <i class="bi bi-arrow-left"></i>
        </button>
        <div>
          <h2 class="page-title">{{ isEditMode ? 'Cập Nhật Bài Viết' : 'Thêm Bài Viết Mới' }}</h2>
          <p class="text-muted">Soạn thảo và quản lý tin tức</p>
        </div>
      </div>
      <div class="header-right">
        <button class="btn-outline-custom" @click="goBack">Hủy bỏ</button>
        <button class="btn-primary-custom" @click="saveArticle">
          <i class="bi bi-check2-circle"></i> 
          {{ isEditMode ? 'Lưu Thay Đổi' : 'Đăng Bài' }}
        </button>
      </div>
    </div>
    <div class="form-layout">
      
      <div class="col-left">
        <div class="card-box">
          <h4 class="card-title">Nội dung chính</h4>
          
          <div class="form-group">
            <label class="form-label">Tiêu đề bài viết <span class="text-red">*</span></label>
            <div class="input-wrapper">
                <span class="input-prefix"><i class="bi bi-type-h1"></i></span>
                <input type="text" v-model="article.title" class="form-input pl-40" placeholder="Nhập tiêu đề bài viết..." required />
            </div>
          </div>

          <div class="content-blocks-area mt-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                  <label class="form-label mb-0">Nội dung chi tiết</label>
                  <button class="btn-dashed-sm" @click="addBlock">
                      <i class="bi bi-plus-lg"></i> Thêm đoạn
                  </button>
              </div>

              <div class="story-timeline">
                  <div v-for="(block, index) in contentBlocks" :key="block.id" class="story-item">
                      <div class="story-badge">{{ index + 1 }}</div>
                      <div class="story-content">
                          <div class="story-header">
                              <span class="story-label">Đoạn nội dung {{ index + 1 }}</span>
                              <button class="btn-icon-trash" @click="removeBlock(index)" v-if="contentBlocks.length > 1" title="Xóa đoạn này">
                                  <i class="bi bi-trash"></i>
                              </button>
                          </div>
                          
                          <div class="form-group mb-3">
                              <textarea v-model="block.text" class="form-textarea" rows="4" placeholder="Viết nội dung cho đoạn này..."></textarea>
                          </div>

                          <label class="form-label-sm">Hình ảnh minh họa ({{ block.images.length }})</label>
                          <div class="media-grid">
                              <div class="media-item" v-for="(img, imgIndex) in block.images" :key="imgIndex">
                                  <img :src="img.preview" class="media-img" />
                                  <button class="btn-remove-media" @click="removeImageFromBlock(index, imgIndex)">
                                      <i class="bi bi-x"></i>
                                  </button>
                              </div>
                              <div class="upload-box-mini" @click="triggerBlockImageUpload(index)">
                                  <i class="bi bi-plus-lg"></i>
                                  <span>Thêm ảnh</span>
                                  <input type="file" :id="'file-input-' + index" class="d-none" accept="image/*" multiple @change="(e) => onBlockImageSelected(index, e)">
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              <button class="btn-dashed mt-3 w-100" @click="addBlock">
                  <i class="bi bi-plus-circle"></i> Thêm đoạn nội dung tiếp theo
              </button>
          </div>

        </div>
      </div>

      <div class="col-right">
        
        <div class="card-box">
          <h4 class="card-title">Thông tin chung</h4>
          
          <div class="form-group">
             <label class="form-label">Danh mục</label>
             <div class="select-wrapper">
                 <select v-model="article.categories_news_id" class="form-input">
                    <option value="1">Chương trình khuyến mại</option>
                    <option value="2">Tin tức khai trương</option>
                    <option value="3">Bộ sưu tập</option>
                    <option value="4">Xu hướng thời trang</option>
                 </select>
             </div>
          </div>

          <div class="form-group">
             <label class="form-label">Tác giả <span class="text-red">*</span></label>
             <div class="input-wrapper">
                 <span class="input-prefix"><i class="bi bi-person"></i></span>
                 <input type="text" v-model="article.author" class="form-input pl-40" placeholder="Tên tác giả..." />
             </div>
          </div>
        </div>

        <div class="card-box mt-4">
            <h4 class="card-title">Trạng thái</h4>
            <div class="status-selection">
                <label class="status-option" :class="{ active: article.status === 'active' }">
                    <input type="radio" v-model="article.status" value="active" hidden>
                    <span class="dot success"></span>
                    <span>Hiển thị</span>
                    <i class="bi bi-check-lg ms-auto" v-if="article.status === 'active'"></i>
                </label>
                <label class="status-option" :class="{ active: article.status === 'hidden' }">
                    <input type="radio" v-model="article.status" value="hidden" hidden>
                    <span class="dot danger"></span>
                    <span>Ẩn bài</span>
                    <i class="bi bi-check-lg ms-auto" v-if="article.status === 'hidden'"></i>
                </label>
            </div>
        </div>

        <div class="card-box mt-4">
            <h4 class="card-title">Ảnh đại diện (Thumbnail)</h4>
            <div class="upload-zone-large" :class="{'has-image': previewImg}" @click="triggerFileUpload">
                <img v-if="previewImg" :src="previewImg" class="banner-preview" />
                <div v-else class="upload-placeholder">
                    <i class="bi bi-cloud-arrow-up"></i>
                    <p>Tải ảnh bìa</p>
                </div>
                <input type="file" ref="fileInput" class="d-none" accept="image/*" @change="handleFileUpload">
                
                <button v-if="previewImg" class="btn-reset-abs" @click.stop="resetImage">
                    <i class="bi bi-x"></i>
                </button>
            </div>
            <div class="text-center mt-2" v-if="article.img && !previewImg">
                <small class="text-muted">Ảnh hiện tại: {{ article.img }}</small>
            </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            article: {
                title: "",
                content: "",
                author: "",
                categories_news_id: "1",
                status: "active",
                img: ""
            },
            previewImg: null, 
            contentBlocks: [
                { id: Date.now(), text: '', images: [] }
            ]
        };
    },
    computed: {
        isEditMode() {
            return !!this.$route.params.id;
        }
    },
    async created() {
        if (this.isEditMode) {
            const id = this.$route.params.id;
            try {
                const response = await axios.get(`http://localhost:3000/news/${id}`);
                this.article = response.data;
                
                try {
                    const parsedContent = JSON.parse(this.article.content);
                    if (Array.isArray(parsedContent)) {
                        this.contentBlocks = parsedContent;
                    } else {
                        this.contentBlocks = [{ id: Date.now(), text: this.article.content, images: [] }];
                    }
                } catch (e) {
                    this.contentBlocks = [{ id: Date.now(), text: this.article.content, images: [] }];
                }
            } catch (error) {
                console.error("Lỗi lấy dữ liệu:", error);
                alert("Không tìm thấy bài viết!");
            }
        }
    },
    methods: {
        addBlock() {
            this.contentBlocks.push({ id: Date.now(), text: '', images: [] });
        },
        removeBlock(index) {
            this.contentBlocks[index].images.forEach(img => URL.revokeObjectURL(img.preview));
            this.contentBlocks.splice(index, 1);
        },
        triggerBlockImageUpload(index) {
            const input = document.getElementById('file-input-' + index);
            if(input) input.click();
        },
        onBlockImageSelected(index, event) {
            const files = Array.from(event.target.files);
            if (files.length > 0) {
                files.forEach(file => {
                    this.contentBlocks[index].images.push({
                        file: file, 
                        preview: URL.createObjectURL(file)
                    });
                });
            }
            event.target.value = '';
        },
        removeImageFromBlock(blockIndex, imgIndex) {
            URL.revokeObjectURL(this.contentBlocks[blockIndex].images[imgIndex].preview);
            this.contentBlocks[blockIndex].images.splice(imgIndex, 1);
        },

        triggerFileUpload() {
            this.$refs.fileInput.click();
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.article.img = "images/" + file.name;
                if (this.previewImg) URL.revokeObjectURL(this.previewImg);
                this.previewImg = URL.createObjectURL(file);
            }
        },
        resetImage() {
             if (this.previewImg) URL.revokeObjectURL(this.previewImg);
             this.previewImg = null;
             this.article.img = "";
             if(this.$refs.fileInput) this.$refs.fileInput.value = '';
        },
        goBack() {
            this.$router.push({ name: 'post' });
        },
        
        async saveArticle() {
            if (!this.article.title || !this.article.author) {
                return alert("Vui lòng nhập tiêu đề và tên tác giả!");
            }
            this.article.content = JSON.stringify(this.contentBlocks);

            try {
                if (this.isEditMode) {
                    const id = this.$route.params.id;
                    await axios.put(`http://localhost:3000/news/${id}`, this.article);
                    alert("Cập nhật thành công!");
                } else {
                    this.article.create_At = new Date().toISOString().split('T')[0];
                    await axios.post('http://localhost:3000/news', this.article);
                    alert("Thêm mới thành công!");
                }

                this.goBack();

            } catch (error) {
                console.error("Lỗi khi lưu:", error);
                alert("Có lỗi xảy ra, vui lòng thử lại.");
            }
        }
    }
};
</script>

<style scoped>
.admin-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #f3f4f6;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #374151;
}


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
.btn-dashed-sm {
    border: 1px dashed #d1d5db; background: white; padding: 5px 12px; border-radius: 6px;
    font-size: 13px; font-weight: 500; color: #6b7280; cursor: pointer; transition: 0.2s;
}
.btn-dashed-sm:hover { color: #2563eb; border-color: #2563eb; background: #eff6ff; }
.btn-dashed {
    width: 100%; border: 1px dashed #d1d5db; background: #fff; padding: 10px; border-radius: 8px;
    color: #6b7280; font-size: 13px; font-weight: 500; cursor: pointer; transition: 0.2s;
}
.btn-dashed:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }


.form-layout { display: grid; grid-template-columns: 2fr 1.2fr; gap: 25px; }
@media (max-width: 1024px) { .form-layout { grid-template-columns: 1fr; } }

.card-box { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.02); }
.card-title { margin: 0 0 20px 0; font-size: 16px; font-weight: 700; color: #1f2937; border-bottom: 1px solid #f3f4f6; padding-bottom: 15px; }
.mt-4 { margin-top: 25px; }

.form-group { margin-bottom: 20px; }
.form-label { display: block; font-size: 13px; font-weight: 600; color: #4b5563; margin-bottom: 6px; }
.form-label-sm { display: block; font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 6px; margin-top: 10px; }
.text-red { color: #ef4444; }
.form-input, .form-textarea {
  width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px;
  font-size: 14px; color: #111; outline: none; transition: all 0.2s; background: #fff;
}
.form-input:focus, .form-textarea:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }

.input-wrapper { position: relative; }
.input-prefix {
  position: absolute; left: 1px; top: 1px; bottom: 1px; width: 40px;
  display: flex; align-items: center; justify-content: center;
  color: #9ca3af; font-size: 16px; border-right: 1px solid transparent;
}
.form-input.pl-40 { padding-left: 40px; }

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
.dot.danger { background-color: #ef4444; }
.ms-auto { margin-left: auto; }

.upload-zone-large {
    height: 200px; border: 2px dashed #e5e7eb; border-radius: 8px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    cursor: pointer; background: #f9fafb; position: relative; overflow: hidden; transition: 0.2s;
}
.upload-zone-large:hover { border-color: #2563eb; background: #eff6ff; }
.upload-zone-large.has-image { border: none; }
.upload-placeholder { text-align: center; color: #6b7280; }
.upload-placeholder i { font-size: 32px; color: #9ca3af; }
.upload-placeholder p { font-size: 13px; margin: 5px 0 0 0; font-weight: 500; }
.banner-preview { width: 100%; height: 100%; object-fit: cover; }
.btn-reset-abs {
    position: absolute; top: 10px; right: 10px; width: 24px; height: 24px;
    background: white; border-radius: 50%; border: none; shadow: 0 2px 5px rgba(0,0,0,0.1);
    display: flex; align-items: center; justify-content: center; cursor: pointer; color: #ef4444;
}

.story-timeline { display: flex; flex-direction: column; gap: 20px; }
.story-item { display: flex; gap: 15px; }
.story-badge {
    width: 28px; height: 28px; background: #eff6ff; color: #2563eb;
    border-radius: 50%; font-weight: 700; font-size: 13px;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid #fff; box-shadow: 0 0 0 1px #dbeafe; flex-shrink: 0;
}
.story-content {
    flex: 1; background: #f9fafb; border-radius: 8px; padding: 15px; border: 1px solid #e5e7eb;
}
.story-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.story-label { font-size: 13px; font-weight: 600; color: #374151; }
.btn-icon-trash {
    background: none; border: none; color: #9ca3af; cursor: pointer; transition: 0.2s;
}
.btn-icon-trash:hover { color: #ef4444; }

.media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)); gap: 10px; }
.upload-box-mini {
    height: 70px; border: 1px dashed #d1d5db; border-radius: 6px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    cursor: pointer; color: #9ca3af; font-size: 11px; background: #fff; transition: 0.2s;
}
.upload-box-mini:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }
.media-item { position: relative; height: 70px; border-radius: 6px; overflow: hidden; border: 1px solid #e5e7eb; }
.media-img { width: 100%; height: 100%; object-fit: cover; }
.btn-remove-media {
    position: absolute; top: 1px; right: 1px; width: 18px; height: 18px;
    background: rgba(0,0,0,0.6); color: white; border: none; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 10px;
}
.d-none { display: none; }
</style>