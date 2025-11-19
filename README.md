# OCR Invoice Annotation Tool

Công cụ gán nhãn dữ liệu chuyên dụng cho bài toán **OCR Hóa đơn (Invoice Extraction)**.
Được tùy biến từ mã nguồn mở [imglab](https://github.com/NaturalIntelligence/imglab), tối ưu hóa giao diện và luồng làm việc để nhập liệu nhanh chóng và chính xác nhất.

## 🚀 Tính năng nổi bật

* **Chuyên biệt cho Hóa đơn:** Giao diện chỉ tập trung vào việc vẽ khung và nhập liệu văn bản.
* **Tự động hóa quy trình (Auto-focus):**
    * Tự động mở ảnh ngay khi tải lên.
    * Con trỏ chuột tự động nhảy vào ô nhập liệu ngay khi vẽ xong khung.
    * Hỗ trợ phím tắt để thao tác nhanh không cần chuột.
* **Trực quan hóa dữ liệu (Color Coding):**
    * Tự động đổi màu khung hình dựa trên loại nhãn (Ví dụ: `Total` màu đỏ, `Date` màu xanh...).
    * Giúp kiểm tra lỗi sai bằng mắt thường cực nhanh.
* **Định dạng đầu ra chuẩn (Standard Output):**
    * Xuất file **JSON (COCO Format)** chứa đầy đủ tọa độ khung (`bbox`) và nội dung chữ OCR (`label_name`).
    * Tương thích tốt để huấn luyện các model AI như YOLO, LayoutLM, PaddleOCR.
* **Bảo mật & Riêng tư:**
    * Hoạt động 100% trên trình duyệt (Client-side).
    * Không gửi ảnh hay dữ liệu lên server lạ.

## 🛠️ Hướng dẫn cài đặt & Chạy

Dự án này là web tĩnh (HTML/CSS/JS), không cần cài đặt backend phức tạp.

### Cách 1: Chạy trực tiếp (Khuyên dùng cho Dev)
1.  Cài đặt **Visual Studio Code**.
2.  Cài Extension **Live Server**.
3.  Chuột phải vào file `imglab/index.html` -> Chọn **Open with Live Server**.

### Cách 2: Mở bằng trình duyệt
1.  Vào thư mục `imglab`.
2.  Click đúp vào file `index.html` để mở trên Chrome/Edge.

---

## 📖 Hướng dẫn sử dụng (Workflow)

### 1. Tải ảnh
* Bấm vào biểu tượng **Image** ở góc dưới bên trái.
* Chọn một ảnh hóa đơn.

### 2. Gán nhãn (Labeling)
* **Vẽ khung:** Dùng chuột vẽ hình chữ nhật quanh vùng thông tin (Ví dụ: Số tiền, Ngày tháng).
* **Nhập liệu:**
    * Bảng nhập liệu bên phải sẽ tự hiện ra.
    * **Category (Label):** Nhập loại thông tin (VD: `Total`, `ItemName`...). Hệ thống sẽ gợi ý sẵn.
    * **Content (Value):** Nhập chính xác chữ trên hóa đơn (VD: `100.000`, `20/10/2023`).
* **Lưu nhãn:** Nhấn **Enter** hoặc click ra ngoài để lưu. Khung sẽ đổi màu tương ứng.

### 3. Phím tắt (Shortcuts)
| Phím tắt | Chức năng |
| :--- | :--- |
| `Alt` + `R` | Chọn công cụ vẽ hình chữ nhật (Mặc định) |
| `Alt` + `M` | Chọn công cụ di chuyển (Move) |
| `Ctrl` + `C` | Copy khung đang chọn |
| `Ctrl` + `V` | Paste khung đã copy |
| `Del` | Xóa khung đang chọn |
| `Ctrl` + `E` | Xuất dữ liệu (Save) |

### 4. Xuất dữ liệu (Export)
* Bấm vào biểu tượng **Menu** (3 gạch ngang góc trên trái).
* Chọn **Save Data**.
* Chọn **COCO JSON** để lấy file dữ liệu huấn luyện chuẩn.

---

## 🎨 Bảng màu mặc định (Color Coding)

Các loại nhãn sẽ được tô màu tự động để dễ phân biệt:

* <span style="color:rgb(139, 0, 0)">■</span> **ItemName**: Đỏ thẫm
* <span style="color:rgb(255, 69, 0)">■</span> **ItemNameValue**: Cam đỏ
* <span style="color:rgb(0, 100, 0)">■</span> **Quantity**: Xanh lá đậm
* <span style="color:rgb(50, 205, 50)">■</span> **QuantityValue**: Xanh lá mạ
* <span style="color:rgb(0, 0, 139)">■</span> **UnitPrice**: Xanh dương đậm
* <span style="color:rgb(30, 144, 255)">■</span> **UnitPriceValue**: Xanh dương nhạt
* <span style="color:rgb(75, 0, 130)">■</span> **Amount**: Tím chàm
* <span style="color:rgb(255, 0, 255)">■</span> **AmountValue**: Tím hồng
* <span style="color:rgb(192, 192, 192)">■</span> **Other**: Xám

*(Có thể chỉnh sửa bảng màu trong file `js/config.js`)*
