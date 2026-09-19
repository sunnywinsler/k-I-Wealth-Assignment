import { AppProvider, useApp } from './context/AppContext';
import { RequirementForm } from './components/RequirementForm';
import { OpportunityList } from './components/OpportunityList';
import { ComparisonView } from './components/ComparisonView';
import { OpportunityDetail } from './components/OpportunityDetail';
import { EligibilityCheck } from './components/EligibilityCheck';
import './App.css';

function MainNavigator() {
  const { state, setScreen, startCompare } = useApp();

  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="brand-box" onClick={() => setScreen('requirement')} role="button" tabIndex={0}>
            <div className="brand-logo-badge">K&I</div>
            <div className="brand-text">
              <span className="brand-title">WealthTech Navigator</span>
              <span className="brand-subtitle">Loan Against Securities (LAS)</span>
            </div>
          </div>

          {/* Stepper Navigation */}
          <nav className="journey-stepper" aria-label="Application journey steps">
            <button
              type="button"
              className={`step-item ${state.screen === 'requirement' ? 'active' : state.requirement ? 'completed' : ''}`}
              onClick={() => setScreen('requirement')}
            >
              <span className="step-num">1</span>
              <span className="step-label">Requirements</span>
            </button>

            <span className="step-connector">›</span>

            <button
              type="button"
              className={`step-item ${state.screen === 'listing' ? 'active' : ''}`}
              onClick={() => setScreen('listing')}
            >
              <span className="step-num">2</span>
              <span className="step-label">Opportunities</span>
            </button>

            <span className="step-connector">›</span>

            <button
              type="button"
              className={`step-item ${state.screen === 'comparison' ? 'active' : ''}`}
              onClick={() => {
                if (state.compareIds.length >= 2) {
                  setScreen('comparison');
                } else {
                  startCompare();
                }
              }}
            >
              <span className="step-num">3</span>
              <span className="step-label">
                Compare {state.compareIds.length > 0 && `(${state.compareIds.length})`}
              </span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Screen Content */}
      <main className="app-main-content">
        {state.screen === 'requirement' && <RequirementForm />}
        {state.screen === 'listing' && <OpportunityList />}
        {state.screen === 'comparison' && <ComparisonView />}
      </main>

      {/* Modals & Overlays */}
      <OpportunityDetail />
      <EligibilityCheck />

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-inner">
          <p className="footer-disclaimer">
            K&I WealthTech Assessment Engine • Fictional dataset for demonstration purposes. Rates & LTVs are indicative based on collateral quality.
          </p>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <MainNavigator />
    </AppProvider>
  );
}

export default App;
