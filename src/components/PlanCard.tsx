import React from 'react';
import type { PaywallPlan } from '../types/paywall';
import usePaywallStore from '../store/paywall-store';
import clsx from 'clsx';

interface PlanCardProps {
    plan: PaywallPlan;
    isSelected: boolean;
    showTrialInfo?: boolean;
    trialDuration?: string;
}

const PlanCard: React.FC<PlanCardProps> = ({
    plan,
    isSelected,
    showTrialInfo = false,
    trialDuration = '3 days'
}) => {
    const { selectPlan } = usePaywallStore();

    const handleSelect = () => {
        selectPlan(plan.id);
    };

    return (
        <div
            className={clsx('plan-card', {
                'selected': isSelected
            })}
            onClick={handleSelect}
        >
            {plan.isPopular && (
                <div className="plan-card__badge">
                    Most Popular
                </div>
            )}

            <div className="plan-card__header">
                <div>
                    <h3 className="plan-card__title">{plan.name}</h3>
                    <p className="plan-card__period">
                        {plan.period === 'monthly' ? 'Monthly' : 'Yearly'}
                    </p>
                </div>

                <div className="plan-card__price">
                    <div className="plan-card__amount">
                        {plan.formattedPrice}
                    </div>
                    {plan.originalPrice && (
                        <div className="plan-card__original-price">
                            {plan.formattedOriginalPrice}
                        </div>
                    )}
                    {plan.discount && (
                        <div style={{
                            fontSize: '12px',
                            color: '#4CAF50',
                            fontWeight: '600',
                            marginTop: '4px'
                        }}>
                            {plan.discount}
                        </div>
                    )}
                </div>
            </div>

            {showTrialInfo && (
                <div className="plan-card__trial-info">
                    <p className="plan-card__trial-text">
                        Try free for {trialDuration}
                    </p>
                </div>
            )}

            <ul className="plan-card__features">
                {plan.features.map((feature) => (
                    <li key={feature.id} className="plan-card__feature">
                        {feature.text}
                    </li>
                ))}
            </ul>

            <div className={clsx('plan-card__radio', {
                'checked': isSelected
            })} />
        </div>
    );
};

export default PlanCard; 