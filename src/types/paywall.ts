export interface PaywallFeature {
    id: string;
    text: string;
    included: boolean;
}

export interface PaywallPlan {
    id: string;
    sku: string;
    name: string;
    period: 'monthly' | 'yearly';
    price: number;
    formattedPrice: string;
    originalPrice?: number;
    formattedOriginalPrice?: string;
    discount?: string;
    features: PaywallFeature[];
    isRecommended?: boolean;
    isPopular?: boolean;
}

export interface PaywallState {
    isLoading: boolean;
    isInitialized: boolean;
    error: string | null;

    // User eligibility
    isEligibleForTrial: boolean;
    trialDuration?: string;

    // Device info
    deviceType: 'ios' | 'android' | null;

    // Plans
    availablePlans: PaywallPlan[];
    selectedPlan: PaywallPlan | null;

    // Purchase state
    isPurchasing: boolean;
    purchaseError: string | null;

    // UI state
    showOnboarding: boolean;
    currentOnboardingStep: number;
}

export interface PaywallActions {
    initialize: () => Promise<void>;
    selectPlan: (planId: string) => void;
    purchaseSelectedPlan: () => Promise<void>;
    restorePurchases: () => Promise<void>;
    closePaywall: () => Promise<void>;
    nextOnboardingStep: () => void;
    skipOnboarding: () => void;
    setError: (error: string | null) => void;
}

export type PaywallStore = PaywallState & PaywallActions; 