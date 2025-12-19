<template>
  <header class="admin-header">
    <div class="header-left ms-3">
      <div class="date-time-wrapper">
        <div class="icon-box">
          <i class="bi bi-calendar2-week"></i>
        </div>
        <div class="time-info">
          <span class="current-day">{{ currentDay }}</span>
          <span class="current-date">{{ currentDate }}</span>
        </div>
        <div class="clock-divider"></div>
        <div class="time-display">
          {{ currentTime }}
        </div>
      </div>
    </div>

    <div class="header-right">
      
      <button class="action-btn" title="Đổi ngôn ngữ">
        <span class="lang-text">EN</span>
      </button>
      <button class="action-btn notification-btn">
        <i class="bi bi-bell"></i>
        <span class="badge-dot"></span>
      </button>
      <div class="user-profile-wrapper">
        <div class="user-info">
          <div class="user-avatar">
            <img src="https://placehold.co/40x40" alt="Avatar" />
            <span class="status-dot"></span>
          </div>
          <div class="user-text">
            <span class="name">Admin User</span>
            <span class="role">Quản trị viên</span>
          </div>
          <i class="bi bi-chevron-down arrow-icon"></i>
        </div>

        <div class="profile-dropdown">
          <div class="dropdown-header">
            <p class="greeting">Xin chào, Admin!</p>
            <small>admin@smartshop.com</small>
          </div>
          <ul class="dropdown-list">
            <li><a href="#"><i class="bi bi-person"></i> Hồ sơ cá nhân</a></li>
            <li><a href="#"><i class="bi bi-gear"></i> Cài đặt</a></li>
            <li><a href="#"><i class="bi bi-credit-card"></i> Thanh toán</a></li>
            <div class="divider"></div>
            <li><a href="#" class="text-danger"><i class="bi bi-box-arrow-right"></i> Đăng xuất</a></li>
          </ul>
        </div>
      </div>

    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const currentDay = ref('');
const currentDate = ref('');
const currentTime = ref('');
let timer = null;

const updateDateTime = () => {
  const now = new Date();
  
  currentDay.value = now.toLocaleDateString('vi-VN', { weekday: 'long' });
  
  currentDate.value = now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  
  currentTime.value = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

onMounted(() => {
  updateDateTime();
  timer = setInterval(updateDateTime, 1000); 
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style lang="scss" scoped>
$primary-color: #2563eb;
$text-color: #374151;
$bg-gray: #f3f4f6;
$border-color: #e5e7eb;
$header-height: 70px;

.admin-header {
  height: $header-height;
  background: #ffffff;
  border-bottom: 1px solid $border-color;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 25px;
  position: sticky;
  top: 0;
  z-index: 99;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.02); 
}

.date-time-wrapper {
  display: flex;
  align-items: center;
  background-color: $bg-gray;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  cursor: default;

  &:hover {
    background-color: #fff;
    border-color: $primary-color;
    box-shadow: 0 2px 10px rgba(37, 99, 235, 0.1);

    .icon-box { color: $primary-color; background-color: rgba(37, 99, 235, 0.1); }
  }

  .icon-box {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border-radius: 6px;
    color: #6b7280;
    font-size: 16px;
    margin-right: 10px;
    transition: all 0.2s;
  }

  .time-info {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
    margin-right: 15px;

    .current-day {
      font-size: 11px;
      color: #6b7280;
      text-transform: capitalize;
      font-weight: 600;
    }

    .current-date {
      font-size: 13px;
      color: $text-color;
      font-weight: 700;
    }
  }

  .clock-divider {
    width: 1px;
    height: 24px;
    background-color: #d1d5db;
    margin-right: 15px;
  }

  .time-display {
    font-size: 18px;
    font-weight: 800;
    color: $primary-color;
    letter-spacing: 0.5px;
    font-variant-numeric: tabular-nums; 
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid transparent;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
  position: relative;

  &:hover {
    background-color: $bg-gray;
    color: $primary-color;
  }

  .lang-text {
    font-weight: 700;
    font-size: 13px;
  }

  i {
    font-size: 20px;
  }
}

.notification-btn {
  .badge-dot {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 8px;
    height: 8px;
    background-color: #ef4444;
    border: 2px solid #fff;
    border-radius: 50%;
    
    &::after {
      content: '';
      position: absolute;
      top: -2px; left: -2px; right: -2px; bottom: -2px;
      border-radius: 50%;
      border: 1px solid #ef4444;
      animation: pulse 1.5s infinite;
    }
  }
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(2.5); opacity: 0; }
}

.user-profile-wrapper {
  position: relative;
  margin-left: 10px;
  padding-left: 15px;
  border-left: 1px solid $border-color;

  .user-info {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    padding: 5px;
    border-radius: 8px;
    transition: all 0.2s;

    &:hover {
      background-color: $bg-gray;
    }

    .user-avatar {
      position: relative;
      width: 40px;
      height: 40px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #fff;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }

      .status-dot {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 10px;
        height: 10px;
        background: #10b981; 
        border: 2px solid #fff;
        border-radius: 50%;
      }
    }

    .user-text {
      display: flex;
      flex-direction: column;
      line-height: 1.2;

      .name {
        font-weight: 600;
        font-size: 14px;
        color: $text-color;
      }
      .role {
        font-size: 11px;
        color: #6b7280;
      }
    }

    .arrow-icon {
      font-size: 12px;
      color: #9ca3af;
      margin-left: 5px;
    }
  }

  
  .profile-dropdown {
    position: absolute;
    top: 120%;
    right: 0;
    width: 220px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    border: 1px solid $border-color;
    padding: 10px 0;
    opacity: 0;
    visibility: hidden;
    transform: translateY(10px);
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
    

    &::before {
      content: "";
      position: absolute;
      top: -6px;
      right: 20px;
      width: 12px;
      height: 12px;
      background: #fff;
      transform: rotate(45deg);
      border-top: 1px solid $border-color;
      border-left: 1px solid $border-color;
    }

    .dropdown-header {
      padding: 10px 20px;
      border-bottom: 1px solid $bg-gray;
      margin-bottom: 5px;

      .greeting { margin: 0; font-weight: 700; color: #111; }
      small { color: #6b7280; font-size: 11px; }
    }

    .dropdown-list {
      list-style: none;
      padding: 0;
      margin: 0;

      li a {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 20px;
        font-size: 14px;
        color: $text-color;
        text-decoration: none;
        transition: 0.2s;

        i {
          font-size: 16px;
          color: #9ca3af;
        }

        &:hover {
          background-color: $bg-gray;
          color: $primary-color;
          
          i { color: $primary-color; }
        }
      }

      .divider {
        height: 1px;
        background-color: $bg-gray;
        margin: 5px 0;
      }

      .text-danger:hover {
        background-color: #fef2f2; 
        color: #ef4444;
        i { color: #ef4444; }
      }
    }
  }

  &:hover .profile-dropdown {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .user-text, .arrow-icon {
    display: none;
  }
  
  .user-profile-wrapper {
    padding-left: 0;
    border-left: none;
  }

  .date-time-wrapper {
    background: transparent;
    padding: 0;
    border: none;
    .time-info, .clock-divider { display: none; } 
    .icon-box { display: none; }
    .time-display { font-size: 16px; }
  }
}
</style>