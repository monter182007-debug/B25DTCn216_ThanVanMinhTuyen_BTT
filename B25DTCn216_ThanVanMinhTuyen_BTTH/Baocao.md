# BÁO CÁO BÀI TẬP: XÂY DỰNG TOAST NOTIFICATION SYSTEM (DARK THEME)

## 1. Hiểu bài

- **Toast là gì?** Toast là một hộp thông báo nhỏ xuất hiện trên màn hình (thường ở góc) trong một thời gian ngắn rồi tự biến mất.
- **Dùng để làm gì?** Giúp cung cấp phản hồi ngay lập tức cho người dùng (ví dụ: "Đã lưu thành công", "Lỗi kết nối mạng") mà không làm gián đoạn trải nghiệm của họ.

## 2. Dữ liệu & Trạng thái

Để hệ thống hoạt động mượt mà và không bị đơ khi bấm liên tục, em cần quản lý các dữ liệu sau:

- **Dữ liệu cần lưu:** Nội dung thông báo (Message), loại thông báo (Type) để xác định icon và màu sắc, và hàng đợi (Queue) để kiểm soát hiển thị.
- **Cách lưu trữ:**
  - Dùng **Object** lưu thông tin một toast: `{ type: 'success', message: 'Thành công!' }`.
  - Dùng **Array (Mảng)** làm Queue để chứa các toast đang chờ tới lượt hiện lên.

## 3. Luồng hoạt động

1. Người dùng bấm nút trên màn hình.
2. JavaScript bắt sự kiện click, tạo ra một Object chứa dữ liệu (bao gồm cả icon tương ứng) và đẩy vào mảng Queue.
3. Hệ thống kiểm tra: Nếu trên màn hình đang hiện ít hơn 3 toast, nó sẽ lấy toast đầu tiên trong Queue ra.
4. Dùng `document.createElement` tạo thẻ `div` với giao diện tối hiện đại, gán class CSS và nội dung tương ứng (icon, tiêu đề, mô tả).
5. Dùng `appendChild` đẩy thẻ `div` này vào Container ở góc màn hình (CSS Flexbox sẽ giúp chúng tự xếp hàng dọc).
6. Cài đặt `setTimeout` 4 giây. Hết thời gian, thêm class animation mờ dần và thu nhỏ, đợi animation chạy xong thì dùng `remove()` xóa thẻ HTML đó.

## 4. Pseudocode (Mã giả)

**Luồng thêm toast:**

- Hàm `createToastElement(dữ_liệu)`:
  - Lấy icon tương ứng dựa trên `dữ_liệu.type`.
  - Tạo thẻ `<div>` chính với class "toast" và class của loại.
  - Tạo và thêm các phần tử con: icon, container chứa tiêu đề & mô tả, nút đóng X.
  - Thêm thẻ `<div>` vào container ở góc màn hình.
  - Hẹn giờ 4 giây -> Thêm class "hide" để chạy animation ẩn đi.
  - Đợi thêm 0.5 giây -> Xóa thẻ `<div>` khỏi HTML.

**Luồng xử lý queue (Chống spam):**

- Mảng `toastQueue = []`.
- Hàm `showToast()`: Đẩy dữ liệu vào `toastQueue` và gọi `processQueue()`.
- Hàm `processQueue()`:
  - Nếu số toast đang hiện < 3 VÀ hàng đợi có phần tử:
  - Lấy phần tử đầu ra và gọi `createToastElement()`.

## 5. Edge cases (Các trường hợp ngoại lệ)

1. **Bấm liên tục nhiều lần:** Giới hạn chỉ cho hiện tối đa 3 toast cùng lúc. Các toast thừa phải nằm trong Array đợi, cái nào tắt đi thì cái mới mới được hiện lên.
2. **Reload trang:** Nếu toast đang hiện mà ấn F5 trang web, toast sẽ mất do trạng thái DOM bị reset.
3. **Lỗi tắt sớm:** Nếu người dùng bấm tắt toast bằng nút X thủ công, bộ đếm `setTimeout` ngầm vẫn chạy. Cần dùng `clearTimeout` để hủy lệnh xóa thừa, tránh báo lỗi trong Console.
4. **Layout trên thiết bị di động:** Đã thêm CSS để đảm bảo container có `z-index` cao và có thể cuộn nếu có quá nhiều toast.

## 6. Mở rộng thêm

- **Thêm nút đóng (×):** Có nút X góc phải để người dùng tự tắt mà không cần đợi 4s.
- **Thời gian hiển thị linh hoạt:** Mỗi loại toast có thời gian hiện mặc định khác nhau, và có thể tùy chỉnh khi gọi hàm.
- **Hỗ trợ icon:** Tự động gán icon chính xác (✓, ×, ℹ, ⚠) cho từng loại toast.
