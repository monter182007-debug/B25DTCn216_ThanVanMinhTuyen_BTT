# BÁO CÁO BÀI TẬP: HỆ THỐNG TOAST NOTIFICATION

## 1. Hiểu bài

- **Toast là gì?** Nó là cái hộp thông báo nhỏ nhỏ hay hiện ở góc màn hình khi mình thao tác xong một việc gì đó trên web.
- **Dùng để làm gì?** Để báo cho người dùng biết là họ vừa làm thành công hay bị lỗi (ví dụ: "Đã lưu bài", "Lỗi mạng"). Nó tiện hơn hàm `alert()` ở chỗ nó tự động biến mất sau vài giây, người dùng không cần phải click "OK" nên không bị khó chịu hay gián đoạn việc đang làm.

## 2. Dữ liệu & Trạng thái

Để code chạy mượt và không bị lỗi khi người dùng bấm linh tinh, em cần quản lý:

- **Lưu cái gì?** Lưu nội dung thông báo và loại thông báo (thành công, lỗi, cảnh báo...). Em dùng **Object** để lưu, ví dụ: `{ type: 'success', message: 'Thành công!' }`.
- **Lưu ở đâu?** Em dùng một **Mảng (Array)** làm "hàng đợi". Ai bấm trước thì nhét vào mảng trước, rồi cho xuất hiện lần lượt để không bị đè lên nhau.

## 3. Luồng hoạt động

1. Người dùng bấm nút trên màn hình.
2. JS nhận lệnh, tạo ra một Object chứa thông tin và đẩy nó vào mảng hàng đợi.
3. Hệ thống kiểm tra: Nếu trên màn hình đang hiện ít hơn 3 cái thông báo, thì lấy thông báo đầu tiên trong mảng ra để hiển thị.
4. Dùng `document.createElement` để tạo ra một thẻ `<div>`, gắn class CSS màu mè tương ứng rồi nhét vào góc màn hình.
5. Cài đặt `setTimeout` khoảng 4 giây. Hết 4 giây thì thêm hiệu ứng mờ đi rồi xóa hẳn thẻ `<div>` đó khỏi web.

## 4. Mã giả (Pseudocode)

**Luồng tạo thông báo:**

- Tạo thẻ `<div>` -> Gắn class màu sắc -> Ghi chữ vào -> Nhét thẻ đó ra màn hình.
- Bật đồng hồ đếm 4 giây -> Thêm class để chạy animation mờ dần -> Đợi thêm nửa giây cho mờ hẳn rồi xóa thẻ `<div>`.

**Luồng chống spam (Xếp hàng):**

- Tạo một mảng rỗng `queue = []`.
- Khi có người bấm nút: Nhét thông tin vào `queue`.
- Kiểm tra: Nếu (số thông báo đang hiện < 3) và (trong `queue` có đồ) -> Lấy cái đầu tiên ra để chạy luồng tạo thông báo ở trên.

## 5. Các trường hợp ngoại lệ (Edge cases)

1. **Bấm spam liên tục:** Em giới hạn chỉ cho hiện tối đa 3 cái cùng lúc. Ai bấm nhiều hơn thì phải xếp hàng trong mảng đợi, khi nào có cái tắt đi thì cái mới mới được trồi lên.
2. **Reload (F5) trang:** Đang hiện thông báo mà F5 thì thông báo sẽ mất luôn, do đây là web tĩnh nên giao diện bị tải lại từ đầu.
3. **Người dùng bấm tắt sớm:** Em có làm nút X để tắt. Nếu người dùng tự bấm X tắt luôn, cái đồng hồ 4s ngầm kia vẫn chạy, lúc đếm xong nó sẽ tìm thẻ div để xóa nhưng không thấy -> báo lỗi đỏ trên Console. Em xử lý bằng cách dùng `clearTimeout` hủy cái đồng hồ đó đi nếu người dùng tự tắt sớm.
4. **Nội dung thông báo quá dài:** Chữ nhiều quá sẽ làm cái hộp thông báo to đùng vỡ cả layout. Em dùng CSS `word-wrap: break-word` để ép chữ tự động xuống dòng cho gọn.

## 6. Phần mở rộng em đã làm

- **Nút đóng (×):** Thêm nút X ở góc để người dùng chủ động tắt thông báo nếu không muốn đợi 4s.
- **Thời gian hiển thị linh hoạt:** Toast báo "Thành công" thì hiện 3 giây cho nhanh, nhưng toast báo "Lỗi" em cho hiện 6 giây để người dùng có thời gian đọc xem lỗi gì.
- **Chọn góc hiển thị:** Em làm thêm một cái thẻ `<select>` để người dùng thích cho thông báo hiện ở góc trên/dưới/trái/phải đều được.
