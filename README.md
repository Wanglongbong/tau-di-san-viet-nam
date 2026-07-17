# Tàu Di Sản Việt Nam

Một trải nghiệm point-and-click góc nhìn thứ nhất đưa người chơi lên chuyến tàu pixel Bắc–Nam. Người chơi nói hoặc chọn một trong năm ga, khám phá đồ vật trong cảnh và mở hồ sơ song ngữ có nguồn, quyền sử dụng và trạng thái kiểm duyệt rõ ràng.

## Trải nghiệm chính

- Landing page hiện tại dẫn vào khoang tàu pixel chuyển động nhẹ.
- Trưởng tàu kiểm vé bằng hội thoại chữ và hỏi điểm đến.
- Nút giữ để nói ghi tối đa 6 giây, gửi tệp WebM tạm thời để OpenAI phiên âm tiếng Việt, rồi đối chiếu bằng bộ nhận diện ga xác định trước.
- Năm ga: Quan họ Kinh Bắc, Ca trù Hà Nội, Nhã nhạc Huế, gốm Chăm và Đờn ca tài tử Nam Bộ.
- Hotspot phát sáng khi con trỏ đến gần; khi mở sẽ phát bản ghi được cấp phép nếu có, hiện hoạt ảnh khái quát hoặc mở hồ sơ tư liệu.
- Mỗi hồ sơ có ba câu hỏi gợi ý. Trưởng tàu AI chỉ được trả lời từ ngữ cảnh và danh sách nguồn đã duyệt, đồng thời phải trả về mã nguồn hợp lệ.
- Nhạc nền là soundscape hiện đại, trung tính, được tạo riêng cho trải nghiệm; không được trình bày như âm nhạc di sản.
- Sổ di sản lưu tiến độ trên thiết bị và có thể xuất metadata JSON.

## Nguyên tắc văn hóa

Độ trung thực văn hóa là ràng buộc cao nhất của dự án:

- Không coi nội dung AI là lời nghệ nhân hoặc thẩm quyền cộng đồng.
- Không mô phỏng bí quyết, nghi lễ hoặc âm thanh nhạc cụ khi chưa có căn cứ và quyền sử dụng rõ ràng.
- Âm thanh biểu diễn tổng thể phải được ghi nhãn đúng; không gọi một bản hòa tấu là âm thanh riêng của một nhạc cụ.
- Thiếu nguồn thì hệ thống từ chối trả lời, không đoán.
- Trước khi dùng tại điểm di sản, toàn bộ nội dung cần được nghệ nhân/chuyên gia và đại diện cộng đồng có thẩm quyền rà soát trực tiếp.

Xem [CREDITS.md](./CREDITS.md) và [research/media-manifest.json](./research/media-manifest.json) để biết nguồn, giấy phép và phạm vi dùng của từng tài sản.

## Chạy cục bộ

Yêu cầu Node.js 22.13 trở lên.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Để bật hỏi đáp và nhận dạng giọng nói, đặt `OPENAI_API_KEY` trong `.env.local`. Không đưa khóa này vào mã nguồn, trình duyệt hoặc GitHub. Nếu không có khóa, toàn bộ phần khám phá vẫn chạy và hỏi đáp chuyển sang chế độ tư liệu tĩnh đã kiểm chứng.

Kiểm tra bản phát hành:

```bash
npm run lint
npm test
```

## API

- `POST /api/transcribe`: nhận `multipart/form-data` gồm `audio`, `language` và `sessionId`; tệp tối đa 3 MB, không được lưu bởi ứng dụng.
- `POST /api/guide`: nhận ga, hotspot, câu hỏi, ngôn ngữ và `sessionId`; câu trả lời dùng OpenAI Responses API với Structured Outputs.

Giới hạn tốt nhất theo phiên trình duyệt: 6 lượt phiên âm/phút và 12 câu hỏi/phút. Đây là lớp bảo vệ cho prototype, không thay thế rate limiting phân tán ở quy mô sản xuất.

## Quyền sử dụng

Mã nguồn được phát hành theo [MIT License](./LICENSE). Giấy phép MIT **không** áp dụng chung cho nội dung văn hóa, bản ghi, ảnh minh họa hoặc tài sản media; từng tài sản tuân theo điều khoản ghi trong `CREDITS.md` và media manifest.
