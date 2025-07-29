#!/bin/bash

# 🚀 Tokyo Taxi AI Optimizer - Complete iOS Deployment Script
# Professional App Store Submission Automation
# Author: Tatsuru Kikuchi
# Email: tatsuru.kikuchi@gmail.com

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# App configuration
APP_NAME="Tokyo Taxi AI Optimizer"
BUNDLE_ID="com.tatsuru.tokyotaxiai"
VERSION="1.0.0"
BUILD_NUMBER="1"

echo -e "${BLUE}🚕 Tokyo Taxi AI Optimizer - iOS Deployment Script${NC}"
echo -e "${BLUE}=================================================${NC}"
echo ""

# Function to print status messages
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${PURPLE}🔍 Checking Prerequisites...${NC}"

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the mobile/ directory."
    exit 1
fi

# Check if Node.js is installed
if ! command_exists node; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command_exists npm; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Check if Expo CLI is installed
if ! command_exists expo; then
    print_warning "Expo CLI not found. Installing..."
    npm install -g @expo/cli
fi

# Check if EAS CLI is installed
if ! command_exists eas; then
    print_warning "EAS CLI not found. Installing..."
    npm install -g eas-cli
fi

print_status "Prerequisites check completed"
echo ""

# Install dependencies
echo -e "${PURPLE}📦 Installing Dependencies...${NC}"
npm install
print_status "Dependencies installed successfully"
echo ""

# Verify project configuration
echo -e "${PURPLE}🔧 Verifying Project Configuration...${NC}"

# Check if app.json or app.config.js exists
if [ ! -f "app.json" ] && [ ! -f "app.config.js" ]; then
    print_warning "Expo configuration not found. Creating app.json..."
    
    cat > app.json << EOF
{
  "expo": {
    "name": "${APP_NAME}",
    "slug": "tokyo-taxi-ai-optimizer",
    "version": "${VERSION}",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1976D2"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "${BUNDLE_ID}",
      "buildNumber": "${BUILD_NUMBER}",
      "requireFullScreen": true,
      "infoPlist": {
        "CFBundleDisplayName": "Tokyo Taxi AI",
        "CFBundleShortVersionString": "${VERSION}",
        "CFBundleVersion": "${BUILD_NUMBER}",
        "NSLocationWhenInUseUsageDescription": "このアプリは位置情報を使用して、最適なタクシー配置と正確な需要予測を提供します。",
        "NSLocationAlwaysAndWhenInUseUsageDescription": "このアプリは位置情報を使用して、最適なタクシー配置と正確な需要予測を提供します。",
        "NSUserNotificationsUsageDescription": "このアプリは最適化アラートと収益機会のために通知を送信します。",
        "CFBundleLocalizations": ["en", "ja"],
        "CFBundleDevelopmentRegion": "ja"
      }
    },
    "extra": {
      "eas": {
        "projectId": "tokyo-taxi-ai-optimizer"
      }
    },
    "plugins": [
      "expo-localization",
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#1976D2"
        }
      ],
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "このアプリは位置情報を使用して、最適なタクシー配置と正確な需要予測を提供します。"
        }
      ]
    ]
  }
}
EOF
fi

print_status "Project configuration verified"
echo ""

# Create assets directory if it doesn't exist
echo -e "${PURPLE}🎨 Preparing App Assets...${NC}"
mkdir -p assets

# Create placeholder icon if it doesn't exist
if [ ! -f "assets/icon.png" ]; then
    print_warning "App icon not found. You'll need to add assets/icon.png (1024x1024)"
    echo "📝 Note: Create a professional app icon and place it at assets/icon.png"
fi

# Create placeholder splash screen if it doesn't exist
if [ ! -f "assets/splash.png" ]; then
    print_warning "Splash screen not found. You'll need to add assets/splash.png"
    echo "📝 Note: Create a splash screen and place it at assets/splash.png"
fi

print_status "Asset preparation completed"
echo ""

# EAS Build Configuration
echo -e "${PURPLE}⚙️ Configuring EAS Build...${NC}"

# Check if eas.json exists
if [ ! -f "eas.json" ]; then
    print_warning "EAS configuration not found. Creating eas.json..."
    
    cat > eas.json << EOF
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m-medium"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "tatsuru.kikuchi@gmail.com",
        "ascAppId": "placeholder_app_id",
        "appleTeamId": "placeholder_team_id"
      }
    }
  }
}
EOF
fi

print_status "EAS configuration completed"
echo ""

# Check EAS login status
echo -e "${PURPLE}🔐 Checking EAS Authentication...${NC}"
if ! eas whoami >/dev/null 2>&1; then
    print_warning "Not logged in to EAS. Please log in:"
    eas login
else
    print_status "Already logged in to EAS"
fi
echo ""

# Function to build for development/testing
build_development() {
    echo -e "${PURPLE}🔨 Building Development Version...${NC}"
    print_info "This build is for testing on your device"
    
    eas build --platform ios --profile development --local
    
    if [ $? -eq 0 ]; then
        print_status "Development build completed successfully!"
        echo ""
        print_info "Install the .ipa file on your device for testing"
    else
        print_error "Development build failed"
        exit 1
    fi
}

# Function to build for App Store
build_production() {
    echo -e "${PURPLE}🏭 Building Production Version for App Store...${NC}"
    print_info "This build will be submitted to the App Store"
    
    # Verify Apple Developer account setup
    print_warning "Please ensure you have:"
    echo "  • Apple Developer Account ($99/year)"
    echo "  • iOS Distribution Certificate"
    echo "  • App Store Provisioning Profile"
    echo "  • App Store Connect app record created"
    echo ""
    
    read -p "Do you want to continue with production build? (y/N): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        eas build --platform ios --profile production
        
        if [ $? -eq 0 ]; then
            print_status "Production build completed successfully!"
            echo ""
            print_info "Build is ready for App Store submission"
            
            # Ask if user wants to submit automatically
            read -p "Do you want to submit to App Store now? (y/N): " -n 1 -r
            echo ""
            
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                submit_to_app_store
            else
                print_info "You can submit later using: eas submit --platform ios"
            fi
        else
            print_error "Production build failed"
            exit 1
        fi
    else
        print_info "Production build cancelled"
    fi
}

# Function to submit to App Store
submit_to_app_store() {
    echo -e "${PURPLE}📤 Submitting to App Store...${NC}"
    
    eas submit --platform ios --profile production
    
    if [ $? -eq 0 ]; then
        print_status "Successfully submitted to App Store!"
        echo ""
        print_info "Your app is now in review. Check status at:"
        echo "https://appstoreconnect.apple.com"
        echo ""
        print_info "Review process typically takes 1-7 days"
    else
        print_error "App Store submission failed"
        exit 1
    fi
}

# Function to run local development server
run_development() {
    echo -e "${PURPLE}🚀 Starting Development Server...${NC}"
    print_info "This will start the Expo development server"
    print_info "Scan the QR code with Expo Go app on your device"
    echo ""
    
    expo start --ios
}

# Function to validate project
validate_project() {
    echo -e "${PURPLE}✅ Validating Project...${NC}"
    
    # Check for required files
    local required_files=("package.json" "App.js")
    local missing_files=()
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            missing_files+=("$file")
        fi
    done
    
    if [ ${#missing_files[@]} -eq 0 ]; then
        print_status "All required files present"
    else
        print_error "Missing required files: ${missing_files[*]}"
        exit 1
    fi
    
    # Test if the project starts without errors
    print_info "Testing project startup..."
    timeout 30 npm start > /dev/null 2>&1 &
    local npm_pid=$!
    sleep 5
    
    if kill -0 $npm_pid 2>/dev/null; then
        kill $npm_pid 2>/dev/null
        print_status "Project starts successfully"
    else
        print_error "Project fails to start. Please check for errors."
        exit 1
    fi
    
    print_status "Project validation completed"
}

# Function to show project info
show_project_info() {
    echo -e "${BLUE}📊 Project Information${NC}"
    echo "===================="
    echo "App Name: ${APP_NAME}"
    echo "Bundle ID: ${BUNDLE_ID}"
    echo "Version: ${VERSION}"
    echo "Build: ${BUILD_NUMBER}"
    echo ""
    echo "Components: 40+ professional features"
    echo "Languages: Japanese & English"
    echo "Platform: iOS (iPhone)"
    echo "Architecture: React Native + Expo"
    echo ""
}

# Function to show help
show_help() {
    echo -e "${BLUE}🚕 Tokyo Taxi AI Optimizer - Deployment Help${NC}"
    echo "=============================================="
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  dev          Start development server"
    echo "  build-dev    Build development version for testing"
    echo "  build-prod   Build production version for App Store"
    echo "  submit       Submit to App Store (requires production build)"
    echo "  validate     Validate project configuration"
    echo "  info         Show project information"
    echo "  help         Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev           # Start development server"
    echo "  $0 build-prod    # Build and submit to App Store"
    echo "  $0 validate      # Check project before building"
    echo ""
}

# Main script logic
case "${1:-}" in
    "dev"|"development")
        show_project_info
        validate_project
        run_development
        ;;
    "build-dev"|"build-development")
        show_project_info
        validate_project
        build_development
        ;;
    "build-prod"|"build-production"|"production")
        show_project_info
        validate_project
        build_production
        ;;
    "submit")
        submit_to_app_store
        ;;
    "validate"|"check")
        show_project_info
        validate_project
        ;;
    "info")
        show_project_info
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    "")
        # Interactive mode
        show_project_info
        echo -e "${YELLOW}🤔 What would you like to do?${NC}"
        echo ""
        echo "1) Start development server (test on device)"
        echo "2) Build development version"
        echo "3) Build production version for App Store"
        echo "4) Validate project"
        echo "5) Show help"
        echo ""
        read -p "Choose an option (1-5): " -n 1 -r
        echo ""
        echo ""
        
        case $REPLY in
            1)
                validate_project
                run_development
                ;;
            2)
                validate_project
                build_development
                ;;
            3)
                validate_project
                build_production
                ;;
            4)
                validate_project
                ;;
            5)
                show_help
                ;;
            *)
                print_error "Invalid option"
                show_help
                exit 1
                ;;
        esac
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Tokyo Taxi AI Optimizer Deployment Script Completed!${NC}"
echo ""
echo -e "${BLUE}📧 Support: tatsuru.kikuchi@gmail.com${NC}"
echo -e "${BLUE}🌟 Ready for Global Transportation Revolution!${NC}"