# Nguồn, quyền sử dụng và giới hạn văn hóa

Tàu Di Sản Việt Nam là prototype diễn giải. Nội dung văn hóa chỉ được rút gọn từ các hồ sơ kiểm chứng nêu dưới đây. Việc dẫn nguồn không đồng nghĩa UNESCO, nghệ nhân hoặc cộng đồng liên quan bảo trợ cho prototype. Bản phát hành tại điểm di sản vẫn phải được nghệ nhân/chuyên gia và đại diện cộng đồng rà soát, đồng thuận.

## Hồ sơ di sản

Các trang được truy cập ngày 2026-07-17:

- [Dân ca Quan họ Bắc Ninh](https://ich.unesco.org/en/RL/quan-h-bc-ninh-folk-songs-00183)
- [Hát Ca trù](https://ich.unesco.org/en/USL/ca-tru-singing-00309)
- [Nhã nhạc, âm nhạc cung đình Việt Nam](https://ich.unesco.org/en/RL/nha-nhac-vietnamese-court-music-00074)
- [Nghệ thuật làm gốm của người Chăm](https://ich.unesco.org/en/USL/art-of-pottery-making-of-chm-people-01574)
- [Nghệ thuật Đờn ca tài tử Nam Bộ](https://ich.unesco.org/en/RL/art-of-n-ca-tai-t-music-and-song-in-southern-viet-nam-00733)

Các liên kết này xác nhận dữ kiện văn hóa. Chúng không tự động cấp quyền sao chép hình ảnh, video, giọng nói, âm nhạc hoặc phần trình diễn trên trang.

## Âm thanh di sản được phục vụ cục bộ

`public/media/ca-tru-sound-futures.ogg` là đoạn 22 giây từ [Ca Tru Club performance](https://commons.wikimedia.org/wiki/File:Ca_Tru_Club_performance.ogv), tác giả/đơn vị ghi: Sound Futures, giấy phép [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). Tệp được cắt từ khoảng giây thứ 8 và chuyển mã sang Opus trong container Ogg; nội dung biểu diễn không bị phối lại.

Nguồn mô tả đây là phần trình diễn gồm giọng Ca trù, đàn đáy và trống. Vì vậy game luôn ghi nhãn **đoạn trích cả nhóm**, không tuyên bố đây là âm thanh tách riêng của đàn đáy, phách hay trống chầu.

Đây là bản ghi di sản duy nhất hiện được game phục vụ cục bộ. Thông tin máy đọc được nằm trong `public/media/audio-manifest.json`.

## Bản ghi đang chờ quyền

Quan họ, Nhã nhạc và Đờn ca tài tử hiện chỉ có liên kết tham chiếu đến hồ sơ UNESCO. Chưa xác nhận được giấy phép tái sử dụng cho bản ghi phù hợp, nên các mục này có `src: null`, trạng thái `pending-rights`, và **không tải xuống, trích xuất, phát thay hoặc lưu lại**.

Không dùng một nhạc cụ gần giống để giả làm nhạc cụ được mô tả. Không trích âm thanh từ YouTube hoặc nền tảng khác nếu chủ thể quyền chưa cấp phép rõ ràng. Khi có bản ghi mới, cần lưu bằng chứng về người biểu diễn, người ghi/nhà sản xuất, chủ thể quyền, giấy phép, phạm vi lãnh thổ, thời hạn, quyền rút lại và yêu cầu ghi công.

## Âm thanh mới do dự án tạo

Sáu nền âm thanh nhẹ — toa tàu và năm ga — được tổng hợp trong trình duyệt bằng mã của prototype, không lấy mẫu từ bản ghi bên ngoài. Đây là **thiết kế âm thanh hiện đại trung tính**, không phải âm nhạc truyền thống, bản ghi thực địa hay mô phỏng giai điệu di sản.

Hai hiệu ứng cho thao tác đất và lửa cũng được tổng hợp trong trình duyệt. Chúng chỉ hỗ trợ hoạt ảnh, không phải âm thanh thực địa, không mô tả bí quyết nghề và không đại diện cho một lần làm/nung gốm Chăm thực tế. Mã tạo âm thanh thuộc giấy phép MIT cùng mã nguồn dự án; không có tệp ghi âm được cấp phép riêng dưới tên cộng đồng.

## Minh họa pixel

Năm cảnh trong `public/scenes/` và ảnh giới thiệu là minh họa gốc do OpenAI ImageGen tạo cho prototype dựa trên phần mô tả công khai trong các hồ sơ UNESCO. Chúng là không gian diễn giải, không phải ảnh tư liệu, bản phục dựng nghi lễ hoặc lời xác nhận của nghệ nhân.

Không có thư mục ảnh tham khảo bên ngoài được phân phối cùng dự án. Danh mục tài sản thực tế nằm trong `research/media-manifest.json`.

## Giấy phép dự án

Giấy phép MIT chỉ áp dụng cho mã nguồn. Nội dung và tài sản truyền thông giữ điều kiện riêng ghi tại đây và trong manifest; MIT không cấp lại quyền đối với bản ghi Ca trù CC BY 3.0, nội dung nguồn UNESCO hay quyền văn hóa của cộng đồng.

## Điều kiện trước khi phát hành tại cộng đồng

Trước khi triển khai chính thức cần có biên bản rà soát nội dung và phát âm, quy tắc ghi công, quyền đồng ý/rút lại, phạm vi lưu trữ, thời hạn sử dụng, quyền truy cập bản lưu trữ và giấy phép cho từng bản ghi từ nghệ nhân/chuyên gia cùng đại diện cộng đồng có thẩm quyền. Nội dung chưa qua bước này phải được ghi rõ là “kiểm chứng nguồn tư liệu, đang chờ cộng đồng rà soát”.
