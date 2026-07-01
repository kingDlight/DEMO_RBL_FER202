# Auralis API Endpoints (Week 8)

Base URL: `http://localhost:3001`

| Method | URL | Request Body | Response | Mô tả |
|--------|-----|--------------|----------|-------|
| GET | `/tracks` | — | `Array<Track>` | Lấy danh sách toàn bộ bài hát |
| GET | `/tracks/:id` | — | `Track object` | Lấy chi tiết 1 bài hát theo ID |
| POST | `/tracks` | `Omit<Track, "id">` | `Created Track object` | Thêm mới 1 bài hát vào thư viện |
| PUT | `/tracks/:id` | `Track object` | `Updated Track object` | Cập nhật toàn bộ thông tin 1 bài hát |
| DELETE | `/tracks/:id` | — | `{}` | Xóa 1 bài hát khỏi thư viện |

## Track Object Model
```json
{
  "id": 1,
  "title": "Song Title",
  "artist": "Artist Name",
  "category": "Electronic",
  "price": 1.99,
  "originalPrice": 2.99,
  "stock": 50,
  "image": "/assets/album_cover.png"
}
```
