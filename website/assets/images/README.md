# Website Images Directory

## 📸 **IMAGE ASSETS STRUCTURE**

This directory contains all visual assets for the Tokyo Taxi AI Optimizer website.

### **Required Images** (To be added):

#### **Logo & Branding**
- `logo.png` - Main logo (transparent background)
- `logo-white.png` - White version for dark backgrounds
- `favicon.ico` - Browser tab icon (32x32)

#### **Hero Section**
- `hero-bg.jpg` - Tokyo cityscape background
- `taxi-hero.png` - Modern taxi illustration
- `ai-visualization.gif` - Animated AI processing

#### **Features Section**
- `weather-integration.png` - Weather API visualization
- `route-optimization.png` - Route mapping interface
- `analytics-dashboard.png` - Performance dashboard
- `mobile-app.png` - Mobile application mockup

#### **Research Section**
- `research-chart.png` - Performance improvement graph
- `university-badge.png` - Academic validation badge
- `statistics-infographic.png` - Key metrics visualization

#### **App Store**
- `app-store-badge.png` - iOS App Store download badge
- `google-play-badge.png` - Google Play Store badge
- `app-screenshots/` - Mobile app screenshots folder

### **Image Specifications**

#### **Performance Requirements**
- **Format**: WebP preferred, PNG/JPG fallback
- **Compression**: Optimized for web (< 100KB each)
- **Responsive**: Multiple sizes for different screens
- **Lazy loading**: Ready for performance optimization

#### **Design Guidelines**
- **Style**: Modern, professional, Japanese aesthetic
- **Colors**: Match website color palette
- **Quality**: High resolution for Retina displays
- **Consistency**: Unified visual language

### **Tokyo Taxi AI Branding**

#### **Color Palette**
```css
Primary Blue: #1a365d
Japanese Red: #dc143c
Gold Accent: #ffd700
Success Green: #38a169
Light Gray: #f7fafc
```

#### **Logo Usage**
- Main logo on white backgrounds
- White logo on colored/dark backgrounds
- Minimum size: 120px width
- Clear space: Logo height on all sides

### **Image Integration**

#### **HTML Implementation**
```html
<!-- Hero Background -->
<section class="hero" style="background-image: url('assets/images/hero-bg.jpg');">

<!-- Feature Icons -->
<img src="assets/images/weather-integration.png" alt="Weather Integration" class="feature-image">

<!-- Responsive Images -->
<picture>
  <source srcset="assets/images/dashboard-mobile.webp" media="(max-width: 768px)">
  <source srcset="assets/images/dashboard-desktop.webp" media="(min-width: 769px)">
  <img src="assets/images/dashboard-desktop.jpg" alt="AI Dashboard">
</picture>
```

#### **CSS Optimization**
```css
/* Image lazy loading */
.lazy-image {
    opacity: 0;
    transition: opacity 0.3s;
}

.lazy-image.loaded {
    opacity: 1;
}

/* Responsive images */
.responsive-img {
    max-width: 100%;
    height: auto;
    object-fit: cover;
}
```

### **Production Checklist**

#### **Before Launch**
- [ ] All images optimized for web
- [ ] Alt text added for accessibility
- [ ] Favicon implemented
- [ ] App Store badges updated
- [ ] Responsive breakpoints tested

#### **SEO Optimization**
- [ ] Descriptive file names
- [ ] Proper alt attributes
- [ ] Image sitemaps created
- [ ] Structured data markup

### **Future Enhancements**

#### **Interactive Elements**
- Animated GIFs for feature demonstrations
- Video backgrounds for hero section
- Interactive dashboard mockups
- 360° taxi interior views

#### **Localization**
- Japanese text versions
- Cultural adaptation of imagery
- Tokyo-specific landmarks
- Local taxi fleet representations

---

**Note**: This is a placeholder directory. Actual image files should be added by the design team following these specifications.