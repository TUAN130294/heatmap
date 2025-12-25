# 🗺️ ERABLUE ENTERPRISE DASHBOARD

## Hệ thống Phân tích Địa lý & Business Intelligence cho Chuỗi Siêu thị Điện máy

---

## 📋 Tổng quan

**Erablue Enterprise Dashboard** là một ứng dụng web phân tích dữ liệu địa lý (GeoSpatial Analytics) và Business Intelligence (BI) được thiết kế dành riêng cho chuỗi siêu thị điện máy Erablue tại khu vực Jakarta, Indonesia.

Ứng dụng cho phép quản lý và phân tích:
- 📍 Vị trí các siêu thị Erablue
- 🔥 Phân bố khách hàng qua Heatmap
- 🏢 Theo dõi và phân tích đối thủ cạnh tranh
- 📊 Các chỉ số kinh doanh (KPI) và doanh thu
- 🎯 Cơ hội mở rộng thị trường

---

## 🎨 Giao diện Enterprise

### Thiết kế UI/UX
- **Theme**: Dark Mode chuyên nghiệp, phong cách Enterprise
- **Color Palette**: 
  - Deep Space: `#0f1115`
  - Surface Dark: `#1A1D23`
  - Primary Blue: `#1e70eb`
  - Border Dark: `#282f39`
- **Typography**: Inter (Display), Roboto Mono (Monospace)
- **Icons**: Google Material Symbols Outlined
- **Framework**: Tailwind CSS

### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│                         HEADER                                   │
│  [Logo] Erablue Dashboard    [City Filter]  [Clear] [Export]    │
├────────────────┬────────────────────────────────┬───────────────┤
│                │                                │               │
│   LEFT PANEL   │         MAP AREA               │  RIGHT PANEL  │
│                │                                │               │
│  - Filters     │    [Leaflet Map + Layers]     │  - Stats      │
│  - Sliders     │                                │  - Top Stores │
│  - Toggles     │    [Heatmap]                   │  - KPIs       │
│  - BI Tools    │    [Store Markers]             │               │
│  - Analysis    │    [Competitor Markers]        │               │
│  - Export      │    [Coverage Zones]            │               │
│                │                                │               │
└────────────────┴────────────────────────────────┴───────────────┘
```

---

## ⚙️ Tính năng Chi tiết

### 1. 🗺️ Map Visualization

#### Layers (Có thể bật/tắt)
| Layer | Mô tả |
|-------|-------|
| **Stores** | Hiển thị vị trí các siêu thị Erablue (marker xanh dương) |
| **Competitors** | Hiển thị vị trí đối thủ cạnh tranh (marker đỏ) |
| **Heatmap** | Bản đồ nhiệt theo mật độ đơn hàng |
| **Coverage** | Vùng phủ sóng của các store với bán kính tùy chỉnh |

#### Store Popup
Khi click vào marker siêu thị Erablue, hiển thị:
- 📛 Tên store và địa chỉ
- 📦 Số lượng đơn hàng
- 💰 Tổng doanh thu (Rp Million)
- 📊 Giá trị trung bình/đơn
- 📍 Khoảng cách giao hàng TB
- 🔥 Nút xem Heatmap riêng
- 📊 Nút phân tích chi tiết

---

### 2. 🎚️ Interactive Controls

#### Sliders
| Slider | Range | Chức năng |
|--------|-------|-----------|
| **Coverage Radius** | 1-10 km | Điều chỉnh bán kính vùng phủ sóng |
| **Heatmap Intensity** | 10-50 | Điều chỉnh độ đậm heatmap |
| **Analysis Radius** | 1-10 km | Bán kính khu vực phân tích khi click |
| **Grid Size** | 1-5 km | Kích thước ô lưới cho Grid Analysis |

#### Toggles
- ✅ **Stores**: Bật/tắt marker siêu thị
- ✅ **Competitors**: Bật/tắt marker đối thủ
- ✅ **Heatmap**: Bật/tắt bản đồ nhiệt
- ✅ **Coverage**: Bật/tắt vùng phủ sóng
- ✅ **Click to Analyze**: Bật chế độ click phân tích

---

### 3. 📊 Business Intelligence Module

#### Market Share Analysis
Phân tích thị phần dựa trên vùng phủ sóng:
- **Erablue Share**: % khu vực Erablue chiếm ưu thế
- **Competitor Share**: % khu vực đối thủ chiếm ưu thế
- **Contested**: % khu vực cạnh tranh cao
- **Whitespace**: % khu vực chưa được khai thác

#### Threat Assessment
Đánh giá mức độ đe dọa từ đối thủ:
- 🔴 **Critical**: Đe dọa nghiêm trọng (score >= 70)
- 🟠 **High**: Đe dọa cao (score >= 50)
- 🟡 **Medium**: Đe dọa trung bình (score >= 30)
- 🟢 **Low**: Đe dọa thấp

#### Golden Zones
Xác định các "vùng vàng" - cơ hội mở rộng:
- Vùng có đối thủ nhưng Erablue chưa phủ
- Khoảng cách đến store Erablue gần nhất
- Số đơn hàng tiềm năng trong vùng

#### Gap Analysis
Phân tích lỗ hổng phủ sóng:
- Khu vực có nhu cầu nhưng chưa có store
- Số đơn hàng và khoảng cách đến store

#### Expansion Priority
Ma trận ưu tiên mở rộng:
- **Priority A**: Mở rộng ngay (score >= 70)
- **Priority B**: Tiềm năng Q2 (score >= 55)
- **Priority C**: Theo dõi tương lai

#### Revenue Zones
Phân tích vùng doanh thu cao:
- Giá trị đơn hàng trung bình
- Tiềm năng doanh thu hàng tháng

---

### 4. 🔍 Advanced Analysis

#### Grid Analysis
Phân tích lưới với kích thước tùy chỉnh:
- Hiển thị mật độ đơn hàng theo ô lưới
- Màu sắc thể hiện mức độ hoạt động

#### Competitor Density Heatmap
Bản đồ nhiệt mật độ đối thủ:
- Gradient màu theo mức độ đe dọa
- Xanh → Vàng → Cam → Đỏ

#### CAC Analysis (Customer Acquisition Cost)
Phân tích chi phí thu hút khách hàng:
- 🟢 **High Efficiency**: CAC thấp, đầu tư thêm
- 🟡 **Medium**: Tối ưu chiến dịch
- 🔴 **Low Efficiency**: CAC cao, xem xét lại

---

### 5. 📍 Click-to-Analyze

Tính năng phân tích khu vực theo click:

**Cách sử dụng:**
1. Bật toggle "Click to Analyze"
2. Điều chỉnh "Analysis Radius" (1-10km)
3. Click vào bất kỳ vị trí trên bản đồ

**Thông tin hiển thị:**
| Metric | Mô tả |
|--------|-------|
| Đơn hàng | Số lượng đơn trong bán kính |
| Doanh thu | Tổng doanh thu khu vực |
| TB/Đơn | Giá trị trung bình mỗi đơn |
| Stores | Số store Erablue trong vùng |
| Competitors | Số đối thủ trong vùng |
| Orders/km² | Mật độ đơn hàng |

---

### 6. 💡 Strategic Insights

#### Strategic Dashboard
Tổng hợp các KPI chiến lược:
- Số lượng stores, đơn hàng, doanh thu
- Market position
- Competitor threats summary

#### AI Recommendations
Khuyến nghị hành động tự động:
- **URGENT**: Cần hành động ngay
- **CRITICAL**: Nghiêm trọng
- **HIGH**: Ưu tiên cao
- **MEDIUM**: Theo dõi

---

### 7. 🏢 Competitor Brand Filter

Lọc đối thủ theo thương hiệu:
- ✅ **Blibli Electronics** (màu xanh)
- ✅ **Electronics City** (màu cam)

---

### 8. 📤 Export Functions

| Export | Định dạng | Nội dung |
|--------|-----------|----------|
| **Full BI Report** | JSON | Báo cáo BI đầy đủ |
| **Gap Report** | JSON | Phân tích lỗ hổng |
| **Strategic Report** | JSON | Báo cáo chiến lược |
| **Data Export** | JSON | Dữ liệu tổng hợp |

---

## 📁 Cấu trúc Dự án

```
erablue-heatmap/
├── index.html                 # Trang chính (phiên bản cũ)
├── index-enterprise.html      # 🌟 Enterprise Dashboard (phiên bản mới)
├── css/
│   ├── main.css              # Styles chính
│   ├── map.css               # Styles cho map
│   ├── components.css        # Component styles
│   ├── reports.css           # BI report styles
│   └── mobile.css            # Responsive styles
├── js/
│   ├── config.js             # Cấu hình ứng dụng
│   ├── utils.js              # Utility functions
│   ├── app.js                # Main application logic
│   ├── stores.js             # Store management
│   ├── heatmap.js            # Heatmap manager
│   ├── filters.js            # Filter manager
│   ├── analytics.js          # Analytics manager
│   ├── coverage.js           # Coverage analysis
│   ├── competitors.js        # Competitor manager
│   └── strategic-intelligence.js  # BI module
├── js/data/
│   ├── stores.js             # Dữ liệu siêu thị
│   ├── orders.js             # Dữ liệu đơn hàng
│   ├── cities.js             # Dữ liệu thành phố
│   └── competitors.js        # Dữ liệu đối thủ
└── README.md                  # Tài liệu này
```

---

## 🔧 Công nghệ sử dụng

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **Leaflet.js** | 1.9.4 | Thư viện bản đồ |
| **Leaflet.heat** | 0.2.0 | Plugin heatmap |
| **Tailwind CSS** | 3.x | CSS Framework |
| **Google Fonts** | - | Inter, Roboto Mono |
| **Material Symbols** | - | Icon library |
| **Vanilla JavaScript** | ES6+ | Logic ứng dụng |

---

## 🚀 Cách chạy

### Yêu cầu
- Node.js (khuyến nghị v16+)
- Trình duyệt hiện đại (Chrome, Firefox, Edge)

### Khởi động
```bash
# Di chuyển vào thư mục dự án
cd erablue-heatmap

# Chạy server (cách 1 - npm)
npx live-server --port=3000

# Hoặc cách 2 - Python
python -m http.server 3000
```

### Truy cập
- **Enterprise Dashboard**: http://localhost:3000/index-enterprise.html
- **Legacy Dashboard**: http://localhost:3000/index.html

---

## 📊 Dữ liệu mẫu

### Stores (STORES_DATA)
```javascript
{
  id: "store_001",
  name: "Erablue Menteng",
  latitude: -6.1945,
  longitude: 106.8434,
  city: "Jakarta",
  address: "Jl. Menteng Raya No. 45"
}
```

### Orders (ORDERS_DATA)
```javascript
{
  id: "order_001",
  storeId: "store_001",
  orderDate: "2024-01-15",
  orderValue: 1250000,
  customerLat: -6.2012,
  customerLng: 106.8523,
  distance: 2.3
}
```

### Competitors (COMPETITORS_DATA)
```javascript
{
  id: "comp_001",
  name: "Blibli Store Menteng",
  brand: "blibli",
  latitude: -6.1923,
  longitude: 106.8467
}
```

---

## 📈 Metrics & KPIs

| KPI | Công thức | Mô tả |
|-----|-----------|-------|
| **Total Revenue** | Σ orderValue | Tổng doanh thu |
| **Avg Order Value** | Total Revenue / Orders | Giá trị TB/đơn |
| **Order Density** | Orders / Area (km²) | Mật độ đơn hàng |
| **Threat Score** | Proximity + Brand + Coverage | Điểm đe dọa (0-100) |
| **Expansion Score** | Distance + Competitors + Demand | Điểm ưu tiên mở rộng |
| **CAC** | Marketing Cost / New Customers | Chi phí thu hút KH |

---

## 🎯 Use Cases

### 1. Phân tích vị trí mới
1. Bật "Click to Analyze"
2. Click vào khu vực quan tâm
3. Xem doanh thu, đối thủ, cơ hội

### 2. Đánh giá đối thủ
1. Bật layer Competitors
2. Click "Threat Assessment"
3. Xem danh sách đối thủ theo mức đe dọa

### 3. Tìm cơ hội mở rộng
1. Click "Golden Zones" hoặc "Gap Analysis"
2. Xem các vùng tiềm năng trên bản đồ
3. Click "Expansion Priority" để có priority matrix

### 4. Báo cáo chiến lược
1. Click "Strategic Dashboard" để xem tổng quan
2. Click "AI Recommendations" để xem khuyến nghị
3. Export "Full BI Report" để lưu báo cáo

---

## 📝 Changelog

### v2.0.0 - Enterprise Edition (Dec 2024)
- ✨ Giao diện Enterprise Dashboard hoàn toàn mới
- ✨ Click-to-Analyze với bán kính tùy chỉnh
- ✨ Strategic Insights & AI Recommendations
- ✨ CAC Analysis
- ✨ Store popup với đầy đủ thông tin doanh thu
- ✨ Competitor brand filtering
- 🔧 Tối ưu hiệu năng heatmap
- 🎨 Dark theme chuyên nghiệp

### v1.0.0 - Initial Release
- 🗺️ Basic map visualization
- 📊 Heatmap layer
- 🏪 Store markers
- 📈 Basic analytics

---

## 👨‍💻 Tác giả

Developed with ❤️ for Erablue Indonesia

---

## 📄 License

MIT License - Free to use and modify
