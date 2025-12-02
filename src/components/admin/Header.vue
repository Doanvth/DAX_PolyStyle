<template>
  <header
    class="admin-header d-flex align-items-center justify-content-end px-4 py-2"
  >
    <div class="search-box d-flex align-items-center me-3">
      <input type="text" placeholder="Search..." />
      <i class="fa-solid fa-magnifying-glass search-icon"></i>
    </div>

    <div class="header-actions d-flex align-items-center gap-3">
      <div class="lang-switch">EN</div>

      <div class="notification position-relative">
        <i class="bi bi-bell"></i>
        <span class="badge"></span>
      </div>

      <div class="user-avatar-wrapper position-relative me-3">
        <div class="user-avatar">
          <i class="bi bi-person-circle"></i>
        </div>

        <div class="avatar-dropdown">
          <div class="dropdown-item">Thông tin cá nhân</div>
          <div class="dropdown-item">Đăng xuất</div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup></script>

<style lang="scss" scoped>
.admin-header {
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #e4e6ef;
  display: flex;
  align-items: center;

  .search-box {
    position: relative;

    input {
      width: 220px;
      padding: 8px 36px 8px 14px;
      border: 1px solid #d1d5db;
      border-radius: 20px;
      font-size: 14px;
      outline: none;
      transition: all 0.2s ease;

      &::placeholder {
        color: #9ca3af;
      }

      &:focus {
        border-color: #6c63ff;
        box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
      }
    }

    .search-icon {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #6b7280;
      font-size: 14px;
      cursor: pointer;
    }
  }

  .header-actions {
    .lang-switch {
      border: 1px solid #d1d5db;
      border-radius: 20px;
      padding: 5px 10px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #f3f4f6;
      }
    }

    .notification {
      position: relative;
      font-size: 18px;
      color: #374151;
      cursor: pointer;

      .badge {
        position: absolute;
        top: -3px;
        right: -3px;
        width: 7px;
        height: 7px;
        background: #ff4d4f;
        border-radius: 50%;
      }

      &:hover {
        color: #6c63ff;
      }
    }

    .user-avatar {
      width: 34px;
      height: 34px;
      border: 1px solid #d1d5db;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      color: #374151;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #f3f4f6;
        color: #6c63ff;
      }
    }
  }

  .user-avatar-wrapper {
    position: relative;

    .avatar-dropdown {
      position: absolute;
      right: 0;
      top: 42px;
      width: 150px;
      background: #fff;
      border: 1px solid #e4e6ef;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s ease;

      .dropdown-item {
        padding: 10px 12px;
        font-size: 14px;
        color: #374151;
        transition: all 0.2s ease;

        &:hover {
          background: #f3f4f6;
          color: #6c63ff;
        }
      }
    }

    &:hover .avatar-dropdown {
      opacity: 1;
      visibility: visible;
    }
  }
}
</style>
