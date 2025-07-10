# Mobile Paywall Project

A complete mobile-first paywall implementation built with React, TypeScript, and SCSS. This project is designed to be embedded in iOS/Android WebViews and provides a seamless subscription experience.

## 🚀 Features

- **Mobile-First Design**: Optimized for mobile devices with touch-friendly interactions
- **WebView Integration**: Full integration with iOS/Android WebView APIs
- **Dual User States**: 
  - Eligible users (with free trial)
  - Non-eligible users (standard pricing)
- **Onboarding Flow**: 3-step feature introduction
- **Subscription Management**: Multiple plan options with plan switching
- **Purchase Flow**: Complete purchase and restore functionality
- **Responsive Design**: Works across all mobile screen sizes
- **Error Handling**: Comprehensive error states and user feedback

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **SCSS** - Styling with variables and mixins
- **Zustand** - State management
- **Vite** - Build tool and development server

## 📱 Design Implementation

Based on the provided Figma designs, the project includes:

1. **Onboarding Screens** (Slides 1-3)
   - Feature introduction with smooth animations
   - Step indicators and navigation
   - Skip functionality

2. **Paywall for Eligible Users** (Slides 4-6)
   - Free trial messaging
   - "Try Free for 3 Days" call-to-action
   - Trial duration display

3. **Paywall for Non-Eligible Users** (Slides 7-9)
   - Standard subscription messaging
   - "Subscribe Now" call-to-action
   - Plan comparison

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Onboarding.tsx      # 3-step onboarding flow
│   ├── Paywall.tsx         # Main paywall component
│   └── PlanCard.tsx        # Individual plan cards
├── store/
│   └── paywall-store.ts    # Zustand store for state management
├── types/
│   ├── webview-api.ts      # WebView API type definitions
│   └── paywall.ts          # Paywall-specific types
├── utils/
│   └── mock-webview.ts     # Mock WebView API for development
├── styles/
│   └── main.scss           # Complete SCSS styling
└── App.tsx                 # Main application component
```

## 🔧 Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## 🧪 Testing

The project includes a comprehensive mock WebView API for development and testing:

- **Device Type Simulation**: Test both iOS and Android flows
- **Trial Eligibility**: Toggle between eligible/non-eligible states
- **Purchase Outcomes**: Simulate success, cancellation, and error states
- **Network Delays**: Realistic loading states

### Testing Different Scenarios

1. **iOS with Trial Eligibility**
   - Edit `mock-webview.ts` → `getDeviceType()` returns `'ios'`
   - Mock includes `introOffer` with free trial

2. **Android without Trial**
   - Edit `mock-webview.ts` → `getDeviceType()` returns `'android'`
   - Mock sets `introOffer` to `null`

3. **Purchase Flow Testing**
   - 80% success rate
   - 10% user cancellation
   - 10% error scenarios

## 📱 WebView Integration

### Production Integration

The app automatically detects the WebView environment and initializes the API:

```typescript
// WebView initialization callback
window.onWebViewHostReady = () => {
  // App initializes when WebView is ready
};

// Initialize WebView host
window.webViewHostDeferredInitializer.init('onWebViewHostReady');
```

### Required WebView APIs

The project expects these APIs to be available:

- `getDeviceType()` - Returns 'ios' or 'android'
- `getProductDetails(skus)` - Returns subscription details
- `purchaseProduct(sku)` - Handles purchase flow
- `restorePurchases()` - Restores previous purchases (iOS only)
- `executeNavigationAction(action)` - Handles navigation
- `markOnboardingAsCompleted()` - Marks onboarding complete (Android only)

## 🎨 Styling & Customization

### SCSS Variables

Key variables for easy customization:

```scss
$primary-color: #00B4D8;
$primary-dark: #0090B8;
$bg-dark: #1A1A1A;
$card-bg: #2D2D2D;
$text-primary: #FFFFFF;
$text-secondary: #B0B0B0;
```

### Typography Scale

```scss
$font-size-title: 28px;
$font-size-subtitle: 22px;
$font-size-body: 16px;
$font-size-caption: 14px;
$font-size-small: 12px;
```

### Responsive Breakpoints

- **Base**: 320px (minimum mobile width)
- **Standard**: 375px (iPhone standard)
- **Large**: 414px+ (iPhone Plus/Pro Max)

## 🔄 State Management

The app uses Zustand for state management with these key states:

```typescript
interface PaywallState {
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  isEligibleForTrial: boolean;
  trialDuration?: string;
  deviceType: 'ios' | 'android' | null;
  availablePlans: PaywallPlan[];
  selectedPlan: PaywallPlan | null;
  isPurchasing: boolean;
  purchaseError: string | null;
  showOnboarding: boolean;
  currentOnboardingStep: number;
}
```

## 🚀 Deployment

### Production Build

```bash
npm run build
```

The build generates optimized static files in the `dist/` directory.

### Deployment Checklist

- [ ] Configure proper HTTPS hosting
- [ ] Set up CDN for static assets
- [ ] Configure proper cache headers
- [ ] Test in actual WebView environment
- [ ] Verify all API integrations
- [ ] Test purchase flows end-to-end

## 📱 Mobile Optimization

- **Touch Targets**: Minimum 44px for comfortable tapping
- **Viewport**: Proper mobile viewport meta tags
- **Scrolling**: Disabled bounce scrolling on iOS
- **Performance**: Optimized bundle size and lazy loading
- **Accessibility**: ARIA labels and keyboard navigation

## 🔧 Development Notes

### Environment Variables

The app automatically detects development mode and uses mock APIs:

```typescript
if (import.meta.env.DEV) {
  initializeMockWebView();
}
```

### Error Handling

Comprehensive error handling for:
- Network failures
- Purchase cancellations
- API timeouts
- Invalid responses

### Performance Considerations

- Lazy loading for components
- Optimized SCSS compilation
- Minimal bundle size
- Efficient state updates

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is proprietary and confidential.

## 🆘 Support

For technical support or questions:
- Check the mock WebView API for development testing
- Review the comprehensive error handling
- Verify proper WebView integration

---

**Built with ❤️ for mobile-first subscription experiences**
