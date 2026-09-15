# املاک نشان - سامانه هوشمند املاک مشهد
# AmlakNeshan - Smart Real Estate Platform for Mashhad

A comprehensive real estate broker platform for Mashhad, Iran, built with React, Leaflet maps, and Capacitor for Android.

## 🏠 Features

### Login & Dashboard
- **Secure Login** - Phone number and password authentication
- **User Dashboard** - Overview of active contracts, properties, and statistics
- **Active Contracts** - View and manage rental and sale agreements
- **Statistics** - Track properties, bids, and views

### Interactive Map
- **Mashhad Map** - Full interactive map of Mashhad with OpenStreetMap
- **Color-Coded Properties** - Visual indicators for property types:
  - 🔴 Red = For Sale
  - 🟣 Purple = For Rent  
  - 🟢 Green = Both Sale & Rent
- **District Navigation** - Browse properties by Mashhad districts
- **Filter System** - Filter by property type, search by location
- **Property Popups** - Quick preview with images and details

### Property Details (Zillow-Style)
- **Image Gallery** - Multiple photos with thumbnail navigation
- **Detailed Information** - Area, rooms, bathrooms, parking, year built
- **Pricing** - Sale price and/or rental rates with per-meter calculations
- **Features & Amenities** - Comprehensive list of property features
- **Bidding System** - Submit and track purchase/rental offers
- **Agent Contact** - Direct contact with property agent
- **Mortgage Calculator** - Estimate monthly payments
- **Similar Properties** - Related listings in the same district

### Sample Database
- **15 Properties** - Diverse range from apartments to villas
- **10 Districts** - Coverage across Mashhad neighborhoods
- **Realistic Data** - Persian addresses, prices in Toman, local agents
- **Multiple Types** - Sale, rent, and combined listings

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- For Android APK: Java JDK 17+ and Android SDK

### Web App (Development)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Build for Production

```bash
# Build optimized web app
npm run build

# Preview production build
npm run preview
```

## 📱 Building Android APK

### Method 1: Local Build (Recommended)

1. **Install Java JDK 17+**
   ```bash
   # Ubuntu/Debian
   sudo apt install openjdk-17-jdk
   
   # macOS
   brew install openjdk@17
   
   # Windows: Download from https://adoptium.net/
   ```

2. **Install Android SDK**
   - Download Android Studio: https://developer.android.com/studio
   - Install Android SDK through SDK Manager
   - Set environment variables:
     ```bash
     export ANDROID_HOME=$HOME/Android/Sdk
     export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
     ```

3. **Build APK**
   ```bash
   # Sync web app to Android project
   npm run build
   npx cap sync android
   
   # Build debug APK
   cd android
   ./gradlew assembleDebug
   
   # APK location: android/app/build/outputs/apk/debug/app-debug.apk
   ```

4. **Build Release APK**
   ```bash
   cd android
   ./gradlew assembleRelease
   
   # Note: Requires signing configuration
   # See: https://capacitorjs.com/docs/android/deploying-to-google-play
   ```

### Method 2: Android Studio

1. Open `android/` folder in Android Studio
2. Sync Gradle files
3. Build → Build Bundle(s) / APK(s) → Build APK(s)
4. Find APK in `android/app/build/outputs/apk/`

### Method 3: Cloud Build (EAS)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for Android
eas build --platform android
```

## 🗺️ Map Features

The app uses Leaflet.js with OpenStreetMap tiles centered on Mashhad (36.2970, 59.6065).

### Property Markers
- **Size** - Indicates property area (larger = bigger)
- **Color** - Indicates listing type (sale/rent/both)
- **Click** - Opens detailed popup with image and quick info
- **Navigation** - Click to view full property details

### Districts Covered
- وکیل‌آباد (Vakilabad)
- الهیه (Elahieh)
- سجاد (Sajjad)
- احمدآباد (Ahmadabad)
- حرم مطهر (Holy Shrine Area)
- کوهسنگی (Koohsangi)
- طرقبه (Torghabeh)
- جانباز (Janbaz)
- شاهد (Shahed)
- شهرک غرب (Shahrak Gharb)

## 🎨 Design

- **RTL Support** - Full right-to-left layout for Persian
- **Vazirmatn Font** - Beautiful Persian typography
- **Responsive** - Works on mobile, tablet, and desktop
- **Material Design** - Modern, clean interface inspired by Zillow
- **Color Scheme** - Professional blue (#0078d4) primary color

## 📊 Sample Data

The app includes 15 sample properties with:
- Realistic Mashhad addresses
- Prices in Iranian Toman (تومان)
- Property photos (AI-generated + placeholders)
- Agent contact information
- Bid history and status tracking
- Detailed specifications

### Property Types
- Luxury apartments and penthouses
- Student housing
- Commercial offices and shops
- Villas with gardens
- Residential land

## 🔧 Configuration

### Vite Config (`vite.config.js`)
- Development server on port 5173
- Preview server on port 4173
- Host binding for network access

### Capacitor Config (`capacitor.config.json`)
- App ID: `com.amlakneshan.app`
- App Name: املاک نشان
- Android HTTPS scheme
- Splash screen configuration

## 📁 Project Structure

```
AmlakNeshan/
├── src/
│   ├── pages/           # Login, Dashboard, MapView, PropertyDetails
│   ├── data/            # Sample database (properties, contracts, districts)
│   ├── App.jsx          # Main app with routing
│   └── index.css        # Global styles with Vazirmatn font
├── public/
│   └── images/          # Property photos (10 AI-generated)
├── android/             # Capacitor Android project
├── dist/                # Production build output
└── package.json         # Dependencies and scripts
```

## 🌐 Deployment

### Web Hosting
```bash
npm run build
# Upload dist/ folder to any static hosting:
# - Vercel
# - Netlify
# - GitHub Pages
# - AWS S3
```

### Android App
1. Build APK using instructions above
2. Distribute via:
   - Google Play Store (requires signing)
   - Direct APK download
   - Iranian app stores (Cafe Bazaar, Myket)

## 🛠️ Technologies

- **React 18** - UI framework
- **React Router 6** - Navigation
- **Vite 5** - Build tool
- **Leaflet** - Interactive maps
- **Capacitor 6** - Native Android wrapper
- **OpenStreetMap** - Map tiles

## 📝 Notes

- All prices are in Iranian Toman (تومان)
- Dates use Persian calendar (شمسی)
- Phone numbers are Iranian mobile format
- Property images: 10 AI-generated, rest use placeholder service

## 🐛 Troubleshooting

### Map not loading
- Check internet connection (requires OpenStreetMap tiles)
- Verify Leaflet CSS is loaded

### APK build fails
- Ensure Java 17+ is installed: `java -version`
- Check Android SDK path: `echo $ANDROID_HOME`
- Run `npx cap sync android` before building

### Images not showing
- AI-generated images are in `public/images/`
- Missing images fall back to picsum.photos placeholders

## 📄 License

MIT License - Feel free to use for your real estate project!

## 🤝 Contributing

This is a prototype/demo project. Feel free to:
- Add more properties
- Enhance the map features
- Integrate with real backend APIs
- Add more districts
- Improve the UI/UX

## 📞 Support

For questions or issues:
1. Check the documentation above
2. Review the code comments
3. Consult Capacitor docs: https://capacitorjs.com/docs
4. Check Leaflet docs: https://leafletjs.com/reference.html

---

**Built with ❤️ for Mashhad Real Estate**

سامانه املاک نشان - ساخته شده با ❤️ برای املاک مشهد
