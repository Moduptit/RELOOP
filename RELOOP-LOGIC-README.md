# RELOOP — README Logic Nghiệp Vụ
### Warehouse Allocation Engine + Return Intelligence cho thời trang TMĐT Việt Nam

> Tài liệu này trả lời một câu hỏi duy nhất nhưng bao trùm toàn bộ sản phẩm:
> **"Khi một sản phẩm thời trang được hoàn về, RELOOP nghĩ gì và làm gì — và vì sao điều đó đáng giá bằng tiền thật cho doanh nghiệp?"**
>
> Tài liệu được viết theo góc nhìn senior e-commerce/reverse-logistics, không phải góc nhìn "tính năng cho đẹp". Mọi mục đều trả lời: *nó giải quyết vấn đề vận hành nào, và tiết kiệm/tạo ra tiền ở đâu.*

---

## 0. Định vị lại RELOOP — nó KHÔNG phải cái gì

Trước khi nói RELOOP là gì, cần nói rõ nó **không phải** gì, vì thị trường phần mềm hoàn hàng quốc tế đã rất đông và dễ nhầm lẫn định vị.

| Nhóm sản phẩm đã có trên thị trường | Họ làm gì | RELOOP có làm việc này không |
|---|---|---|
| **Loop Returns, ReturnGO, Return Prime** | Cổng tự hoàn/đổi hàng cho khách (returns portal), khuyến khích đổi hàng thay vì hoàn tiền để giữ doanh thu | ❌ Không — đây là lớp "trải nghiệm khách hàng", RELOOP không cạnh tranh ở đây |
| **Narvar, AfterShip** | Theo dõi đơn hàng + trải nghiệm hậu mãi toàn diện, tập khách hàng doanh nghiệp lớn | ❌ Không — quá rộng, quá nặng hạ tầng, không dành cho SME VN |
| **Happy Returns** | Mạng lưới điểm trả hàng vật lý (drop-off không cần hộp/nhãn) | ❌ Không — RELOOP không vận hành hạ tầng vật lý |
| **Optoro (Smart Disposition)** | Định tuyến "next-best-home" cho hàng hoàn theo thời gian thực — **đây là sản phẩm gần nhất về mặt khái niệm** | ⚠️ Gần giống phần lõi RECOVER, nhưng Optoro vận hành ở quy mô doanh nghiệp lớn (IKEA, Best Buy), cần hạ tầng scan ảnh/mã vạch, và không có mặt tại Việt Nam |

**Khoảng trống thật sự RELOOP nhắm tới**, và không sản phẩm nào trong bảng trên làm đúng việc này:

> Không ai trong số các nền tảng trên trả lời câu hỏi **"hàng hoàn này nên nằm ở kho nào để bán hết nhanh nhất và lời nhất"** dành riêng cho một shop thời trang VN có 2+ kho/kênh — và **không ai biến dữ liệu hoàn hàng thành khuyến nghị nhập hàng đợt sau** để chủ shop đỡ đọng vốn vào đúng sai lầm cũ.

RELOOP đứng ở **giữa** hai đầu: sau lớp "khách hàng tạo yêu cầu hoàn" (RELOOP không làm — có thể tích hợp với KiotViet/Sapo/Shopee sẵn có), và trước lớp "quyết định nhập hàng đợt sau" (RELOOP là nguồn dữ liệu đầu vào cho quyết định đó).

Quy mô vấn đề đủ lớn để đầu tư nghiêm túc: thị trường phần mềm quản lý hoàn hàng toàn cầu đang tăng từ 13,26 tỷ USD (2025) lên dự kiến 26,38 tỷ USD (2035); tỷ lệ hoàn ngành thời trang dao động 22–30%, cao hơn hẳn mức trung bình bán lẻ; chi phí xử lý thủ công một lượt hoàn có thể ngốn tới 27% giá trị đơn hàng; và 71% khách hàng từng có trải nghiệm hoàn hàng tệ sẽ không quay lại mua nữa *(Nguồn: NRF 2025 Retail Returns Landscape; Claimlane/Pango/LateShipment industry reports 2026)*.

---

## 1. Hai trụ cột logic của RELOOP

```
                    ┌─────────────────────────┐
   Hàng hoàn về ──▶ │   TRỤ CỘT A: RECOVER     │──▶ Đề xuất kho/kênh xử lý
                    │  (Warehouse Allocation)  │    cho TỪNG sản phẩm hoàn
                    └─────────────────────────┘
                              │
                              │ mọi lượt hoàn đều được ghi log đầy đủ
                              ▼
                    ┌─────────────────────────┐
                    │   TRỤ CỘT B: INSIGHT     │──▶ Khuyến nghị nhập hàng,
                    │ (Return Intelligence &   │    size curve, nhà cung cấp,
                    │  Purchasing Analytics)   │    phân khúc khách hàng
                    └─────────────────────────┘
                              │
                              ▼
                    Vốn lưu động được bảo toàn ở ĐỢT NHẬP HÀNG TIẾP THEO
                    (không lặp lại sai lầm cũ), KHÔNG chỉ tiết kiệm ở
                    lượt xử lý hoàn hiện tại.
```

Đây là điểm quan trọng nhất cần hiểu: **Trụ cột A tiết kiệm tiền ở hiện tại** (xử lý đúng lô hàng hoàn đang có). **Trụ cột B tiết kiệm tiền ở tương lai** (không lặp lại sai lầm khi nhập/sản xuất đợt sau). Một sản phẩm chỉ làm Trụ cột A thì mới là "công cụ vận hành". Có cả B thì mới thực sự là "công cụ chiến lược" xứng đáng thu phí cao hơn và giữ chân khách hàng lâu hơn — vì B tạo ra một lý do để chủ shop quay lại xem RELOOP mỗi tuần/tháng, không chỉ khi có hàng hoàn cần xử lý.

---

## 2. TRỤ CỘT A — Warehouse Allocation Engine (RECOVER)

### 2.1. Bài toán chính xác

Cho một sản phẩm hoàn về, tìm điểm đến (đích) làm **tối đa hóa Giá trị thu hồi ròng (Net Recovery Value)**, trong khi **tuân thủ các ràng buộc vận hành thật** (không được phép đề xuất một phương án không khả thi, dù nó có con số đẹp trên giấy).

### 2.2. Input engine cần (chi tiết theo từng nhóm)

| Nhóm dữ liệu | Trường cụ thể | Vì sao cần |
|---|---|---|
| **Sản phẩm hoàn** | SKU, size, màu, tình trạng (như mới/lỗi nhẹ/hư hỏng), lý do hoàn, kho hiện tại | Xác định giá trị còn lại và các phương án khả thi |
| **Trạng thái đa kho** | Sức chứa còn trống từng kho, tồn kho hiện có của CHÍNH SKU đó ở từng kho, vai trò kho (kho chính/kho vùng/outlet) | Tránh đề xuất chuyển hàng vào một kho đã dư thừa đúng SKU đó — đây là lỗi phổ biến nhất nếu chỉ nhìn giá mà không nhìn tồn kho đích |
| **Vận chuyển liên kho** | Chi phí/thời gian theo từng cặp kho (ma trận lane) | Là chi phí trực tiếp trừ vào giá trị thu hồi |
| **Kênh bán** | Phí sàn/kênh, mức chiết khấu điển hình theo kênh (kênh chính/outlet/kênh thứ cấp/thanh lý) | Giá bán kỳ vọng khác nhau hoàn toàn theo kênh |
| **Tín hiệu nhu cầu** | Chỉ số nhu cầu theo SKU (bán nhanh/chậm), theo mùa vụ/bộ sưu tập | Ảnh hưởng trực tiếp đến giá bán kỳ vọng và tốc độ thu hồi |
| **Lịch sử bán theo vùng** *(nâng cao)* | Tốc độ bán trung bình của SKU/danh mục tương tự theo từng khu vực | Cho phép engine "học" khu vực nào bán nhanh loại sản phẩm nào, thay vì giả định đồng đều |

### 2.3. Công thức lõi

```
Giá trị thu hồi ròng (Net Recovery Value) =
      Giá bán kỳ vọng tại điểm đến
    − Chi phí vận chuyển đến điểm đến
    − Chi phí xử lý / tân trang
    − Chi phí lưu kho ước tính tại điểm đến
```

Đây là **tính toán tối ưu hóa có ràng buộc thuần túy** — không phải machine learning. Điều này phải được nói rõ và giữ vững ở mọi phiên bản MVP: một hội đồng kỹ thuật hoặc nhà đầu tư có kinh nghiệm sẽ luôn hỏi "phần nào là AI thật", và câu trả lời trung thực (arithmetic tường minh, có thể truy vết từng số) đáng tin hơn nhiều so với việc gắn mác mơ hồ.

### 2.4. Sáu điểm đến được xét (không nhiều hơn, không ít hơn — đủ để bao phủ mọi thực tế vận hành)

1. **Giữ tại kho hiện tại** — baseline, luôn được tính để so sánh mức độ "tăng thêm" của các phương án khác
2. **Chuyển về kho chính** — khi kho chính có nhu cầu/giá bán tốt hơn
3. **Chuyển sang kho khác** (kho vùng) — khi một kho vùng khác đang thiếu đúng SKU này (tín hiệu tồn kho thấp = cơ hội bán nhanh hơn)
4. **Outlet** — bán với giá chiết khấu, thường phù hợp hàng lỗi nhẹ hoặc tồn lâu
5. **Kênh thứ cấp** — sàn đồ si/kênh giảm giá riêng, tốc độ thu hồi nhanh, giá thấp hơn
6. **Thanh lý** — phương án cuối, luôn phải khả thi để làm "lưới an toàn" khi mọi phương án khác không khả thi

### 2.5. Ràng buộc khả thi — engine KHÔNG BAO GIỜ được đề xuất phương án không khả thi

| Ràng buộc | Ý nghĩa vận hành thật |
|---|---|
| Sức chứa kho đích | Kho đích còn đủ chỗ vật lý để nhận thêm hàng |
| Tồn kho dư thừa cùng SKU | Không dồn thêm hàng vào nơi đã ế đúng loại đó — đây là lỗi logic nghiêm trọng nhất nếu bỏ qua |
| Tính khả dụng điểm đến | VD outlet đang đóng cửa tạm thời, kênh thứ cấp ngừng nhận hàng |
| Khả năng vận chuyển | Có tuyến vận chuyển thực tế nối hai kho hay không |
| Tính hợp lệ của xử lý | VD hàng hư hỏng nặng không nên đưa vào kênh bán chính dù giá trên giấy tính ra cao |

**Nguyên tắc bất biến:** nếu KHÔNG có phương án nào khả thi (trường hợp cực hiếm), engine phải báo lỗi rõ ràng để con người can thiệp — **tuyệt đối không được âm thầm chọn đại một phương án không khả thi** chỉ vì nó có con số tốt nhất trên giấy.

### 2.6. Những phần nâng cao một senior sẽ bổ sung (v2 — chưa cần cho MVP thi, nhưng cần biết để không thiết kế bít lối)

1. **Gộp lô để tối ưu vận chuyển (Batching):** Thay vì quyết định từng sản phẩm đơn lẻ, engine nên nhận diện khi nhiều sản phẩm hoàn cùng lúc có cùng điểm đến tối ưu, để gộp thành một lô vận chuyển — chi phí vận chuyển theo lô (FTL/LTL) rẻ hơn nhiều so với từng đơn lẻ. Đây là cách các hệ thống logistics thật vận hành, và là chỗ RELOOP có thể tạo giá trị lớn hơn Optoro (vốn quyết định theo thời gian thực từng món một).
2. **Giá trị suy giảm theo thời gian (Time decay):** Giá bán kỳ vọng của một sản phẩm không cố định — mỗi ngày sản phẩm chưa được xử lý là một ngày mất giá trị (hết mùa, hết trend). Engine nên coi "giá bán kỳ vọng" là hàm số theo *số ngày dự kiến còn lại trước khi hành động*, không phải hằng số. Đây chính là ý tưởng "đồng hồ mất giá" từng được thảo luận và loại bỏ vì bị coi là "tính năng phụ" — thực ra nó nên tồn tại như một **thành phần trong công thức tính giá bán kỳ vọng**, không phải một tính năng riêng biệt cần demo.
3. **Dải tin cậy (Confidence band):** Với SKU có ít dữ liệu lịch sử, engine nên hiển thị rõ đây là ước tính có độ tin cậy thấp, thay vì hiển thị một con số chính xác giả tạo — tránh việc chủ shop ra quyết định dựa trên một con số "chắc như đinh đóng cột" nhưng thực ra chỉ dựa trên 2 lượt bán lịch sử.
4. **Ghi đè có kiểm soát (Human override + audit trail):** Nhân viên kho luôn có quyền chọn khác đề xuất của engine — nhưng lý do ghi đè phải được lưu lại. Đây chính là nguồn dữ liệu quý để sau này hiệu chỉnh lại engine (nối trực tiếp với giai đoạn LEARN).
5. **Ngưỡng tự động hóa theo giá trị:** Với sản phẩm giá trị thấp, có thể cho engine tự động thực thi đề xuất; với sản phẩm giá trị cao, luôn yêu cầu xác nhận của con người trước khi thực thi — cân bằng giữa tốc độ và rủi ro.

---

## 3. TRỤ CỘT B — Return Intelligence & Purchasing Analytics (giúp tiết kiệm vốn lưu động)

Đây là phần trả lời trực tiếp yêu cầu **"thu thập dữ liệu hoàn để đưa ra thống kê về mặt hàng hoặc khách hàng tiềm năng giúp doanh nghiệp có lựa chọn tốt nhất, save tiền cho vốn lưu động"**.

### 3.1. Nguyên lý cốt lõi — vì sao đây là nơi tiết kiệm tiền lớn nhất

> **Một lượt hoàn hàng không chỉ là một sản phẩm cần xử lý — nó là một điểm dữ liệu về một QUYẾT ĐỊNH NHẬP HÀNG ĐÃ SAI.**

Khi một chiếc áo size M liên tục bị hoàn vì "chật hơn dự kiến", đó không phải lỗi của một khách hàng — đó là tín hiệu rằng **form dáng của size M trong bộ sưu tập này sai**, và nếu chủ shop tiếp tục nhập/sản xuất theo đúng tỷ lệ size cũ ở đợt sau, họ sẽ **lặp lại chính xác số vốn đã mất** ở đợt trước. RELOOP biến hàng trăm lượt hoàn rời rạc thành một bức tranh tổng hợp, xuất hiện **trước khi** tiền được chi ra cho đợt nhập hàng tiếp theo — đây là điểm khác biệt quan trọng nhất so với việc "biết vấn đề sau khi tiền đã mất".

### 3.2. Các module phân tích cụ thể

#### Module 1 — Bảng xếp hạng tỷ lệ hoàn theo SKU/bộ sưu tập
Liệt kê SKU có tỷ lệ hoàn vượt xa mức trung bình của shop. Đây là danh sách đầu tiên chủ shop nên xem trước khi quyết định có nhập lại một mẫu hay không.
**Hành động cụ thể sinh ra:** dừng nhập lại / đàm phán lại với xưởng / sửa lại mô tả sản phẩm trên gian hàng.

#### Module 2 — Chẩn đoán bảng size (Size curve diagnostics)
Với một sản phẩm, tách tỷ lệ hoàn theo TỪNG SIZE riêng biệt, và với mỗi size, tách tiếp theo LÝ DO hoàn (size nhỏ/size lớn/không hợp form).
**Hành động cụ thể sinh ra:** điều chỉnh tỷ lệ số lượng từng size trong đơn đặt hàng/sản xuất tiếp theo — đây là chỗ **tiết kiệm vốn lưu động trực tiếp và định lượng được**: nếu size M luôn dư 20% do bị hoàn nhiều, đợt sau giảm 20% số lượng size M nhập vào = giảm đúng số vốn đó không bị đọng trong kho.

#### Module 3 — Chẩn đoán màu sắc / chất liệu
Tương tự Module 2 nhưng theo biến thể màu — màu nào bị hoàn nhiều vì "không giống ảnh" hoặc "không hợp".
**Hành động cụ thể sinh ra:** giảm số lượng nhập các màu có vấn đề, hoặc chụp lại ảnh sản phẩm đúng màu thật.

#### Module 4 — Tín hiệu chất lượng theo lô hàng/nhà cung cấp *(cần bổ sung field "mã lô/nhà cung cấp" vào dữ liệu tồn kho — xem mục 4)*
Nếu lý do "lỗi chất lượng/hư hỏng" tập trung bất thường vào một lô sản xuất hoặc một nhà cung cấp cụ thể, đây là tín hiệu sớm về vấn đề chất lượng nguồn cung — phát hiện được TRƯỚC KHI nó lặp lại ở một đơn đặt hàng lớn hơn với cùng nhà cung cấp.
**Hành động cụ thể sinh ra:** yêu cầu kiểm tra chất lượng chặt hơn với nhà cung cấp đó, hoặc chuyển một phần đơn hàng sang nhà cung cấp khác.

#### Module 5 — Phân khúc khách hàng theo hành vi hoàn
Không phải mọi khách hàng hoàn hàng nhiều đều "xấu": tách hai nhóm rõ ràng —
- **Nhóm rủi ro cao:** hoàn nhiều, không mua lại, gây tốn chi phí xử lý hai chiều liên tục
- **Nhóm khách hàng tiềm năng bị bỏ sót:** đổi size/đổi màu rồi mua lại ngay, hoặc hoàn nhưng quay lại mua sản phẩm khác trong vòng ngắn — đây thực chất là khách hàng gắn bó, chỉ cần được hỗ trợ đúng (gợi ý đúng size) là sẽ mua nhiều hơn

**Hành động cụ thể sinh ra:** với nhóm rủi ro cao — cân nhắc chính sách xác nhận đơn kỹ hơn hoặc giới hạn COD; với nhóm tiềm năng — đưa vào danh sách chăm sóc/marketing riêng (gợi ý sản phẩm đúng size, ưu đãi đổi hàng dễ dàng hơn để giữ chân).

#### Module 6 — Bảng điều khiển "Vốn lưu động" (Working Capital Dashboard) — **module quan trọng nhất để thuyết phục chủ shop trả tiền cho RELOOP**
Dịch toàn bộ các phân tích trên thành **một con số tiền cụ thể**, thay vì biểu đồ trừu tượng:
- "Vốn đang bị giam trong hàng hoàn chưa xử lý: **X đồng**"
- "Có thể thu hồi thêm **Y đồng** trong 7 ngày tới nếu áp dụng đúng đề xuất phân bổ của RELOOP"
- "Ước tính tiết kiệm **Z đồng** vốn nhập hàng đợt tới nếu điều chỉnh size curve theo khuyến nghị Module 2"

Đây là lý do một chủ shop mở RELOOP lên **mỗi tuần**, không chỉ khi có hàng hoàn cần xử lý — vì nó trả lời câu hỏi họ luôn quan tâm nhất: "tiền của tôi đang ở đâu, và tôi có đang lặp lại sai lầm không".

#### Module 7 — Khuyến nghị nhập hàng đợt sau (Reorder Recommendation)
Đầu ra hành động trực tiếp nhất, tổng hợp từ Module 1–4: một danh sách cụ thể "Với đợt nhập hàng tiếp theo, nên: giảm X% size M của mẫu A, bỏ màu B của mẫu C, xem lại nhà cung cấp D". Đây là cầu nối trực tiếp nhất từ "dữ liệu" sang "tiền được tiết kiệm thật".

---

## 4. Mô hình dữ liệu cần bổ sung so với bản domain hiện có

Nếu đã có domain model cơ bản (Product/SKU, Warehouse, Return, RecoveryRecommendation...), để Trụ cột B hoạt động đầy đủ cần bổ sung:

| Entity mới | Vì sao cần |
|---|---|
| `SupplyBatch` (Lô hàng/Nhà cung cấp) | Bắt buộc cho Module 4 — nếu không có trường này, không thể truy vết vấn đề chất lượng về đúng nguồn |
| `ReorderRecommendation` | Đầu ra chuẩn hóa của Module 7, có thể export ra file cho chủ shop mang đi làm việc với xưởng |
| `WorkingCapitalSnapshot` | Số liệu tổng hợp theo thời điểm cho Module 6, tính lại định kỳ (hàng ngày/tuần) |
| `CustomerSegment` | Gắn nhãn phân khúc (rủi ro cao / tiềm năng) cho Module 5, cập nhật định kỳ chứ không tính lại mỗi lần xem |

`RecoveryOutcome` (đã có trong domain cũ) cần được **thực sự ghi nhận và nối vào** vòng LEARN — hiện tại đây là phần "đã thiết kế nhưng chưa nối dây" trong các phiên bản trước, và nó chính là nguồn dữ liệu nuôi cả Trụ cột A (hiệu chỉnh ước tính) lẫn Trụ cột B (biết được đề xuất nào thực sự đúng).

---

## 5. Rủi ro & giới hạn cần lường trước (nhìn thẳng, không né tránh)

| Rủi ro | Mức độ | Cách giảm thiểu |
|---|---|---|
| **Dữ liệu quá ít với SKU/shop nhỏ** → mọi con số thống kê (tỷ lệ hoàn theo size, theo màu) không đủ tin cậy | Cao, đặc biệt với SME mới bắt đầu | Luôn hiển thị kèm "độ tin cậy"/số mẫu, không đưa con số như một sự thật tuyệt đối khi mẫu quá nhỏ (VD dưới 10 lượt hoàn) |
| **Không có dữ liệu lô/nhà cung cấp** ở nhiều hệ thống quản lý bán hàng VN hiện tại | Cao — đây là rào cản áp dụng thực tế của Module 4 | Thiết kế "graceful degradation": Module 4 tự ẩn hoặc hiển thị dạng "cần bổ sung dữ liệu" nếu shop chưa theo dõi lô hàng, không được ép buộc |
| **Tự động hóa sai ở lô giá trị cao** nếu để engine tự thực thi mà không qua người duyệt | Trung bình — ảnh hưởng niềm tin nếu xảy ra | Giữ nguyên tắc ngưỡng tự động hóa theo giá trị (mục 2.6.5), luôn log đầy đủ để truy vết |
| **Cảm giác "theo dõi khách hàng"** nếu lộ điểm rủi ro ra bên ngoài | Trung bình — rủi ro về trải nghiệm khách hàng/đạo đức dữ liệu | Toàn bộ chấm điểm khách hàng chỉ phục vụ nội bộ vận hành, không bao giờ hiển thị trực tiếp cho khách hàng cuối dưới dạng "điểm rủi ro" |
| **Phóng đại "AI"** khi bản chất là thống kê/tối ưu hóa tường minh | Cao về mặt uy tín kỹ thuật khi trình bày trước hội đồng/nhà đầu tư có chuyên môn | Luôn phân tách rõ "tính toán tất định" (formula) và "thống kê minh bạch" (rate lookup) — không gọi bất kỳ phần nào là "machine learning" trừ khi thực sự có mô hình huấn luyện trên dữ liệu thật |
| **Phụ thuộc chất lượng tích hợp dữ liệu đầu vào** (đơn hàng, tồn kho từ hệ thống bán hàng có sẵn của shop) | Cao về mặt triển khai thực tế | MVP nên chấp nhận nhập liệu thủ công/CSV trước, tích hợp API sau — đừng để việc "chưa tích hợp được" chặn đứng việc chứng minh giá trị cốt lõi |

---

## 6. Tóm tắt một câu cho từng trụ cột (dùng khi thuyết trình)

- **RECOVER:** *"Với mỗi sản phẩm hoàn về, RELOOP tính ngay nó nên nằm ở kho nào để bán nhanh và lời nhất — dựa trên số liệu thật, không dựa vào cảm tính nhân viên."*
- **INSIGHT:** *"RELOOP biến hàng trăm lượt hoàn rời rạc thành một bản khuyến nghị cho đợt nhập hàng tiếp theo — để doanh nghiệp không bỏ tiền ra mua lại đúng sai lầm cũ."*
