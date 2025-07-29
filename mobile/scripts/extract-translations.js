#!/usr/bin/env node

/**
 * Translation Extraction Script for Weather Taxi Optimizer
 * Automatically extracts translatable strings from React Native components
 * and generates translation files for localization
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  sourceDir: '../',
  outputDir: '../localization/',
  excludeDirs: ['node_modules', '.git', '.expo', 'dist', 'build'],
  includeExtensions: ['.js', '.jsx', '.ts', '.tsx'],
  translationPattern: /t\(['"`]([^'"`]+)['"`]\)/g,
  outputFiles: {
    keys: 'translation-keys.json',
    missing: 'missing-translations.json',
    report: 'translation-report.md'
  }
};

class TranslationExtractor {
  constructor() {
    this.extractedKeys = new Set();
    this.missingTranslations = new Map();
    this.fileStats = {
      processed: 0,
      withTranslations: 0,
      totalKeys: 0
    };
  }

  /**
   * Main extraction process
   */
  async extract() {
    console.log('🚀 Starting translation extraction...');
    
    try {
      // Scan all files
      await this.scanDirectory(CONFIG.sourceDir);
      
      // Load existing translations
      const existingTranslations = await this.loadExistingTranslations();
      
      // Check for missing translations
      this.checkMissingTranslations(existingTranslations);
      
      // Generate output files
      await this.generateOutputFiles();
      
      // Print summary
      this.printSummary();
      
      console.log('✅ Translation extraction completed successfully!');
      
    } catch (error) {
      console.error('❌ Error during extraction:', error);
      process.exit(1);
    }
  }

  /**
   * Recursively scan directory for translatable strings
   */
  async scanDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip excluded directories
        if (!CONFIG.excludeDirs.includes(item)) {
          await this.scanDirectory(fullPath);
        }
      } else if (stat.isFile()) {
        // Process files with included extensions
        const ext = path.extname(item);
        if (CONFIG.includeExtensions.includes(ext)) {
          await this.processFile(fullPath);
        }
      }
    }
  }

  /**
   * Process individual file for translation keys
   */
  async processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      this.fileStats.processed++;
      
      let match;
      let foundKeys = false;
      
      // Extract all translation keys using regex
      while ((match = CONFIG.translationPattern.exec(content)) !== null) {
        const key = match[1];
        this.extractedKeys.add(key);
        foundKeys = true;
        this.fileStats.totalKeys++;
      }
      
      if (foundKeys) {
        this.fileStats.withTranslations++;
        console.log(`📄 Processed: ${path.relative(CONFIG.sourceDir, filePath)}`);
      }
      
    } catch (error) {
      console.warn(`⚠️  Warning: Could not process ${filePath}:`, error.message);
    }
  }

  /**
   * Load existing translation files
   */
  async loadExistingTranslations() {
    const translations = { en: {}, ja: {} };
    
    try {
      // Load English translations
      const enPath = path.join(CONFIG.outputDir, 'en.json');
      if (fs.existsSync(enPath)) {
        translations.en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
      }
      
      // Load Japanese translations
      const jaPath = path.join(CONFIG.outputDir, 'ja.json');
      if (fs.existsSync(jaPath)) {
        translations.ja = JSON.parse(fs.readFileSync(jaPath, 'utf8'));
      }
      
    } catch (error) {
      console.warn('⚠️  Warning: Could not load existing translations:', error.message);
    }
    
    return translations;
  }

  /**
   * Check for missing translations
   */
  checkMissingTranslations(existingTranslations) {
    for (const key of this.extractedKeys) {
      const enValue = this.getNestedValue(existingTranslations.en, key);
      const jaValue = this.getNestedValue(existingTranslations.ja, key);
      
      const missing = [];
      if (!enValue) missing.push('en');
      if (!jaValue) missing.push('ja');
      
      if (missing.length > 0) {
        this.missingTranslations.set(key, missing);
      }
    }
  }

  /**
   * Get nested object value using dot notation
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Generate output files
   */
  async generateOutputFiles() {
    // Ensure output directory exists
    if (!fs.existsSync(CONFIG.outputDir)) {
      fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    }

    // Generate extracted keys file
    const keysArray = Array.from(this.extractedKeys).sort();
    const keysOutput = {
      extractedAt: new Date().toISOString(),
      totalKeys: keysArray.length,
      keys: keysArray
    };
    
    fs.writeFileSync(
      path.join(CONFIG.outputDir, CONFIG.outputFiles.keys),
      JSON.stringify(keysOutput, null, 2),
      'utf8'
    );

    // Generate missing translations file
    const missingOutput = {
      extractedAt: new Date().toISOString(),
      totalMissing: this.missingTranslations.size,
      missing: Object.fromEntries(this.missingTranslations)
    };
    
    fs.writeFileSync(
      path.join(CONFIG.outputDir, CONFIG.outputFiles.missing),
      JSON.stringify(missingOutput, null, 2),
      'utf8'
    );

    // Generate report file
    await this.generateReport();
  }

  /**
   * Generate detailed report
   */
  async generateReport() {
    const report = `# Translation Extraction Report

Generated: ${new Date().toISOString()}

## Summary Statistics

- **Files Processed**: ${this.fileStats.processed}
- **Files with Translations**: ${this.fileStats.withTranslations}
- **Total Translation Keys**: ${this.fileStats.totalKeys}
- **Unique Keys**: ${this.extractedKeys.size}
- **Missing Translations**: ${this.missingTranslations.size}

## Extracted Translation Keys

${Array.from(this.extractedKeys).sort().map(key => `- \`${key}\``).join('\n')}

## Missing Translations

${this.missingTranslations.size > 0 
  ? Array.from(this.missingTranslations.entries())
      .map(([key, langs]) => `- \`${key}\` - Missing in: ${langs.join(', ')}`)
      .join('\n')
  : 'No missing translations found! 🎉'
}

## Recommendations

### For Missing English Translations:
1. Add translations to \`localization/en.json\`
2. Use descriptive, user-friendly text
3. Keep consistent terminology

### For Missing Japanese Translations:
1. Add translations to \`localization/ja.json\`  
2. Use polite business language (です/ます forms)
3. Consider cultural context and local preferences
4. Use proper Japanese formatting for numbers and dates

### Next Steps:
1. Review missing translations
2. Add missing keys to translation files
3. Test in both English and Japanese
4. Validate with native Japanese speakers
5. Update App Store metadata accordingly

## Quality Assurance Checklist

- [ ] All keys have English translations
- [ ] All keys have Japanese translations
- [ ] Japanese translations use appropriate politeness levels
- [ ] Technical terms are consistently translated
- [ ] UI text fits within interface constraints
- [ ] Cultural adaptations are considered
- [ ] Currency and date formatting is locale-appropriate

---

**Generated by Weather Taxi Optimizer Translation Extractor**
`;

    fs.writeFileSync(
      path.join(CONFIG.outputDir, CONFIG.outputFiles.report),
      report,
      'utf8'
    );
  }

  /**
   * Print extraction summary
   */
  printSummary() {
    console.log('\n📊 Translation Extraction Summary:');
    console.log('=====================================');
    console.log(`📁 Files processed: ${this.fileStats.processed}`);
    console.log(`📄 Files with translations: ${this.fileStats.withTranslations}`);
    console.log(`🔑 Total translation calls: ${this.fileStats.totalKeys}`);
    console.log(`✨ Unique translation keys: ${this.extractedKeys.size}`);
    console.log(`❌ Missing translations: ${this.missingTranslations.size}`);
    
    if (this.missingTranslations.size > 0) {
      console.log('\n⚠️  Missing Translations:');
      for (const [key, langs] of this.missingTranslations.entries()) {
        console.log(`   ${key} - Missing in: ${langs.join(', ')}`);
      }
    }
    
    console.log(`\n📁 Output files generated in: ${CONFIG.outputDir}`);
    console.log(`   - ${CONFIG.outputFiles.keys}`);
    console.log(`   - ${CONFIG.outputFiles.missing}`);
    console.log(`   - ${CONFIG.outputFiles.report}`);
  }
}

// Run extraction if called directly
if (require.main === module) {
  const extractor = new TranslationExtractor();
  extractor.extract();
}

module.exports = TranslationExtractor;