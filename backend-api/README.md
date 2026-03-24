# CodeAxe Backend API Infrastructure
A robust Laravel-powered backend providing secured RESTful endpoints for the CodeAxe Web Agency ecosystem.

## 🚀 Quick Access
- **API Base:** `https://api.codeaxe.co.in/api`
- **Documentation:** `https://api.codeaxe.co.in/api-docs.html`

## 🛠️ Technology Stack
- **Framework:** Laravel 10+
- **Database:** MySQL (Relational storage for CMS/Settings)
- **Media System:** Custom DMS (Digital Media Store) with Cloud Proxy
- **Auth:** Custom Bearer Token & App-Key Verification
- **Middleware:** Granular Role-Based Access Control (RBAC)

## 📡 API Usage Basics

### Required Headers
For all requests, the following headers must be present:
```http
Accept: application/json
X-App-Key: {your_app_key}
```

### Authentication Channels
1. **Public/CMS:** Handled by `VerifyAppKeyMiddleware`. Requires valid `X-App-Key`.
2. **User/Client:** Handled by `AuthUserMiddleware`. Requires `Authorization: Bearer {token}`.
3. **Admin:** Handled by `AdminAuthMiddleware`. Requires `admin_token` (and `superadmin` role for management).

## 📂 Project Structure
- `app/Http/Controllers/Api`: All backend logic and response handlers.
- `app/Http/Middleware`: Security layers (Sanitization, Auth, Rate Limiting).
- `routes/api.php`: The master routing table.
- `public/api-docs.html`: The human-readable documentation page.

## 🔒 Security Measures
- **Rate Limiting:** Protects against brute-force attacks on auth routes.
- **Input Sanitization:** Middleware cleanses all incoming JSON payloads.
- **DMS Proxy:** Media is served via internal slugs to hide cloud provider metadata.
- **Demo Mode:** Safety switch for sensitive configuration changes on test environments.

---
&copy; 2026 CodeAxe Technologies. This API is proprietary and confidential.
