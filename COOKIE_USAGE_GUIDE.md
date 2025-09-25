# Cookie Usage Guide for Laravel + React

## ✅ **What We've Implemented**

### 1. **Frontend Cookie Utilities** (`resources/js/utils/cookies.ts`)

- Type-safe cookie management
- JSON cookie support
- Specific app cookie helpers
- Automatic encoding/decoding

### 2. **Backend Cookie Middleware** (`app/Http/Middleware/HandleCookies.php`)

- Automatic cookie management
- Secure cookie options
- User preference handling

### 3. **Updated First Visit Tracking**

- Replaced localStorage with cookies in MainLayout
- Cross-browser compatible
- Persistent across sessions

## 🍪 **Cookie vs localStorage vs sessionStorage**

| Feature            | Cookies            | localStorage       | sessionStorage     |
| ------------------ | ------------------ | ------------------ | ------------------ |
| **Size Limit**     | ~4KB               | ~5-10MB            | ~5-10MB            |
| **Sent to Server** | ✅ Yes             | ❌ No              | ❌ No              |
| **Expires**        | ✅ Configurable    | ❌ Never           | ❌ Tab close       |
| **Cross-tab**      | ✅ Yes             | ✅ Yes             | ❌ No              |
| **Server Access**  | ✅ Yes             | ❌ No              | ❌ No              |
| **Security**       | ✅ HttpOnly option | ❌ JavaScript only | ❌ JavaScript only |

## 🔧 **Usage Examples**

### Frontend (React/TypeScript)

```typescript
import { CookieManager, AppCookies } from '@/utils/cookies';

// Basic cookie operations
CookieManager.setCookie('username', 'john_doe', { expires: 30 });
const username = CookieManager.getCookie('username');
CookieManager.deleteCookie('username');

// App-specific helpers
AppCookies.setTheme('dark');
const theme = AppCookies.getTheme(); // 'dark' | 'light' | 'system' | null

AppCookies.setUserPreference('sidebar', 'collapsed');
const sidebar = AppCookies.getUserPreference('sidebar');

// First visit tracking (already implemented)
if (AppCookies.isFirstVisit()) {
    // Show welcome modal, tutorial, etc.
    AppCookies.markAsVisited();
}

// Shopping cart
AppCookies.setCartItems([{ id: 1, name: 'Product', qty: 2 }]);
const cart = AppCookies.getCartItems();

// Recently viewed products
AppCookies.addRecentlyViewed(123);
const recent = AppCookies.getRecentlyViewed(); // [123, 456, 789...]
```

### Backend (Laravel/PHP)

```php
// In controllers
class HomeController extends Controller
{
    public function index(Request $request)
    {
        // Check first visit
        $isFirstVisit = !$request->hasCookie('hasVisitedBefore');

        // Get user preferences
        $theme = $request->cookie('theme', 'system');
        $language = $request->cookie('language', 'en');

        return inertia('Welcome', [
            'isFirstVisit' => $isFirstVisit,
            'theme' => $theme,
            'language' => $language,
        ]);
    }

    public function setPreferences(Request $request)
    {
        $validated = $request->validate([
            'theme' => 'required|in:light,dark,system',
            'language' => 'required|string|max:5',
        ]);

        return response()->json(['success' => true])
            ->cookie('theme', $validated['theme'], 60 * 24 * 365)
            ->cookie('language', $validated['language'], 60 * 24 * 365);
    }
}

// In middleware
public function handle(Request $request, Closure $next)
{
    $response = $next($request);

    // Auto-set visited cookie
    if (!$request->hasCookie('hasVisitedBefore')) {
        $response->cookie('hasVisitedBefore', 'true', 60 * 24 * 365);
    }

    return $response;
}
```

## 🔒 **Security Best Practices**

### 1. **Secure Cookie Configuration**

```php
// In config/session.php
'secure' => env('SESSION_SECURE_COOKIE', true), // HTTPS only
'http_only' => true, // No JavaScript access
'same_site' => 'lax', // CSRF protection

// For sensitive data
$response->cookie(
    'auth_token',
    $token,
    60, // minutes
    '/', // path
    '.yourdomain.com', // domain
    true, // secure (HTTPS only)
    true, // httpOnly (no JS access)
    false, // raw
    'strict' // sameSite
);
```

### 2. **Cookie Encryption** (Laravel automatically handles this)

```php
// In app/Http/Middleware/EncryptCookies.php
protected $except = [
    'public_preference', // Don't encrypt public preferences
];
```

### 3. **GDPR Compliance**

```typescript
// Cookie consent management
class CookieConsent {
    static showConsentBanner(): void {
        if (!AppCookies.hasAnalyticsConsent()) {
            // Show consent banner
        }
    }

    static acceptAll(): void {
        AppCookies.setAnalyticsConsent(true);
        CookieManager.setCookie('cookieConsent', 'all', { expires: 365 });
    }

    static acceptEssential(): void {
        AppCookies.setAnalyticsConsent(false);
        CookieManager.setCookie('cookieConsent', 'essential', { expires: 365 });
    }
}
```

## 🎯 **Common Use Cases**

### 1. **User Preferences**

```typescript
// Theme switching
const ThemeToggle = () => {
    const [theme, setTheme] = useState(AppCookies.getTheme() || 'system');

    const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
        setTheme(newTheme);
        AppCookies.setTheme(newTheme);
        // Apply theme immediately
        document.documentElement.className = newTheme;
    };

    return (
        <select value={theme} onChange={(e) => handleThemeChange(e.target.value)}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
        </select>
    );
};
```

### 2. **Shopping Cart Persistence**

```typescript
const useShoppingCart = () => {
    const [items, setItems] = useState(AppCookies.getCartItems());

    const addItem = (product: Product) => {
        const newItems = [...items, product];
        setItems(newItems);
        AppCookies.setCartItems(newItems);
    };

    const removeItem = (productId: number) => {
        const filtered = items.filter((item) => item.id !== productId);
        setItems(filtered);
        AppCookies.setCartItems(filtered);
    };

    return { items, addItem, removeItem };
};
```

### 3. **Analytics & Tracking**

```typescript
// Track user behavior with consent
const trackEvent = (event: string, data: any) => {
    if (AppCookies.hasAnalyticsConsent()) {
        // Send to analytics
        gtag('event', event, data);

        // Store in cookie for later analysis
        const events = CookieManager.getJsonCookie('userEvents') || [];
        events.push({ event, data, timestamp: Date.now() });
        CookieManager.setJsonCookie('userEvents', events.slice(-50)); // Keep last 50
    }
};
```

### 4. **Remember Me Functionality**

```php
// In LoginController
public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
        'remember' => 'boolean',
    ]);

    if (Auth::attempt($credentials, $request->remember)) {
        $response = redirect()->intended('/dashboard');

        if ($request->remember) {
            // Set long-term remember cookie
            $response->cookie('remember_user', $request->email, 60 * 24 * 30);
        }

        return $response;
    }

    return back()->withErrors(['email' => 'Invalid credentials']);
}
```

## 📊 **Cookie Performance Tips**

1. **Minimize Cookie Size** - Keep cookies under 4KB
2. **Use Appropriate Expiration** - Don't set unnecessarily long expiration
3. **Limit Cookie Count** - Browsers limit ~50 cookies per domain
4. **Use HttpOnly for Security** - Prevent XSS attacks
5. **Set Proper SameSite** - Prevent CSRF attacks

## 🚀 **Advanced Features**

### Cookie-based A/B Testing

```typescript
const getABTestVariant = (testName: string): string => {
    let variant = CookieManager.getCookie(`ab_${testName}`);

    if (!variant) {
        variant = Math.random() > 0.5 ? 'A' : 'B';
        CookieManager.setCookie(`ab_${testName}`, variant, { expires: 30 });
    }

    return variant;
};

// Usage
const buttonColor = getABTestVariant('button_color') === 'A' ? 'blue' : 'green';
```

### Multi-domain Cookie Sharing

```php
// Set cookie for all subdomains
$response->cookie('shared_data', $value, 60, '/', '.yourdomain.com');
```

## ✅ **Current Implementation Status**

- ✅ Cookie utility functions created
- ✅ First visit tracking converted from localStorage to cookies
- ✅ Laravel middleware for cookie handling
- ✅ Security best practices documented
- ✅ GDPR compliance helpers
- ✅ Type-safe TypeScript implementations

Your application now has robust cookie support that works seamlessly between frontend and backend!
