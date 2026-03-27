// Lấy các thẻ HTML cần thiết
const toastContainer = document.getElementById("toast-container");
const positionSelector = document.getElementById("position-selector");

// Đổi vị trí container khi chọn select box
positionSelector.addEventListener("change", function () {
  toastContainer.className = "toast-container " + this.value;
});

// Hàng đợi chống spam
let toastQueue = [];
let activeToasts = 0;
const MAX_ACTIVE_TOASTS = 3; // Chỉ cho hiện 3 cái cùng lúc

// Cấu hình icon và văn bản mặc định cho từng loại toast
const toastConfig = {
  success: {
    icon: "✓",
    title: "Thành công!",
    message: "Bài viết đã được lưu thành công.",
    duration: 3000,
  },
  error: {
    icon: "×",
    title: "Lỗi hệ thống!",
    message: "Vui lòng thử lại sau.",
    duration: 6000,
  },
  info: {
    icon: "ℹ",
    title: "Thông báo!",
    message: "Có bản cập nhật mới.",
    duration: 4000,
  },
  warning: {
    icon: "⚠",
    title: "Cảnh báo!",
    message: "Cần kiểm tra kỹ trước khi tiếp tục.",
    duration: 5000,
  },
};

// Hàm chính nhận yêu cầu hiển thị toast
function showToast(type) {
  // Đẩy thông tin từ config vào mảng đợi
  toastQueue.push(type);
  processQueue(); // Gọi hàm xử lý
}

// Hàm kiểm tra hàng đợi
function processQueue() {
  // Nếu màn hình đã hiện đủ 3 cái hoặc không có gì đợi thì bỏ qua
  if (toastQueue.length === 0 || activeToasts >= MAX_ACTIVE_TOASTS) {
    return;
  }

  // Lấy phần tử đầu tiên (loại) ra khỏi mảng đợi
  const type = toastQueue.shift();
  const config = toastConfig[type]; // Lấy config tương ứng

  activeToasts++; // Tăng đếm số lượng đang hiện lên 1
  createToastElement(type, config);
}

// Hàm tạo thẻ div bằng JS (phức tạp hơn để match sleek giao diện)
function createToastElement(type, config) {
  // 1. Tạo thẻ div chính với class "toast" và class của loại (ví dụ: "toast success")
  const toast = document.createElement("div");
  toast.classList.add("toast", type);

  // 2. Tạo phần tử Icon
  const iconSpan = document.createElement("span");
  iconSpan.classList.add("toast-icon");
  iconSpan.innerText = config.icon;

  // 3. Tạo Container cho Tiêu đề & Mô tả
  const textDiv = document.createElement("div");
  textDiv.classList.add("toast-text");

  // 4. Tạo Tiêu đề
  const titleSpan = document.createElement("span");
  titleSpan.classList.add("toast-title");
  titleSpan.innerText = config.title;

  // 5. Tạo Mô tả
  const messageSpan = document.createElement("span");
  messageSpan.classList.add("toast-message");
  messageSpan.innerText = config.message;

  // 6. Nhét Tiêu đề và Mô tả vào textDiv
  textDiv.appendChild(titleSpan);
  textDiv.appendChild(messageSpan);

  // 7. Tạo Nút X để đóng
  const closeBtn = document.createElement("button");
  closeBtn.classList.add("close-btn");
  closeBtn.innerHTML = "&times;";

  // 8. Nhét tất cả các phần tử vào thẻ toast chính
  toast.appendChild(iconSpan);
  toast.appendChild(textDiv);
  toast.appendChild(closeBtn);

  // 9. Thêm thẻ toast vào container ở góc màn hình
  toastContainer.appendChild(toast);

  // 10. Cài đặt hẹn giờ để tự biến mất
  let timeoutId = setTimeout(() => {
    removeToast(toast);
  }, config.duration);

  // 11. Xử lý khi người dùng bấm nút X thủ công
  closeBtn.addEventListener("click", () => {
    clearTimeout(timeoutId); // Xóa bộ đếm giờ thừa, tránh lỗi
    removeToast(toast);
  });
}

// Hàm xóa toast với animation ẩn
function removeToast(toast) {
  if (toast.classList.contains("hide")) return;

  toast.classList.add("hide"); // Chạy hiệu ứng sleekOut

  // Đợi 400ms cho mờ xong rồi xóa hẳn khỏi HTML
  setTimeout(() => {
    toast.remove();
    activeToasts--; // Giảm số lượng đang hiện
    processQueue(); // Gọi cái tiếp theo trong hàng đợi lên
  }, 400);
}

// --- Bắt sự kiện click cho 4 nút demo trên giao diện ---

document.getElementById("btn-success").addEventListener("click", () => {
  showToast("success"); // Gọi showToast với loại 'success'
});

document.getElementById("btn-error").addEventListener("click", () => {
  showToast("error");
});

document.getElementById("btn-info").addEventListener("click", () => {
  showToast("info");
});

document.getElementById("btn-warning").addEventListener("click", () => {
  showToast("warning");
});
