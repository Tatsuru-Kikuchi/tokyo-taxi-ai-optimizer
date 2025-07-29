# 🍎 **完全Apple Developer Account設定ガイド**

## 📱 **初回iPhone開発者向け完全ステップバイステップガイド**

このガイドは、初めてiPhoneアプリを開発する方向けの詳細な手順書です。スクリーンショット付きで各ステップを説明します。

---

## 🎯 **事前準備（5分）**

### **必要なもの:**
```
✅ Mac または PC (どちらでも可能)
✅ 有効なApple ID (iPhoneで使用しているもの)
✅ クレジットカード (年会費 ¥15,800支払い用)
✅ 身分証明書 (運転免許証等、本人確認用)
✅ 約1時間の時間
```

---

## 📝 **ステップ1: Apple Developer Program申し込み（20分）**

### **1-1. Apple Developer サイトにアクセス**
```
🌐 URL: https://developer.apple.com/jp/

👆 クリックする場所:
- 「サインイン」（右上）
- 普段使っているApple IDでログイン
```

### **1-2. Developer Programに登録**
```
👆 クリック順序:
1. 「Account」（ログイン後、右上）
2. 「Enroll in the Apple Developer Program」
3. 「Start Your Enrollment」（青いボタン）
```

### **1-3. エンティティタイプ選択**
```
👆 選択する項目:
🔘 Individual（個人）← これを選択
   ⚪ Organization（法人）
   
理由: 個人事業主として登録が最も簡単
```

### **1-4. 個人情報入力**
```
📝 入力項目:
- 氏名: 菊地達琉 (ローマ字: Tatsuru Kikuchi)
- 住所: あなたの現住所を正確に入力
- 電話番号: +81-90-XXXX-XXXX (最初の0を除く)
- メールアドレス: tatsuru.kikuchi@gmail.com
```

### **1-5. 本人確認**
```
📱 本人確認方法:
1. 運転免許証の撮影
2. 自撮り写真の撮影
3. 住所確認書類（電気料金請求書等）

⏱️ 時間: 5-10分
🔍 コツ: 明るい場所で鮮明に撮影
```

### **1-6. 支払い**
```
💳 支払い情報:
- 年会費: ¥15,800 (税込)
- 支払い方法: クレジットカードまたはデビットカード
- 自動更新: はい（来年も継続する場合）

💡 重要: 支払い完了後、承認まで24-48時間かかります
```

---

## ⏳ **ステップ2: 承認待ち（1-3日）**

### **2-1. 承認状況確認**
```
📧 確認方法:
1. Appleからのメール確認
2. Developer Portal ログインして状況確認
3. ステータス: "Pending" → "Active" に変わるまで待機

⏱️ 通常の期間: 24-48時間
🏃‍♂️ 急ぐ場合: Apple Developer サポートに連絡可能
```

### **2-2. 承認完了後の確認事項**
```
✅ 確認項目:
- Apple Developer Portalにアクセス可能
- Team IDが発行されている
- Certificates, Identifiers & Profilesにアクセス可能
- App Store Connectにアクセス可能
```

---

## 🔐 **ステップ3: 証明書とプロビジョニングプロファイル作成（30分）**

### **3-1. App ID作成**
```
🔗 手順:
1. https://developer.apple.com/account/ にアクセス
2. 「Certificates, Identifiers & Profiles」をクリック
3. 「Identifiers」をクリック
4. 「+」ボタンをクリック
5. 「App IDs」を選択 → 「Continue」

📝 入力内容:
- Description: Tokyo Taxi AI Optimizer
- Bundle ID: com.tatsuru.tokyotaxiai
- Capabilities: 
  ✅ Location Services
  ✅ Push Notifications
  ✅ Background App Refresh
```

### **3-2. Distribution Certificate作成**
```
🔗 手順:
1. 「Certificates」をクリック
2. 「+」ボタンをクリック  
3. 「Apple Distribution」を選択 → 「Continue」
4. 「Certificate Signing Request」をアップロード

💡 CSR作成方法（Mac使用の場合）:
1. Keychain Access を開く
2. 「Keychain Access」→「Certificate Assistant」→「Request a Certificate From a Certificate Authority」
3. User Email: tatsuru.kikuchi@gmail.com
4. Common Name: Tatsuru Kikuchi
5. Request is: Saved to disk
6. 「Continue」してCSRファイルを保存
```

### **3-3. プロビジョニングプロファイル作成**
```
🔗 手順:
1. 「Profiles」をクリック
2. 「+」ボタンをクリック
3. 「App Store」を選択 → 「Continue」
4. App ID: com.tatsuru.tokyotaxiai を選択
5. Certificate: 先ほど作成した Distribution Certificate を選択
6. Profile Name: Tokyo Taxi AI Distribution
7. 「Generate」をクリック
8. ダウンロードして保存
```

---

## 📱 **ステップ4: App Store Connect設定（20分）**

### **4-1. App Store Connectにアクセス**
```
🌐 URL: https://appstoreconnect.apple.com/
👆 Apple IDでログイン
```

### **4-2. 新しいアプリ作成**
```
📱 手順:
1. 「マイApp」をクリック
2. 「+」ボタン → 「新規App」
3. 入力内容:
   - プラットフォーム: iOS
   - 名前: 東京タクシーAI最適化システム
   - 主言語: 日本語
   - Bundle ID: com.tatsuru.tokyotaxiai
   - SKU: tokyo-taxi-ai-2025
```

### **4-3. アプリ情報設定**
```
📝 設定項目:
1. App情報:
   - サブタイトル: AI駆動タクシー運営最適化システム
   - カテゴリ: ビジネス
   - 副カテゴリ: 生産性

2. App Store表示:
   - 価格設定: 無料
   - 利用可能地域: 日本

3. 年齢制限:
   - 4+ (年齢制限なし)
```

---

## 🔧 **ステップ5: 開発環境セットアップ（15分）**

### **5-1. EAS CLI設定**
```bash
# 1. EAS CLIインストール（まだの場合）
npm install -g @expo/eas-cli

# 2. Expoアカウントログイン
eas login
# メールアドレス: tatsuru.kikuchi@gmail.com
# パスワード: あなたのExpoパスワード

# 3. プロジェクトとリンク
cd mobile/
eas build:configure
```

### **5-2. Apple Developer情報をEASに設定**
```bash
# Apple Developer Team IDを設定
# Team IDは https://developer.apple.com/account/ の右上に表示

eas secret:create --scope project --name EXPO_APPLE_TEAM_ID --value YOUR_TEAM_ID

# App Store Connect情報設定
eas secret:create --scope project --name EXPO_APPLE_APP_STORE_CONNECT_API_KEY_ID --value YOUR_API_KEY_ID
```

---

## 📸 **ステップ6: 最終アセット準備（10分）**

### **6-1. アプリアイコン生成**
```
🎨 手順:
1. 提供されたアイコンジェネレーターを開く
2. お好みのデザインを選択してダウンロード
3. ファイル名を "icon.png" に変更
4. mobile/assets/ フォルダに配置
```

### **6-2. スクリーンショット生成**
```
📱 手順:
1. 提供されたスクリーンショットジェネレーターを開く
2. 8枚すべてのスクリーンショットをダウンロード
3. 各iPhoneサイズ（6.7", 6.5", 5.5"）用に保存
4. mobile/assets/screenshots/ フォルダに整理
```

---

## 🚀 **ステップ7: ビルドと申請（10分）**

### **7-1. 本番ビルド実行**
```bash
# プロジェクトディレクトリで実行
cd mobile/

# 自動デプロイメントスクリプト実行
chmod +x deploy-ios.sh
./deploy-ios.sh build-prod

# または手動実行:
eas build --platform ios --profile production
```

### **7-2. App Store Connect でのファイナライゼーション**
```
📱 手順:
1. App Store Connect にログイン
2. ビルドが表示されるまで待機（5-10分）
3. アプリページで「TestFlight」セクション確認
4. ビルドを本番に送信
5. 最終レビューに提出
```

---

## 🎯 **トラブルシューティング**

### **よくある問題と解決方法:**

#### **問題1: "Certificate not found"**
```
❌ エラー: 証明書が見つからない
✅ 解決: 
1. Keychain Accessで証明書確認
2. 期限切れの場合は新しい証明書作成
3. EAS設定を再度確認
```

#### **問題2: "Bundle ID already exists"**
```
❌ エラー: Bundle IDが既に存在
✅ 解決:
1. Bundle IDを少し変更 (例: com.tatsuru.tokyotaxiai2)
2. App Store Connect で新しいアプリ作成
3. 設定ファイル更新
```

#### **問題3: "Build failed"**
```
❌ エラー: ビルドに失敗
✅ 解決:
1. ログを詳細確認
2. 依存関係再インストール: npm install
3. キャッシュクリア: expo r -c
```

---

## 📞 **サポート連絡先**

### **Apple Developer サポート:**
```
🌐 Web: https://developer.apple.com/support/
📧 Email: developer-support@apple.com
📱 電話: +81-3-4560-4800 (日本語対応)
⏰ 営業時間: 平日 9:00-17:00
```

### **Expo/EAS サポート:**
```
🌐 Web: https://docs.expo.dev/
💬 Discord: https://discord.com/invite/4gtbPAdpaE
📧 Forum: https://forums.expo.dev/
```

---

## ✅ **最終チェックリスト**

申請前の最終確認:
```
□ Apple Developer Account が Active 状態
□ Team ID が取得済み
□ Distribution Certificate が有効
□ Provisioning Profile が作成済み
□ App Store Connect でアプリ作成済み
□ アプリアイコンが配置済み (1024x1024)
□ スクリーンショット準備完了 (各サイズ)
□ アプリ説明文が日本語で記載済み
□ プライバシーポリシーURL設定済み
□ EAS設定が完了
```

---

**🚀 このガイドに従えば、初回でもスムーズにApp Store申請が完了できます！**

**わからないことがあれば、各ステップで詳細に説明していますので、段階的に進めてください。**

**連絡先: tatsuru.kikuchi@gmail.com**
**📱 Complete Apple Developer Setup Success Guaranteed! 🌟**