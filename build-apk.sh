#!/bin/bash

# Build script for AmlakNeshan Android APK
# املاک نشان - Build Script

echo "🏠 املاک نشان - Building Android APK"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java JDK is not installed. Please install Java JDK 17+ first."
    echo "   Ubuntu/Debian: sudo apt install openjdk-17-jdk"
    echo "   macOS: brew install openjdk@17"
    echo "   Windows: Download from https://adoptium.net/"
    exit 1
fi

# Check Java version
JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}')
echo "✅ Java version: $JAVA_VERSION"

# Check if Android SDK is available
if [ -z "$ANDROID_HOME" ] && [ -z "$ANDROID_SDK_ROOT" ]; then
    echo "❌ Android SDK not found. Please install Android Studio and set ANDROID_HOME."
    echo "   export ANDROID_HOME=\$HOME/Android/Sdk"
    echo "   export PATH=\$PATH:\$ANDROID_HOME/tools:\$ANDROID_HOME/platform-tools"
    exit 1
fi

echo "✅ Android SDK found: ${ANDROID_HOME:-$ANDROID_SDK_ROOT}"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Build web app
echo ""
echo "🔨 Building web app..."
npm run build

# Sync to Android
echo ""
echo "📱 Syncing to Android project..."
npx cap sync android

# Build APK
echo ""
echo "🔧 Building Android APK..."
cd android
./gradlew assembleDebug

# Check if build succeeded
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo "📦 APK location: android/app/build/outputs/apk/debug/app-debug.apk"
    
    # Copy APK to root for easy access
    cp app/build/outputs/apk/debug/app-debug.apk ../amlakneshan-debug.apk
    echo "📦 APK copied to: amlakneshan-debug.apk"
    
    # Show APK size
    APK_SIZE=$(du -h ../amlakneshan-debug.apk | cut -f1)
    echo "📊 APK size: $APK_SIZE"
else
    echo ""
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo ""
echo "🎉 Done! You can now install the APK on your Android device."
echo "   adb install amlakneshan-debug.apk"
echo ""
echo "For release build:"
echo "   cd android && ./gradlew assembleRelease"
echo "   (requires signing configuration)"
