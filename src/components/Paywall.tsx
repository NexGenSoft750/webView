import React from 'react';
import usePaywallStore from '../store/paywall-store';
import PlanCard from './PlanCard';

const Paywall: React.FC = () => {
    const {
        availablePlans,
        selectedPlan,
        isEligibleForTrial,
        trialDuration,
        isPurchasing,
        purchaseError,
        purchaseSelectedPlan,
        restorePurchases,
        closePaywall,
        deviceType,
        setError
    } = usePaywallStore();

    const handlePurchase = async () => {
        if (!selectedPlan) return;
        await purchaseSelectedPlan();
    };

    const handleRestore = async () => {
        await restorePurchases();
    };

    const handleClose = async () => {
        await closePaywall();
    };

    const clearError = () => {
        setError(null);
    };

    return (
        <div className="paywall">
            <div className="paywall__header">
                <div></div>
                <h2 className="paywall__title">
                    {isEligibleForTrial ? 'Start Your Free Trial' : 'Choose Your Plan'}
                </h2>
                <button className="paywall__close" onClick={handleClose}>
                    ✕
                </button>
            </div>

            <div className="paywall__content">
                <h1 className="paywall__main-title">
                    {isEligibleForTrial
                        ? 'How your Free Trial Works'
                        : 'Enjoy the Premium Experience'
                    }
                </h1>

                <p className="paywall__subtitle">
                    {isEligibleForTrial
                        ? `Try all premium features for ${trialDuration || '3 days'} - cancel anytime`
                        : 'Get unlimited access to all premium features'
                    }
                </p>

                {purchaseError && (
                    <div className="error">
                        <p className="error-text">{purchaseError}</p>
                        <button
                            className="btn btn--link"
                            onClick={clearError}
                            style={{ marginTop: '8px' }}
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                <div className="paywall__plans">
                    {availablePlans.map((plan) => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                            isSelected={selectedPlan?.id === plan.id}
                            showTrialInfo={isEligibleForTrial}
                            trialDuration={trialDuration}
                        />
                    ))}
                </div>
            </div>

            <div className="action-buttons">
                <button
                    className="btn btn--primary"
                    onClick={handlePurchase}
                    disabled={isPurchasing || !selectedPlan}
                >
                    {isPurchasing ? (
                        <>
                            <div className="spinner" style={{ width: '20px', height: '20px' }} />
                            Processing...
                        </>
                    ) : (
                        isEligibleForTrial ? 'Start Free Trial' : 'Subscribe Now'
                    )}
                </button>

                <div style={{ display: 'flex', gap: '16px' }}>
                    {deviceType === 'ios' && (
                        <button
                            className="btn btn--secondary"
                            onClick={handleRestore}
                            disabled={isPurchasing}
                        >
                            Restore Purchases
                        </button>
                    )}

                    <button
                        className="btn btn--link"
                        onClick={handleClose}
                        disabled={isPurchasing}
                    >
                        Maybe Later
                    </button>
                </div>

                <div style={{
                    textAlign: 'center',
                    marginTop: '16px',
                    fontSize: '12px',
                    color: '#B0B0B0',
                    lineHeight: '1.4'
                }}>
                    {isEligibleForTrial ? (
                        <>
                            Free for {trialDuration || '3 days'}, then {selectedPlan?.formattedPrice} per {selectedPlan?.period}.
                            Cancel anytime to avoid charges.
                        </>
                    ) : (
                        <>
                            By subscribing, you agree to our Terms of Service and Privacy Policy.
                            Subscription automatically renews unless cancelled.
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Paywall; 