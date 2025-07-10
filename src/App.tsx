import { useEffect } from 'react';
import usePaywallStore from './store/paywall-store';
import Onboarding from './components/Onboarding';
import Paywall from './components/Paywall';
import { initializeMockWebView } from './utils/mock-webview';
import './styles/main.scss';
// import type { PaywallPlan } from '../types/paywall';

function App() {
  const {
    isInitialized,
    isLoading,
    error,
    showOnboarding,
    initialize
  } = usePaywallStore();

  useEffect(() => {
    // Initialize WebView API when component mounts
    const initializeWebView = async () => {
      // For development - initialize mock WebView API
      if (import.meta.env.DEV) {
        initializeMockWebView();
      }

      // Check if we're in WebView environment
      if (typeof window.webViewHostDeferredInitializer !== 'undefined') {
        // Set up the callback for WebView initialization
        (window as any).onWebViewHostReady = () => {
          initialize();
        };

        // Initialize WebView host
        window.webViewHostDeferredInitializer.init('onWebViewHostReady');
      } else {
        // For development/testing - initialize directly
        initialize();
      }
    };

    initializeWebView();
  }, [initialize]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner" />
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !isInitialized) {
    return (
      <div className="container">
        <div className="loading">
          <div className="error">
            <p className="error-text">{error}</p>
          </div>
          <button
            className="btn btn--primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show onboarding if not completed
  if (showOnboarding) {
    return <Onboarding />;
  }

  // Show paywall
  return <Paywall />;
}

export default App;
