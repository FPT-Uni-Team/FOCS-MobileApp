# Setup Android Emulator

## Bước 1: Mở Android Studio
1. Tìm **Android Studio** trong Start Menu
2. Hoặc mở từ: `C:\Users\[username]\AppData\Local\Android\Sdk\`
3. Chờ Android Studio load hoàn toàn

## Bước 2: Mở AVD Manager
1. Trong Android Studio, click **Tools** menu
2. Chọn **AVD Manager** (Android Virtual Device Manager)
3. Hoặc click icon **AVD Manager** trên toolbar

## Bước 3: Tạo Virtual Device
1. Click **Create Virtual Device**
2. Chọn **Phone** category
3. Chọn **Pixel 4** (hoặc Pixel 4a, Pixel 5)
4. Click **Next**

## Bước 4: Chọn System Image
1. Chọn tab **Recommended**
2. Chọn **API Level 34** (Android 14.0)
3. Nếu chưa download, click **Download** bên cạnh
4. Click **Next**

## Bước 5: Configure AVD
1. **AVD Name**: `Pixel_4_API_34` (hoặc tên bạn muốn)
2. **Startup orientation**: Portrait
3. **Graphics**: Hardware - GLES 2.0
4. Click **Finish**

## Bước 6: Start Emulator
1. Trong AVD Manager, click **Play** button (▶️) bên cạnh device
2. Chờ emulator khởi động (có thể mất 2-5 phút lần đầu)
3. Emulator sẽ hiện màn hình Android home

## Bước 7: Test Connection
Sau khi emulator chạy, test kết nối:
```bash
adb devices
```
Sẽ thấy device trong danh sách.

## Bước 8: Chạy App
```bash
npx react-native run-android
```

## Troubleshooting:
- **Emulator chậm**: Tăng RAM trong AVD settings
- **Không start được**: Kiểm tra Virtualization trong BIOS
- **ADB không thấy device**: Restart ADB server 