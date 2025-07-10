import { create } from 'zustand';
import type { PaywallStore, PaywallPlan } from '../types/paywall';
import type { MWMWebViewHost, ProductDetails, SubscriptionDetails } from '../types/webview-api';

// Mock data for development
const mockPlans: PaywallPlan[] = [
    {
        id: 'monthly',
        sku: 'premium_monthly',
        name: 'Monthly Plan',
        period: 'monthly',
        price: 9.99,
        formattedPrice: '$9.99',
        features: [
            { id: '1', text: 'Unlimited access to all features', included: true },
            { id: '2', text: 'Premium support', included: true },
            { id: '3', text: 'Ad-free experience', included: true },
            { id: '4', text: 'Sync across devices', included: true },
        ],
    },
    {
        id: 'yearly',
        sku: 'premium_yearly',
        name: 'Yearly Plan',
        period: 'yearly',
        price: 59.99,
        formattedPrice: '$59.99',
        originalPrice: 119.88,
        formattedOriginalPrice: '$119.88',
        discount: 'Save 50%',
        features: [
            { id: '1', text: 'Unlimited access to all features', included: true },
            { id: '2', text: 'Premium support', included: true },
            { id: '3', text: 'Ad-free experience', included: true },
            { id: '4', text: 'Sync across devices', included: true },
        ],
        isRecommended: true,
        isPopular: true,
    },
];

const usePaywallStore = create<PaywallStore>((set, get) => ({
    // Initial state
    isLoading: false,
    isInitialized: false,
    error: null,

    // User eligibility
    isEligibleForTrial: false,
    trialDuration: undefined,

    // Device info
    deviceType: null,

    // Plans
    availablePlans: mockPlans,
    selectedPlan: null,

    // Purchase state
    isPurchasing: false,
    purchaseError: null,

    // UI state
    showOnboarding: true,
    currentOnboardingStep: 0,

    // Actions
    initialize: async () => {
        set({ isLoading: true, error: null });

        try {
            // Wait for WebView host to be ready
            await new Promise<void>((resolve) => {
                const checkWebViewHost = () => {
                    if (typeof window.MWMWebViewHost !== 'undefined') {
                        resolve();
                    } else {
                        setTimeout(checkWebViewHost, 100);
                    }
                };
                checkWebViewHost();
            });

            const host = window.MWMWebViewHost;

            // Get device type
            const deviceType = await host.getDeviceType();

            // Get product details
            const skus = deviceType === 'ios'
                ? ['premium_monthly_ios', 'premium_yearly_ios']
                : ['premium_monthly_android', 'premium_yearly_android'];

            const productDetails = await host.getProductDetails(skus);

            // Transform product details to our plan format
            const plans = Object.entries(productDetails).map(([sku, details]) => {
                const isYearly = sku.includes('yearly');
                const basePrice = (details as SubscriptionDetails).subscriptionPriceDetails.price;
                const formattedPrice = (details as SubscriptionDetails).subscriptionPriceDetails.formattedPrice;
                const introOffer = (details as SubscriptionDetails).introOffer;

                return {
                    id: isYearly ? 'yearly' : 'monthly',
                    sku,
                    name: isYearly ? 'Yearly Plan' : 'Monthly Plan',
                    period: isYearly ? 'yearly' as const : 'monthly' as const,
                    price: basePrice,
                    formattedPrice,
                    originalPrice: isYearly ? basePrice * 2 : undefined,
                    formattedOriginalPrice: isYearly ? `$${(basePrice * 2).toFixed(2)}` : undefined,
                    discount: isYearly ? 'Save 50%' : undefined,
                    features: [
                        { id: '1', text: 'Unlimited access to all features', included: true },
                        { id: '2', text: 'Premium support', included: true },
                        { id: '3', text: 'Ad-free experience', included: true },
                        { id: '4', text: 'Sync across devices', included: true },
                    ],
                    isRecommended: isYearly,
                    isPopular: isYearly,
                };
            });

            // Check trial eligibility
            const hasTrialOffer = Object.values(productDetails).some(
                (details) => (details as SubscriptionDetails).introOffer?.kind === 'free_trial'
            );

            const trialDuration = hasTrialOffer
                ? (Object.values(productDetails)[0] as SubscriptionDetails).introOffer?.duration
                : undefined;

            set({
                isInitialized: true,
                isLoading: false,
                deviceType,
                availablePlans: plans.length > 0 ? plans : mockPlans,
                selectedPlan: plans.find(p => p.isRecommended) || plans[0] || mockPlans[0],
                isEligibleForTrial: hasTrialOffer,
                trialDuration,
            });

        } catch (error) {
            console.error('Failed to initialize paywall:', error);
            set({
                isLoading: false,
                error: 'Failed to load payment information',
                isInitialized: true,
                deviceType: 'ios', // fallback
                selectedPlan: mockPlans[0],
            });
        }
    },

    selectPlan: (planId: string) => {
        const plan = get().availablePlans.find(p => p.id === planId);
        if (plan) {
            set({ selectedPlan: plan });
        }
    },

    purchaseSelectedPlan: async () => {
        const { selectedPlan } = get();
        if (!selectedPlan) return;

        set({ isPurchasing: true, purchaseError: null });

        try {
            const host = window.MWMWebViewHost;
            const result = await host.purchaseProduct(selectedPlan.sku);

            if (result.ok) {
                // Purchase successful
                set({ isPurchasing: false });
                await host.executeNavigationAction({ kind: 'close_page_container_action' });
            } else {
                // Purchase failed
                set({
                    isPurchasing: false,
                    purchaseError: result.reason === 'user_canceled'
                        ? 'Purchase was canceled'
                        : result.errorMessage || 'Purchase failed'
                });
            }
        } catch (error) {
            set({
                isPurchasing: false,
                purchaseError: 'Purchase failed. Please try again.'
            });
        }
    },

    restorePurchases: async () => {
        if (!window.MWMWebViewHost.restorePurchases) {
            set({ purchaseError: 'Restore purchases not available on this device' });
            return;
        }

        set({ isPurchasing: true, purchaseError: null });

        try {
            const result = await window.MWMWebViewHost.restorePurchases();

            if (result.ok) {
                set({ isPurchasing: false });
                await window.MWMWebViewHost.executeNavigationAction({ kind: 'close_page_container_action' });
            } else {
                set({
                    isPurchasing: false,
                    purchaseError: result.errorMessage || 'Failed to restore purchases'
                });
            }
        } catch (error) {
            set({
                isPurchasing: false,
                purchaseError: 'Failed to restore purchases. Please try again.'
            });
        }
    },

    closePaywall: async () => {
        try {
            await window.MWMWebViewHost.executeNavigationAction({ kind: 'close_page_container_action' });
        } catch (error) {
            console.error('Failed to close paywall:', error);
        }
    },

    nextOnboardingStep: () => {
        const { currentOnboardingStep } = get();
        if (currentOnboardingStep < 2) {
            set({ currentOnboardingStep: currentOnboardingStep + 1 });
        } else {
            set({ showOnboarding: false });
        }
    },

    skipOnboarding: () => {
        set({ showOnboarding: false });
    },

    setError: (error: string | null) => {
        set({ error });
    },
}));

export default usePaywallStore; 