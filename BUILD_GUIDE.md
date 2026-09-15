# راهنمای ساخت APK اندروید
# Android APK Build Guide

## پیش‌نیازها (Prerequisites)

### 1. نصب Node.js
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS
brew install node

# Windows
# Download from https://nodejs.org/
```

### 2. نصب Java JDK 17
```bash
# Ubuntu/Debian
sudo apt install openjdk-17-jdk

# macOS
brew install openjdk@17

# Windows
# Download from https://adoptium.net/
```

بررسی نصب:
```bash
java -version
# Should show: openjdk version "17.x.x"
```

### 3. نصب Android SDK

#### روش 1: Android Studio (توصیه شده)
1. دانلود از: https://developer.android.com/studio
2. نصب و راه‌اندازی
3. نصب SDK از SDK Manager

#### روش 2: Command Line Tools
```bash
# Download from https://developer.android.com/studio#command-tools
# Extract and set environment variables
```

### 4. تنظیم متغیرهای محیطی
```bash
# اضافه به ~/.bashrc یا ~/.zshrc
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# اعمال تغییرات
source ~/.bashrc
```

## ساخت APK

### روش خودکار (توصیه شده)
```bash
# اجرای اسکریپت ساخت
./build-apk.sh
```

### روش دستی
```bash
# 1. نصب وابستگی‌ها
npm install

# 2. ساخت وب اپلیکیشن
npm run build

# 3. همگام‌سازی با اندروید
npx cap sync android

# 4. ساخت APK
cd android
./gradlew assembleDebug

# APK در مسیر: android/app/build/outputs/apk/debug/app-debug.apk
```

## نصب روی دستگاه

### با ADB
```bash
# اتصال دستگاه با USB debugging فعال
adb devices

# نصب APK
adb install amlakneshan-debug.apk
```

### انتقال مستقیم
```bash
# کپی APK به دستگاه
adb push amlakneshan-debug.apk /sdcard/

# نصب از روی دستگاه
# فایل را از File Manager باز کنید
```

## ساخت نسخه Release

### 1. ایجاد کلید امضا
```bash
keytool -genkey -v -keystore amlakneshan-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias amlakneshan
```

### 2. تنظیمات امضا در `android/app/build.gradle`
```gradle
android {
    signingConfigs {
        release {
            storeFile file('../amlakneshan-release-key.jks')
            storePassword 'YOUR_PASSWORD'
            keyAlias 'amlakneshan'
            keyPassword 'YOUR_PASSWORD'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 3. ساخت Release APK
```bash
cd android
./gradlew assembleRelease
# APK: android/app/build/outputs/apk/release/app-release.apk
```

## عیب‌یابی (Troubleshooting)

### خطای Java
```
❌ Java JDK is not installed
```
**راه حل:** Java 17 را نصب کنید (دستورات بالا)

### خطای Android SDK
```
❌ Android SDK not found
```
**راه حل:** 
- Android Studio را نصب کنید
- متغیر ANDROID_HOME را تنظیم کنید

### خطای Gradle
```
Could not determine java version
```
**راه حل:**
```bash
cd android
./gradlew --version
# اگر خطا داد، Gradle wrapper را به‌روز کنید
./gradlew wrapper --gradle-version=8.0
```

### خطای Memory
```
Java heap space
```
**راه حل:** در `android/gradle.properties` اضافه کنید:
```properties
org.gradle.jvmargs=-Xmx4096m
```

### خطای Network
```
Could not download dependencies
```
**راه حل:** اتصال اینترنت را بررسی کنید یا از VPN استفاده کنید

## تست در Emulator

```bash
# لیست emulator ها
emulator -list-avds

# راه‌اندازی emulator
emulator -avd YOUR_AVD_NAME

# نصب APK
adb install amlakneshan-debug.apk
```

## انتشار در فروشگاه‌ها

### Google Play Store
1. ایجاد حساب توسعه‌دهنده ($25)
2. آپلود AAB (نه APK)
3. پر کردن اطلاعات برنامه
4. ارسال برای بررسی

```bash
# ساخت AAB
cd android
./gradlew bundleRelease
# فایل: android/app/build/outputs/bundle/release/app-release.aab
```

### کافه بازار (ایران)
1. ثبت‌نام در https://pishkhan.cafebazaar.ir/
2. آپلود APK امضا شده
3. تکمیل اطلاعات

### مایکت (ایران)
1. ثبت‌نام در https://myket.ir/developer
2. آپلود APK
3. ارسال برای بررسی

## بهینه‌سازی حجم APK

### فعال کردن ProGuard
در `android/app/build.gradle`:
```gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

### کاهش حجم تصاویر
- استفاده از WebP به جای PNG/JPG
- فشرده‌سازی تصاویر قبل از اضافه کردن

### حذف زبان‌های غیرضروری
در `android/app/build.gradle`:
```gradle
defaultConfig {
    resConfigs "fa", "en"
}
```

## پشتیبانی

برای مشکلات بیشتر:
- مستندات Capacitor: https://capacitorjs.com/docs/android
- مستندات Android: https://developer.android.com/docs
- انجمن Stack Overflow: برچسب capacitor

---

**موفق باشید! 🚀**
