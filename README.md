# TaxCalculator 🧮💰

<div align="center">

![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring%20Security-6DB33F?style=for-the-badge&logo=spring-security&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Maven](https://img.shields.io/badge/Apache%20Maven-C71A36?style=for-the-badge&logo=Apache%20Maven&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

</div>

<div align="center">
  <h3>Modern ve kullanıcı dostu vergi hesaplama ve varlık yönetimi uygulaması</h3>
  <p>Spring Boot backend ve React frontend ile geliştirilmiştir</p>
</div>

---

## 📋 İçindekiler

- [Ekran Görüntüleri](#-ekran-görüntüleri)
- [Özellikler](#-özellikler)
- [Teknoloji Stack](#-teknoloji-stack)
- [Kurulum](#-kurulum)
- [API Endpoints](#-api-endpoints)
- [Postman Örnekleri](#-postman-örnekleri)
- [Katkıda Bulunma](#-katkıda-bulunma)

## 📷 Ekran Görüntüleri

### 🏠 Ana Sayfa (Landing Page)
<div align="center">
  <img src="screenshots/homepage.png" alt="TaxCalc Ana Sayfa" width="900"/>
  <p><em>Modern gradient tasarım ile çekici ana sayfa</em></p>
</div>

### 📊 Kullanıcı Dashboard
<div align="center">
  <img src="screenshots/user-dashboard.png" alt="Kullanıcı Dashboard" width="900"/>
  <p><em>Varlık yönetimi ve vergi hesaplama dashboard'u - Toplam 8 varlık, ₺15.885.000 toplam değer</em></p>
</div>

### 🔍 Kullanıcı Varlık Detayları
<div align="center">
  <img src="screenshots/user-detail-modal.png" alt="Kullanıcı Varlık Detayları" width="800"/>
  <p><em>Detaylı varlık görünümü modal ekranı - BMW X5, Yalova Maviköy, iPhone 15 örnekleri</em></p>
</div>

### 👑 Admin Yönetim Paneli
<div align="center">
  <img src="screenshots/admin-dashboard.png" alt="Admin Dashboard" width="900"/>
  <p><em>Kapsamlı admin paneli - 5 kullanıcı, 13 ürün, ₺234.420.000 toplam değer yönetimi</em></p>
</div>

## ✨ Özellikler

### 👤 Kullanıcı Özellikleri
- **🏠 Modern Ana Sayfa**: Gradient tasarım ile çekici giriş deneyimi
- **📊 Kapsamlı Dashboard**: Varlık özeti ve vergi durumu tek bakışta
- **➕ Kolay Varlık Ekleme**: BMW X5, Yalova Maviköy gibi çeşitli varlık türleri
- **💰 Otomatik Vergi Hesaplama**: Araç (%2), Arsa (%0.1), Elektronik (%18) gibi otomatik oranlar
- **✅ Vergi Ödeme Sistemi**: "Ödendi" durumu ile vergi takibi
- **🏷️ Varlık Kategorileri**: Araba 🚗, Arsa 🌍, Elektronik 📱 icon'ları ile görsel ayrım

### 👑 Admin Özellikleri
- **📈 Sistem İstatistikleri**: Toplam kullanıcı, ürün, değer takibi
- **💳 Vergi Yönetimi**: Ödenen (₺741.600) vs Ödenmemiş (₺2.044.300) vergi analizi
- **👥 Kullanıcı Yönetimi**: 5 kullanıcının detaylı varlık portföyü
- **🔍 Detaylı İnceleme**: Her kullanıcının varlık sayısı ve vergi durumu
- **🗑️ Güvenli İşlemler**: Kullanıcı silme ve varlık yönetimi

### 🎨 UI/UX Özellikleri
- **🎨 Modern Gradient Tasarım**: Mavi-mor gradient tema
- **📱 Responsive Design**: Tüm cihazlarda uyumlu
- **🚀 Hızlı Loading**: Anlık veri yükleme
- **🎯 İntuitive Navigation**: Kolay kullanım
- **🔔 Status Indicators**: Yeşil ✅ ödendi, kırmızı ❌ ödenmemiş durumları

## 🛠 Teknoloji Stack

<table>
<tr>
<td align="center"><strong>Backend</strong></td>
<td align="center"><strong>Frontend</strong></td>
<td align="center"><strong>Database & Tools</strong></td>
</tr>
<tr>
<td align="center">

![Java](https://img.shields.io/badge/Java_17-ED8B00?style=flat-square&logo=openjdk&logoColor=white)<br>
![Spring Boot](https://img.shields.io/badge/Spring_Boot_3.x-6DB33F?style=flat-square&logo=spring-boot&logoColor=white)<br>
![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=flat-square&logo=spring-security&logoColor=white)<br>
![Spring Data](https://img.shields.io/badge/Spring_Data-6DB33F?style=flat-square&logo=spring&logoColor=white)<br>
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=JSON%20web%20tokens&logoColor=white)<br>
![Maven](https://img.shields.io/badge/Maven-C71A36?style=flat-square&logo=Apache%20Maven&logoColor=white)

</td>
<td align="center">

![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)<br>
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)<br>
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)<br>
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)<br>
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)<br>
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)

</td>
<td align="center">

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)<br>
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=flat-square&logo=postman&logoColor=white)<br>
![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white)<br>
![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)<br>
![IntelliJ IDEA](https://img.shields.io/badge/IntelliJ_IDEA-000000?style=flat-square&logo=intellij-idea&logoColor=white)<br>
![VS Code](https://img.shields.io/badge/VS_Code-007ACC?style=flat-square&logo=visual-studio-code&logoColor=white)

</td>
</tr>
</table>

### 🏗️ Mimari Özellikleri
- **RESTful API**: Clean ve tutarlı API tasarımı
- **JWT Authentication**: Stateless kimlik doğrulama
- **Role-based Authorization**: Kullanıcı ve Admin rolleri
- **AOP Logging**: Aspect-Oriented Programming ile loglama
- **Global Exception Handling**: Merkezi hata yönetimi
- **Bean Validation**: Girdi doğrulama
- **CORS Configuration**: Cross-Origin Resource Sharing

## 🚀 Kurulum

### Gereksinimler
- ![Java](https://img.shields.io/badge/Java-17+-ED8B00?style=flat-square&logo=openjdk&logoColor=white)
- ![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=flat-square&logo=node.js&logoColor=white)
- ![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-4EA94B?style=flat-square&logo=mongodb&logoColor=white)
- ![Maven](https://img.shields.io/badge/Maven-3.6+-C71A36?style=flat-square&logo=Apache%20Maven&logoColor=white)

### Backend Kurulumu

1. Repository'yi klonlayın:
```bash
git clone https://github.com/yourusername/TaxCalculator.git
cd TaxCalculator
```

2. MongoDB'yi başlatın:
```bash
mongod --dbpath /path/to/your/db
```

3. Backend'i çalıştırın:
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend http://localhost:8080 adresinde çalışacaktır.

### Frontend Kurulumu

1. Frontend dizinine gidin:
```bash
cd TaxCalculator-frontend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Frontend'i başlatın:
```bash
npm run dev
```

Frontend http://localhost:5173 adresinde çalışacaktır.

## 📡 API Endpoints

### 🔐 Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Kullanıcı girişi |
| POST | `/api/auth/register` | Kullanıcı kaydı |
| GET | `/api/auth/users` | Tüm kullanıcıları listele |

### 📦 Product Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Kullanıcının varlıklarını getir |
| POST | `/api/products` | Yeni varlık ekle |
| PUT | `/api/products/{id}` | Varlık güncelle |
| DELETE | `/api/products/{id}` | Varlık sil |
| PUT | `/api/products/{id}/pay-tax` | Vergi öde |
| GET | `/api/products/tax-calculation` | Toplam vergi hesapla |
| GET | `/api/products/summary` | Varlık özeti |

### 👑 Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard istatistikleri |
| GET | `/api/admin/users` | Kullanıcıları ürünleriyle getir |
| GET | `/api/admin/users/{userId}/products` | Kullanıcının ürünleri |
| DELETE | `/api/admin/users/{userId}` | Kullanıcı sil |

## 📮 Postman Örnekleri

### 1. Kullanıcı Kaydı
```json
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "testuser35",
  "email": "testuser35@example.com",
  "password": "password123",
  "role": "USER"
}
```

### 2. Kullanıcı Girişi
```json
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "testuser35",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "id": "64f1234567890abcdef",
  "username": "testuser35",
  "email": "testuser35@example.com",
  "roles": ["ROLE_USER"]
}
```

### 3. BMW X5 Varlık Ekleme
```json
POST http://localhost:8080/api/products
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
Content-Type: application/json

{
  "name": "BMW X5",
  "price": 1200000,
  "type": "CAR",
  "description": "2022 model BMW X5"
}
```

### 4. Yalova Maviköy Arsa Ekleme
```json
POST http://localhost:8080/api/products
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
Content-Type: application/json

{
  "name": "Yalova Maviköy",
  "price": 500000,
  "type": "LAND",
  "description": "Deniz manzaralı arsa"
}
```

### 5. Varlıkları Listeleme
```json
GET http://localhost:8080/api/products
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...

Response:
[
  {
    "id": "64f1234567890abcdef",
    "name": "BMW X5",
    "type": "CAR",
    "price": 1200000,
    "taxAmount": 24000,
    "taxPaid": false,
    "userId": "64f1234567890abcdef",
    "description": "2022 model BMW X5"
  },
  {
    "id": "64f1234567890abcdef",
    "name": "Yalova Maviköy",
    "type": "LAND",
    "price": 500000,
    "taxAmount": 500,
    "taxPaid": true,
    "userId": "64f1234567890abcdef"
  }
]
```

### 6. Admin Dashboard İstatistikleri
```json
GET http://localhost:8080/api/admin/stats
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...

Response:
{
  "totalUsers": 5,
  "totalProducts": 13,
  "totalValue": 234420000,
  "totalTax": 2785900,
  "totalPaidTax": 741600,
  "totalUnpaidTax": 2044300,
  "paidTaxProducts": 9,
  "unpaidTaxProducts": 4
}
```

### 7. Tüm Kullanıcıları Getirme (Admin)
```json
GET http://localhost:8080/api/admin/users
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...

Response:
[
  {
    "id": "64f1234567890abcdef",
    "username": "eren3",
    "email": "eren3@example.com",
    "productCount": 2,
    "totalValue": 107200000,
    "totalTax": 249000,
    "paidTax": 249000,
    "unpaidTax": 0
  },
  {
    "id": "64f1234567890abcdef",
    "username": "testuser35",
    "email": "testuser35@example.com",
    "productCount": 8,
    "totalValue": 15885000,
    "totalTax": 309600,
    "paidTax": 271600,
    "unpaidTax": 38000
  }
]
```

### 8. Kullanıcı Silme (Admin)
```json
DELETE http://localhost:8080/api/admin/users/64f1234567890abcdef
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...

Response:
{
  "message": "User deleted successfully",
  "userId": "64f1234567890abcdef"
}
```

## 💎 Vergi Oranları

Ekran görüntülerindeki örneklere göre:

| Varlık Türü | Vergi Oranı | Örnek | Icon |
|-------------|-------------|-------|------|
| Araba (CAR) | %2 | BMW X5: ₺1.200.000 → ₺24.000 | 🚗 |
| Arsa (LAND) | %0.1 | Yalova Maviköy: ₺500.000 → ₺500 | 🌍 |
| Elektronik (ELECTRONICS) | %18 | iPhone 15: ₺85.000 → ₺15.300 | 📱 |
| Ev (HOUSE) | %0.1 | Erenköy Villa: ₺5.000.000 → ₺5.000 | 🏠 |
| Ticari (COMMERCIAL) | %3 | - | 🏢 |
| Mağaza (STORE) | %0.2 | - | 🏪 |
| Mücevher (JEWELRY) | %20 | - | 💎 |
| Tekne (BOAT) | %5 | - | ⛵ |

## 🔐 Güvenlik

- **JWT Token**: Tüm API endpoint'leri JWT token ile korunmaktadır
- **Role-based Access**: USER ve ADMIN rolleri ile yetkilendirme
- **Password Encryption**: BCrypt ile şifre şifreleme
- **CORS Configuration**: Frontend için CORS ayarları
- **Request Validation**: Bean Validation ile girdi doğrulama

## 🎯 Kullanım Senaryoları

### Kullanıcı İşlemleri (testuser35 örneği)
1. **Ana sayfadan giriş** → Modern gradient arayüz
2. **Varlık ekleme** → BMW X5 (₺1.200.000), Yalova Maviköy (₺500.000)
3. **Dashboard görüntüleme** → 8 varlık, ₺15.885.000 toplam değer
4. **Vergi takibi** → ₺1.576.000 toplam vergi, ₺330.000 ödenecek
5. **Vergi ödeme** → ✅ Ödendi durumuna geçirme

### Admin İşlemleri
1. **Sistem durumu** → 5 kullanıcı, 13 ürün yönetimi
2. **Vergi analizi** → ₺741.600 ödenen vs ₺2.044.300 ödenmeyen
3. **Kullanıcı detayları** → eren3, testuser35, deneme1, deneme2 hesap yönetimi
4. **Varlık denetimi** → Tüm varlıkların detaylı görünümü

## 🐛 Hata Yönetimi

Uygulama kapsamlı hata yönetimi içerir:
- **Global Exception Handler**: Tüm hatalar merkezi olarak yönetilir
- **Validation Errors**: Girdi doğrulama hataları
- **Authentication Errors**: Kimlik doğrulama hataları
- **Authorization Errors**: Yetkilendirme hataları
- **Business Logic Errors**: İş mantığı hataları

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasını inceleyin.

## 👨‍💻 Geliştirici

**Eren**
- GitHub: [@erenulutas0](https://github.com/erenulutas0)
- Email: eerenulutass@gmail.com

---

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/yourusername/TaxCalculator?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/TaxCalculator?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/yourusername/TaxCalculator?style=social)

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!

</div>