import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// Cần thiết để xử lý đường dẫn tuyệt đối (Absolute Paths)
import { fileURLToPath, URL } from 'node:url' 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  
  // Thêm phần này để định nghĩa các alias (đường dẫn tắt)
  resolve: {
    alias: {
      // Định nghĩa alias '@' trỏ đến thư mục 'src'
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})