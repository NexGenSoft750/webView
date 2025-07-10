import type { MWMWebViewHost, ProductDetails, PurchaseResult, RestoreResult } from '../types/webview-api';

// Mock data for development
const mockProductDetails: Record<string, ProductDetails> = {
    'premium_monthly_ios': {
        kind: 'subscription',
        sku: 'premium_monthly_ios',
        subscriptionPeriod: 'monthly',
        subscriptionPriceDetails: {
            price: 9.99,
            formattedPrice: '$9.99',
            currencyCode: 'USD'
        },
        introOffer: {
            kind: 'free_trial',
            duration: '3 days'
        }
    },
    'premium_yearly_ios': {
        kind: 'subscription',
        sku: 'premium_yearly_ios',
        subscriptionPeriod: 'yearly',
        subscriptionPriceDetails: {
            price: 59.99,
            formattedPrice: '$59.99',
            currencyCode: 'USD'
        },
        introOffer: {
            kind: 'free_trial',
            duration: '3 days'
        }
    },
    'premium_monthly_android': {
        kind: 'subscription',
        sku: 'premium_monthly_android',
        subscriptionPeriod: 'monthly',
        subscriptionPriceDetails: {
            price: 9.99,
            formattedPrice: '$9.99',
            currencyCode: 'USD'
        },
        introOffer: null // Android user not eligible for trial
    },
    'premium_yearly_android': {
        kind: 'subscription',
        sku: 'premium_yearly_android',
        subscriptionPeriod: 'yearly',
        subscriptionPriceDetails: {
            price: 59.99,
            formattedPrice: '$59.99',
            currencyCode: 'USD'
        },
        introOffer: null // Android user not eligible for trial
    }
};

// Mock WebView Host implementation
const mockWebViewHost: MWMWebViewHost = {
    getDeviceType: async () => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Return iOS by default for development (can be changed for testing)
        return 'ios';
    },

    getProductDetails: async (skus: string[]) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const result: Record<string, ProductDetails> = {};
        skus.forEach(sku => {
            if (mockProductDetails[sku]) {
                result[sku] = mockProductDetails[sku];
            }
        });

        return result;
    },

    purchaseProduct: async (sku: string): Promise<PurchaseResult> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simulate different outcomes for testing
        const random = Math.random();

        if (random < 0.8) {
            // 80% success rate
            return { ok: true };
        } else if (random < 0.9) {
            // 10% user canceled
            return { ok: false, reason: 'user_canceled' };
        } else {
            // 10% error
            return {
                ok: false,
                reason: 'error',
                errorMessage: 'Payment method declined'
            };
        }
    },

    restorePurchases: async (): Promise<RestoreResult> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate success for testing
        return { ok: true };
    },

    executeNavigationAction: async (action) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 200));

        console.log('Navigation action executed:', action);

        if (action.kind === 'close_page_container_action') {
            console.log('Closing paywall...');
        }
    },

    markOnboardingAsCompleted: async () => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 200));

        console.log('Onboarding marked as completed');
    }
};

// Initialize mock WebView API for development
export const initializeMockWebView = () => {
    if (typeof window !== 'undefined' && !window.MWMWebViewHost) {
        window.MWMWebViewHost = mockWebViewHost;

        // Also set up the deferred initializer for testing
        window.webViewHostDeferredInitializer = {
            init: (callbackName: string) => {
                setTimeout(() => {
                    if (window[callbackName as keyof Window]) {
                        (window[callbackName as keyof Window] as Function)();
                    }
                }, 100);
            }
        };
    }
};

export default mockWebViewHost; 