Movie Booking System
Installation & Setup
1. Cài đặt các dependencies:
npm install
2. Chạy script seed để tạo dữ liệu mẫu:
node scripts/seed.js
3. Khởi động server:
npm start
Authentication
Đăng nhập với các tài khoản mẫu:
User:
{
    "username": "customer1",
    "password": "customer123"
}
Admin:
{
    "username": "admin",
    "password": "admin"
}
Truy cập đường dẫn để đăng nhập:
http://localhost:3000/auth/login
API Endpoints
1. Đặt vé (Chỉ User có quyền thêm mới)
Endpoint: POST /bookings
Yêu cầu:
{
    "customerName": "TienVo",
    "theaterName": "Cineplex Downtown",
    "movieName": "Inception",
    "showTime": "2025-05-15T20:00:00.000Z",
    "numberOfTickets": 8
}
2. Xóa booking (Chỉ User có quyền xóa)
Endpoint: DELETE /bookings/:id
Ví dụ:
DELETE http://localhost:3000/bookings/67dd5641923b66dbe13625f7
3. Cập nhật booking (Chỉ User có quyền chỉnh sửa)
Endpoint: PUT /bookings/:id
Yêu cầu:
{
    "customerName": "TienVo123",
    "theaterName": "Cineplex Downtown",
    "movieName": "Inception",
    "showTime": "2025-05-15T20:00:00.000Z",
    "numberOfTickets": 12
}
4. Lấy danh sách tất cả bookings (Chỉ Admin có quyền xem)
Endpoint: GET /bookings
Ví dụ:
GET http://localhost:3000/bookings
Notes   
User có thể thêm, cập nhật, xóa bookings.
Admin chỉ có thể xem danh sách bookings.
Kiểm tra kỹ quyền truy cập trước khi thực hiện các hành động trên API.#   a d m i n - b e n k y o  
 