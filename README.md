# QR Code Generator

เว็บแอปสร้าง QR Code ออนไลน์ ทำงานทั้งหมดในฝั่งเบราว์เซอร์ (client-side) ไม่มีการส่งข้อมูลไปยังเซิร์ฟเวอร์ใด ๆ

## ฟีเจอร์

- ใส่ข้อความหรือลิงก์เพื่อสร้าง QR Code
- ปรับขนาด, ระดับการแก้ไขข้อผิดพลาด (Error Correction Level), สีลาย และสีพื้นหลัง
- ดาวน์โหลด QR Code เป็นไฟล์ PNG

## วิธีใช้งาน

เปิดไฟล์ `index.html` ในเบราว์เซอร์โดยตรง หรือรันเซิร์ฟเวอร์ static เล็ก ๆ เช่น:

```bash
python3 -m http.server 8000
```

แล้วเปิด `http://localhost:8000`

## เทคโนโลยี

- HTML / CSS / JavaScript (ไม่ต้อง build)
- ไลบรารี [qrcodejs](https://github.com/davidshimjs/qrcodejs) (แนบไว้ในโปรเจกต์ที่ `vendor/qrcode.min.js` เพื่อให้ใช้งานได้แบบออฟไลน์ ไม่ต้องพึ่ง CDN ภายนอก)
