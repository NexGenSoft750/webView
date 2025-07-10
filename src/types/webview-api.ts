export interface WebViewHostDeferredInitializer {
    init(callbackName: string): void;
}

export interface PriceDetails {
    price: number;
    formattedPrice: string;
    currencyCode: string;
}

export interface OneTimePurchaseDetails {
    kind: 'one_time_purchase';
    sku: string;
    priceDetails: PriceDetails;
}

export interface IntroOffer {
    kind: 'free_trial' | 'pay_up_front' | 'pay_as_you_go';
    duration?: string;
    periodDuration?: string;
    periodCount?: number;
    priceDetails?: PriceDetails;
    periodPriceDetails?: PriceDetails;
}

export interface SubscriptionDetails {
    kind: 'subscription';
    sku: string;
    subscriptionPeriod: string;
    subscriptionPriceDetails: PriceDetails;
    introOffer: IntroOffer | null;
}

export type ProductDetails = OneTimePurchaseDetails | SubscriptionDetails;

export interface PurchaseResult {
    ok: boolean;
    reason?: 'user_canceled' | 'error';
    errorMessage?: string;
}

export interface RestoreResult {
    ok: boolean;
    errorMessage?: string;
}

export interface NavigationAction {
    kind: 'close_page_container_action' | 'close_navigation_graph_action' | 'navigate_to_target_action' | 'go_to_next_page_navigation_action';
    target?: string;
}

export interface MWMWebViewHost {
    getDeviceType(): Promise<"android" | "ios">;
    getProductDetails(skus: string[]): Promise<Record<string, ProductDetails>>;
    purchaseProduct(sku: string): Promise<PurchaseResult>;
    executeNavigationAction(action: NavigationAction): Promise<void>;
    markOnboardingAsCompleted?: () => Promise<void>;
    restorePurchases?: () => Promise<RestoreResult>;
}

declare global {
    interface Window {
        MWMWebViewHost: MWMWebViewHost;
        webViewHostDeferredInitializer?: WebViewHostDeferredInitializer;
    }
} 