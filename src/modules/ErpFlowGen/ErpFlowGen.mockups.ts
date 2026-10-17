/**
 * Vector SVG Screen Mockups for Flowchart Node Hover Previews
 * Clean, lightweight, zero external dependencies data URIs
 */

const _svgToDataUri = (svgString: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
};

/**
 * Screen Mockup: Login Failed (Error 401 / Invalid Credentials)
 */
export const MOCKUP_LOGIN_FAILED_SVG = _svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 320" width="480" height="320">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.35"/>
    </filter>
  </defs>
  
  <!-- Background Canvas -->
  <rect width="480" height="320" fill="url(#bg)" rx="16" />
  
  <!-- Window Header Bar -->
  <rect width="480" height="36" fill="#090d16" rx="16" />
  <rect y="20" width="480" height="16" fill="#090d16" />
  <circle cx="24" cy="18" r="5" fill="#ef4444" />
  <circle cx="40" cy="18" r="5" fill="#f59e0b" />
  <circle cx="56" cy="18" r="5" fill="#10b981" />
  <text x="240" y="22" fill="#64748b" font-size="11" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-weight="600" text-anchor="middle">app.company.com/auth/login</text>
  
  <!-- Card Container -->
  <g filter="url(#shadow)">
    <rect x="70" y="52" width="340" height="248" rx="12" fill="#ffffff" />
  </g>
  
  <!-- Logo & Title -->
  <rect x="90" y="68" width="24" height="24" rx="6" fill="#4f46e5" />
  <text x="122" y="84" fill="#0f172a" font-size="14" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-weight="700">Enterprise Portal Login</text>
  
  <!-- Error Alert Banner -->
  <rect x="90" y="100" width="300" height="38" rx="6" fill="#fef2f2" stroke="#fecaca" stroke-width="1" />
  <circle cx="106" cy="119" r="7" fill="#ef4444" />
  <text x="106" y="122" fill="#ffffff" font-size="9" font-family="sans-serif" font-weight="bold" text-anchor="middle">!</text>
  <text x="122" y="115" fill="#991b1b" font-size="11" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-weight="700">Authentication Failed (401)</text>
  <text x="122" y="128" fill="#b91c1c" font-size="9.5" font-family="-apple-system, BlinkMacSystemFont, sans-serif">Invalid email or password. 2 attempts remaining.</text>
  
  <!-- Email Input (Red border state) -->
  <text x="90" y="154" fill="#334155" font-size="10" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-weight="600">Work Email</text>
  <rect x="90" y="160" width="300" height="28" rx="6" fill="#ffffff" stroke="#ef4444" stroke-width="1.5" />
  <text x="100" y="178" fill="#0f172a" font-size="10.5" font-family="sans-serif">alexander@company.com</text>
  
  <!-- Password Input (Red border state) -->
  <text x="90" y="202" fill="#334155" font-size="10" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-weight="600">Password</text>
  <rect x="90" y="208" width="300" height="28" rx="6" fill="#ffffff" stroke="#ef4444" stroke-width="1.5" />
  <text x="100" y="226" fill="#ef4444" font-size="12" font-family="sans-serif">•••••••••••••</text>
  
  <!-- Submit Button -->
  <rect x="90" y="248" width="300" height="32" rx="6" fill="#ef4444" />
  <text x="240" y="268" fill="#ffffff" font-size="11" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-weight="700" text-anchor="middle">Retry Sign In</text>
</svg>
`);

/**
 * Screen Mockup: Login Success / Main Dashboard
 */
export const MOCKUP_LOGIN_SUCCESS_SVG = _svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 320" width="480" height="320">
  <defs>
    <linearGradient id="navbg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
  </defs>
  
  <!-- Canvas Background -->
  <rect width="480" height="320" fill="#f8fafc" rx="16" />
  
  <!-- Top Navigation Bar -->
  <rect width="480" height="42" fill="url(#navbg)" rx="16" />
  <rect y="20" width="480" height="22" fill="url(#navbg)" />
  <circle cx="20" cy="21" r="4" fill="#ef4444" />
  <circle cx="32" cy="21" r="4" fill="#f59e0b" />
  <circle cx="44" cy="21" r="4" fill="#10b981" />
  
  <!-- Brand Title -->
  <rect x="64" y="11" width="20" height="20" rx="4" fill="#6366f1" />
  <text x="92" y="25" fill="#ffffff" font-size="11.5" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-weight="700">ERP Suite v4.2</text>
  
  <!-- User Badge -->
  <rect x="360" y="11" width="105" height="20" rx="10" fill="#312e81" />
  <circle cx="372" cy="21" r="6" fill="#10b981" />
  <text x="384" y="25" fill="#e0e7ff" font-size="9" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-weight="600">Septiana F. (Admin)</text>
  
  <!-- Main Header Banner -->
  <rect x="18" y="52" width="444" height="48" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
  <text x="32" y="73" fill="#0f172a" font-size="12" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-weight="700">Welcome Back, Administrator!</text>
  <text x="32" y="88" fill="#64748b" font-size="9.5" font-family="-apple-system, BlinkMacSystemFont, sans-serif">Secure active session • Connected to PostgreSQL Enterprise</text>
  <rect x="380" y="64" width="68" height="24" rx="6" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="1" />
  <text x="414" y="79" fill="#059669" font-size="9.5" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-weight="700" text-anchor="middle">ONLINE</text>

  <!-- Metric Cards Row -->
  <rect x="18" y="110" width="138" height="74" rx="8" fill="#ffffff" stroke="#e2e8f0" />
  <text x="30" y="128" fill="#64748b" font-size="9" font-family="sans-serif">Today's Transactions</text>
  <text x="30" y="152" fill="#0f172a" font-size="17" font-family="sans-serif" font-weight="800">$148,200</text>
  <text x="30" y="172" fill="#10b981" font-size="8.5" font-family="sans-serif" font-weight="700">▲ +14.2% vs yesterday</text>

  <rect x="171" y="110" width="138" height="74" rx="8" fill="#ffffff" stroke="#e2e8f0" />
  <text x="183" y="128" fill="#64748b" font-size="9" font-family="sans-serif">Ready to Ship</text>
  <text x="183" y="152" fill="#4f46e5" font-size="17" font-family="sans-serif" font-weight="800">342 Packages</text>
  <text x="183" y="172" fill="#6366f1" font-size="8.5" font-family="sans-serif" font-weight="600">Central Fulfillment Hub</text>

  <rect x="324" y="110" width="138" height="74" rx="8" fill="#ffffff" stroke="#e2e8f0" />
  <text x="336" y="128" fill="#64748b" font-size="9" font-family="sans-serif">Server Health</text>
  <text x="336" y="152" fill="#059669" font-size="17" font-family="sans-serif" font-weight="800">99.98%</text>
  <text x="336" y="172" fill="#059669" font-size="8.5" font-family="sans-serif" font-weight="600">Latency: 18ms</text>

  <!-- Recent Table Preview -->
  <rect x="18" y="194" width="444" height="112" rx="8" fill="#ffffff" stroke="#e2e8f0" />
  <text x="32" y="214" fill="#0f172a" font-size="10.5" font-family="sans-serif" font-weight="700">Recent Document Processing Queue</text>
  <line x1="18" y1="224" x2="462" y2="224" stroke="#f1f5f9" stroke-width="1" />
  
  <text x="32" y="244" fill="#334155" font-size="9.5" font-family="monospace">#SO-9921</text>
  <text x="120" y="244" fill="#0f172a" font-size="9.5" font-family="sans-serif">Acme Corporation Ltd</text>
  <rect x="360" y="233" width="85" height="16" rx="4" fill="#ecfdf5" />
  <text x="402" y="245" fill="#059669" font-size="8.5" font-family="sans-serif" font-weight="700" text-anchor="middle">APPROVED</text>

  <text x="32" y="270" fill="#334155" font-size="9.5" font-family="monospace">#PO-8812</text>
  <text x="120" y="270" fill="#0f172a" font-size="9.5" font-family="sans-serif">Global Logistics Inc</text>
  <rect x="360" y="259" width="85" height="16" rx="4" fill="#eff6ff" />
  <text x="402" y="271" fill="#2563eb" font-size="8.5" font-family="sans-serif" font-weight="700" text-anchor="middle">PROCESSING</text>
</svg>
`);

/**
 * Screen Mockup: Checkout / Order Input Form
 */
export const MOCKUP_CHECKOUT_FORM_SVG = _svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 320" width="480" height="320">
  <rect width="480" height="320" fill="#f8fafc" rx="16" />
  
  <!-- Browser Header -->
  <rect width="480" height="34" fill="#0f172a" rx="16" />
  <rect y="18" width="480" height="16" fill="#0f172a" />
  <circle cx="20" cy="17" r="4.5" fill="#ef4444" />
  <circle cx="34" cy="17" r="4.5" fill="#f59e0b" />
  <circle cx="48" cy="17" r="4.5" fill="#10b981" />
  <text x="240" y="21" fill="#94a3b8" font-size="10.5" font-family="sans-serif" font-weight="600" text-anchor="middle">checkout.store.com/order/step-3</text>
  
  <!-- Checkout Title -->
  <text x="24" y="60" fill="#0f172a" font-size="13" font-family="sans-serif" font-weight="800">Checkout &amp; Shipping Confirmation</text>
  
  <!-- Two Columns: Left Form (260px), Right Summary (160px) -->
  <!-- Left Box: Customer Info -->
  <rect x="24" y="74" width="260" height="150" rx="8" fill="#ffffff" stroke="#e2e8f0" />
  <text x="36" y="94" fill="#475569" font-size="10" font-family="sans-serif" font-weight="700">1. Shipping Address</text>
  <rect x="36" y="104" width="236" height="24" rx="4" fill="#f8fafc" stroke="#cbd5e1" />
  <text x="44" y="119" fill="#0f172a" font-size="9" font-family="sans-serif">742 Evergreen Terrace, Springfield</text>
  
  <text x="36" y="146" fill="#475569" font-size="10" font-family="sans-serif" font-weight="700">2. Delivery Carrier</text>
  <rect x="36" y="154" width="236" height="24" rx="4" fill="#eef2ff" stroke="#6366f1" />
  <text x="44" y="169" fill="#4338ca" font-size="9" font-family="sans-serif" font-weight="700">FedEx Priority (Next Day Delivery) • $15.00</text>
  
  <text x="36" y="196" fill="#475569" font-size="10" font-family="sans-serif" font-weight="700">3. Payment Method</text>
  <rect x="36" y="202" width="236" height="16" rx="4" fill="#f8fafc" stroke="#cbd5e1" />
  <text x="44" y="213" fill="#64748b" font-size="8.5" font-family="sans-serif">Stripe Card / ACH (Automated Verification)</text>
  
  <!-- Right Box: Order Summary -->
  <rect x="296" y="74" width="160" height="228" rx="8" fill="#ffffff" stroke="#e2e8f0" />
  <text x="310" y="94" fill="#0f172a" font-size="10.5" font-family="sans-serif" font-weight="700">Order Summary</text>
  
  <text x="310" y="118" fill="#64748b" font-size="8.5" font-family="sans-serif">1x Enterprise ERP Architecture Guide</text>
  <text x="435" y="118" fill="#0f172a" font-size="8.5" font-family="sans-serif" font-weight="600" text-anchor="end">$120.00</text>
  
  <text x="310" y="136" fill="#64748b" font-size="8.5" font-family="sans-serif">Shipping (Express)</text>
  <text x="435" y="136" fill="#0f172a" font-size="8.5" font-family="sans-serif" font-weight="600" text-anchor="end">$15.00</text>
  
  <text x="310" y="154" fill="#64748b" font-size="8.5" font-family="sans-serif">Sales Tax (8%)</text>
  <text x="435" y="154" fill="#0f172a" font-size="8.5" font-family="sans-serif" font-weight="600" text-anchor="end">$10.80</text>
  
  <line x1="310" y1="168" x2="435" y2="168" stroke="#e2e8f0" stroke-width="1" />
  
  <text x="310" y="186" fill="#0f172a" font-size="9.5" font-family="sans-serif" font-weight="700">Grand Total</text>
  <text x="435" y="188" fill="#4f46e5" font-size="12" font-family="sans-serif" font-weight="800" text-anchor="end">$145.80</text>
  
  <rect x="310" y="248" width="132" height="34" rx="6" fill="#10b981" />
  <text x="376" y="269" fill="#ffffff" font-size="10.5" font-family="sans-serif" font-weight="700" text-anchor="middle">Pay Now 👉</text>
</svg>
`);

/**
 * Screen Mockup: 404 / 500 Error Screen
 */
export const MOCKUP_ERROR_404_SVG = _svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 320" width="480" height="320">
  <rect width="480" height="320" fill="#0f172a" rx="16" />
  
  <!-- Header Bar -->
  <rect width="480" height="34" fill="#090d16" rx="16" />
  <rect y="18" width="480" height="16" fill="#090d16" />
  <circle cx="20" cy="17" r="4.5" fill="#ef4444" />
  <circle cx="34" cy="17" r="4.5" fill="#f59e0b" />
  <circle cx="48" cy="17" r="4.5" fill="#10b981" />
  <text x="240" y="21" fill="#64748b" font-size="10" font-family="sans-serif" font-weight="600" text-anchor="middle">HTTP Error 404 - Not Found</text>
  
  <!-- Big 404 Text -->
  <text x="240" y="130" fill="#ef4444" font-size="64" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-weight="900" text-anchor="middle" letter-spacing="4">404</text>
  
  <!-- Message -->
  <text x="240" y="165" fill="#ffffff" font-size="14" font-family="sans-serif" font-weight="700" text-anchor="middle">Page or Endpoint Not Found</text>
  <text x="240" y="188" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle">The requested URL is not registered on this gateway or has been deprecated.</text>
  
  <!-- Code Box -->
  <rect x="90" y="208" width="300" height="42" rx="6" fill="#1e293b" stroke="#334155" />
  <text x="105" y="226" fill="#f43f5e" font-size="9" font-family="monospace">GET /api/v1/unknown-endpoint</text>
  <text x="105" y="240" fill="#64748b" font-size="8.5" font-family="monospace">Status: 404 Resource_Not_Found [E_ROUTE_MISSING]</text>
  
  <!-- Back Button -->
  <rect x="180" y="266" width="120" height="28" rx="6" fill="#3b82f6" />
  <text x="240" y="284" fill="#ffffff" font-size="10" font-family="sans-serif" font-weight="700" text-anchor="middle">Back to Home</text>
</svg>
`);

export type MockupPreset = {
  id: string;
  name: string;
  caption: string;
  dataUrl: string;
  category: 'auth' | 'dashboard' | 'transaction' | 'error';
};

export const SCREEN_MOCKUP_PRESETS: MockupPreset[] = [
  {
    id: 'preset_login_failed',
    name: '🔴 Login Failed (401 Error Screen)',
    caption: 'Login form appearance upon invalid password/credentials (HTTP 401 Unauthorized)',
    dataUrl: MOCKUP_LOGIN_FAILED_SVG,
    category: 'auth',
  },
  {
    id: 'preset_login_success',
    name: '🟢 Main Dashboard (Login Success)',
    caption: 'ERP dashboard and KPI metrics view upon verified active session',
    dataUrl: MOCKUP_LOGIN_SUCCESS_SVG,
    category: 'dashboard',
  },
  {
    id: 'preset_checkout_form',
    name: '🛒 Checkout & Shipping Form',
    caption: 'Checkout form view with shipping carrier selection and price breakdown',
    dataUrl: MOCKUP_CHECKOUT_FORM_SVG,
    category: 'transaction',
  },
  {
    id: 'preset_error_404',
    name: '⚠️ Error 404 / Route Missing',
    caption: 'Fallback error screen view when resource or endpoint is missing',
    dataUrl: MOCKUP_ERROR_404_SVG,
    category: 'error',
  },
];
