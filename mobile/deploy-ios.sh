#!/bin/bash

# Weather Taxi Optimizer - iOS Deployment Script
# Complete bilingual iPhone app deployment for Tokyo market

echo "🇯🇵📱 Weather Taxi Optimizer - iOS Deployment Script"
echo "=================================================="
echo "Complete bilingual iPhone app deployment for Tokyo market"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the mobile directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the mobile directory"
    exit 1
fi

print_status "Starting Weather Taxi Optimizer iOS deployment..."

# Check for required tools
print_status "Checking required tools..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is required but not installed"
    exit 1
fi
print_success "Node.js found: $(node --version)"

# Check for npm
if ! command -v npm &> /dev/null; then
    print_error "npm is required but not installed"
    exit 1
fi
print_success "npm found: $(npm --version)"

# Check for Expo CLI
if ! command -v expo &> /dev/null; then
    print_warning "Expo CLI not found. Installing globally..."
    npm install -g @expo/cli
    if [ $? -eq 0 ]; then
        print_success "Expo CLI installed successfully"
    else
        print_error "Failed to install Expo CLI"
        exit 1
    fi
else
    print_success "Expo CLI found: $(expo --version)"
fi

# Install dependencies
print_status "Installing project dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Validate localization files
print_status "Validating localization files..."
if [ -f "localization/en.json" ] && [ -f "localization/ja.json" ]; then
    print_success "Localization files found"
    
    # Check if translation extraction tool exists
    if [ -f "scripts/extract-translations.js" ]; then
        print_status "Running translation validation..."
        node scripts/extract-translations.js
        print_success "Translation validation complete"
    fi
else
    print_error "Localization files missing"
    exit 1
fi

# Validate app configuration
print_status "Validating app configuration..."
if grep -q "CFBundleLocalizations" package.json; then
    print_success "Bilingual configuration found"
else
    print_warning "Bilingual configuration may be incomplete"
fi

# Development server options
echo ""
echo "🚀 Deployment Options:"
echo "1. Start development server (Expo Go)"
echo "2. Start iOS simulator"
echo "3. Build for iOS (EAS Build)"
echo "4. Build for App Store submission"
echo "5. Run translation extraction only"
echo "6. Exit"
echo ""

read -p "Please select an option (1-6): " option

case $option in
    1)
        print_status "Starting Expo development server..."
        print_status "📱 Open Expo Go app on your iPhone and scan the QR code"
        print_status "🇯🇵 Test both English and Japanese interfaces"
        expo start
        ;;
    2)
        print_status "Starting iOS simulator..."
        print_status "🇯🇵 Testing bilingual functionality in simulator"
        expo start --ios
        ;;
    3)
        print_status "Building for iOS using EAS Build..."
        print_warning "This requires EAS CLI and account setup"
        
        # Check for EAS CLI
        if ! command -v eas &> /dev/null; then
            print_status "Installing EAS CLI..."
            npm install -g eas-cli
        fi
        
        print_status "Starting iOS build..."
        eas build --platform ios
        ;;
    4)
        print_status "Building for App Store submission..."
        print_warning "This requires Apple Developer account and certificates"
        
        # Check for EAS CLI
        if ! command -v eas &> /dev/null; then
            print_status "Installing EAS CLI..."
            npm install -g eas-cli
        fi
        
        print_status "Building production iOS app..."
        eas build --platform ios --profile production
        
        print_status "Ready for App Store Connect submission"
        print_success "Japanese metadata available in: app-store/japanese-metadata.md"
        ;;
    5)
        print_status "Running translation extraction..."
        if [ -f "scripts/extract-translations.js" ]; then
            node scripts/extract-translations.js
            print_success "Translation extraction complete"
            print_status "Check localization/ directory for reports"
        else
            print_error "Translation extraction script not found"
        fi
        ;;
    6)
        print_status "Exiting deployment script"
        exit 0
        ;;
    *)
        print_error "Invalid option selected"
        exit 1
        ;;
esac

echo ""
print_success "Weather Taxi Optimizer deployment operation completed!"
print_status "🇯🇵 Ready for Tokyo market launch"
print_status "📱 Bilingual iPhone apps prepared for Japanese users"
print_status "🚕 Weather-taxi optimization technology deployed"

echo ""
echo "📞 Contact: tatsuru.kikuchi@gmail.com | +81-80-3641-9973"
echo "🌟 Independent AI Research - Professional Weather-Taxi Technology"
echo "🏆 Complete bilingual mobile ecosystem ready for Tokyo taxi industry!"

# Post-deployment checklist
echo ""
echo "✅ Post-Deployment Checklist:"
echo "□ Test language switching (English ↔ Japanese)"
echo "□ Verify Tokyo location names display correctly"
echo "□ Test weather data integration"
echo "□ Validate earnings calculations"
echo "□ Check cultural adaptations (politeness levels)"
echo "□ Test on actual Japanese iOS devices"
echo "□ Prepare App Store screenshots"
echo "□ Submit for beta testing with Tokyo taxi drivers"
echo ""