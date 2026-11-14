# 我的購物評估清單

GitHub Pages 前端 + Supabase Auth / Database / Storage。

## 首次啟用

1. 在 GitHub Repository 的 **Settings → Pages**，將 Build and deployment 的 Source 設為 **GitHub Actions**。
2. 在 Supabase 專案的 **Authentication → URL Configuration** 設定：
   - Site URL：`https://elia1306.github.io`
   - Redirect URLs 加入：`https://elia1306.github.io/shopping-evaluator/`
3. 確認 Supabase Email OTP / Magic Link 登入功能已啟用。
4. 確認先前建立的資料表、RLS policies，以及私人 Storage bucket `shopping-products` 已成功建立。

## 安全性

前端只使用 Supabase Publishable Key。資料表與 Storage 的存取權由 RLS / Storage policies 控制。不要把 service_role 或 Secret Key 放進前端。

## 目前版本範圍

- 原有商品清單介面、篩選、排序、詳細資料、JSON 匯入/匯出。
- Email Magic Link 登入。
- 商品資料寫入 Supabase，商品圖片上傳至私人 Storage。
- 首次登入時，會將目前瀏覽器中的本機清單遷移至雲端。
- AI 商品辨識、網路評價搜尋與即時購買通路分析尚未接上 Edge Function，不能視為已啟用。
