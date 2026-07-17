# Tàu Di Sản Việt Nam

Trải nghiệm point-and-click góc nhìn thứ nhất đưa người chơi qua năm ga di sản sống từ Bắc vào Nam. Mỗi cảnh là một khung cửa tàu tĩnh; đồ vật phản hồi khi con trỏ đến gần, mở câu chuyện song ngữ, âm thanh/hoạt ảnh và hồ sơ nguồn.

## Năm ga

1. Quan họ Kinh Bắc
2. Ca trù
3. Nhã nhạc cung đình Huế
4. Nghệ thuật làm gốm của người Chăm
5. Đờn ca tài tử Nam Bộ

Mỗi ga có ba hồ sơ tương tác. Tiến độ được lưu cục bộ trong trình duyệt và có thể xuất thành JSON từ **Sổ di sản**.

## Chạy dự án

Yêu cầu Node.js 22.13 trở lên.

```bash
npm install
npm run dev
```

Kiểm tra bản phát hành:

```bash
npm run lint
npm test
```

## Trưởng tàu AI

Sao chép `.env.example` thành `.env.local` và thêm khóa API để bật phần hỏi đáp dùng OpenAI Responses API. Ngữ cảnh gửi cho mô hình chỉ gồm hồ sơ đang mở và các nguồn đã được duyệt. Kết quả bắt buộc theo schema, phải dùng mã nguồn nằm trong hồ sơ; câu hỏi ngoài phạm vi sẽ bị từ chối.

Không có khóa API, trò chơi vẫn chạy bằng chế độ tư liệu tĩnh đã kiểm chứng. Chế độ này cũng từ chối câu hỏi không liên quan thay vì đoán.

## Nguyên tắc văn hóa và bản quyền

- Không coi nội dung do AI tạo là lời nghệ nhân hoặc thẩm quyền cộng đồng.
- Không phát hành âm thanh/hình ảnh khi quyền tái sử dụng chưa rõ.
- Minh họa pixel chỉ tạo bầu không khí từ dữ kiện công khai, không tái dựng nghi lễ hoặc bí quyết hạn chế.
- Mọi thẻ nội dung hiển thị nguồn, tổ chức kiểm chứng và trạng thái quyền sử dụng.
- Trước khi dùng cho giáo dục, du lịch hoặc trưng bày công cộng, nội dung cần được nghệ nhân/chuyên gia và đại diện cộng đồng rà soát trực tiếp.

Xem [CREDITS.md](./CREDITS.md) và [research/media-manifest.json](./research/media-manifest.json) để biết nguồn, giấy phép và phạm vi sử dụng từng tài sản.
