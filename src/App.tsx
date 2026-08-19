import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Topbar } from './components/layout/Topbar';
import { Sidebar } from './components/layout/Sidebar';
import { DemoBar } from './components/demo/DemoBar';
import { LandingPage } from './components/dashboard/LandingPage';
import { FarmOverview } from './components/dashboard/FarmOverview';
import { SatelliteIntel } from './components/dashboard/SatelliteIntel';
import { WeatherIntel } from './components/dashboard/WeatherIntel';
import { SoilHealth } from './components/dashboard/SoilHealth';
import { CropAdvisor } from './components/dashboard/CropAdvisor';
import { DiseaseDoctor } from './components/dashboard/DiseaseDoctor';
import { RegenerativeAg } from './components/dashboard/RegenerativeAg';
import { AgroGPT } from './components/dashboard/AgroGPT';
import { DigitalTwin } from './components/dashboard/DigitalTwin';
import { BRICSNetwork } from './components/dashboard/BRICSNetwork';
import { AuthorityDashboard } from './components/dashboard/AuthorityDashboard';
import { AlertCenter } from './components/dashboard/AlertCenter';
import { TechnicalArch } from './components/dashboard/TechnicalArch';
import { DPGManifesto } from './components/dashboard/DPGManifesto';
import { PageSkeleton } from './components/ui/Skeleton';
import { FarmerCameraModal } from './components/dashboard/FarmerCameraModal';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { YieldForecast } from './components/dashboard/YieldForecast';
import { CropEconomics } from './components/dashboard/CropEconomics';
import { DataConsent } from './components/dashboard/DataConsent';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in AGROVERSE AI component tree:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0f0d] flex items-center justify-center p-6 text-white font-sans">
          <div className="max-w-md bg-[#111a14] border border-[#23362a] rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-800 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white">AGROVERSE AI Recovered from Error</h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              A component error was captured: <code className="text-emerald-400 font-mono text-[11px]">{this.state.error?.message || 'Unknown error'}</code>
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload AGROVERSE AI Dashboard</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const AppContent: React.FC = () => {
  const { currentView, isLoading } = useApp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isFarmerCameraOpen, setIsFarmerCameraOpen] = useState(false);

  const renderView = () => {
    if (isLoading) {
      return <PageSkeleton />;
    }

    if (currentView === 'landing') {
      return <LandingPage />;
    }

    switch (currentView) {
      case 'overview':
        return <FarmOverview />;
      case 'yield-forecast':
        return <YieldForecast />;
      case 'crop-economics':
        return <CropEconomics />;
      case 'data-consent':
        return <DataConsent />;
      case 'satellite':
        return <SatelliteIntel />;
      case 'weather':
        return <WeatherIntel />;
      case 'soil':
        return <SoilHealth />;
      case 'advisor':
        return <CropAdvisor />;
      case 'disease':
        return <DiseaseDoctor />;
      case 'regenerative':
        return <RegenerativeAg />;
      case 'agrogpt':
        return <AgroGPT />;
      case 'digital-twin':
        return <DigitalTwin />;
      case 'brics-network':
        return <BRICSNetwork />;
      case 'authority':
        return <AuthorityDashboard />;
      case 'alerts':
        return <AlertCenter />;
      case 'how-it-thinks':
        return <TechnicalArch />;
      case 'dpg-manifesto':
        return <DPGManifesto />;
      default:
        return <FarmOverview />;
    }
  };

  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-[#0a0f0d]">
        <LandingPage />
        <DemoBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f0d] flex flex-col selection:bg-emerald-500 selection:text-white">
      <Topbar 
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />
      <div className="flex flex-1 relative">
        <Sidebar 
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto w-full min-w-0">
          <ErrorBoundary>
            {renderView()}
          </ErrorBoundary>
        </main>
      </div>

      {/* Farmer Camera Modal */}
      {isFarmerCameraOpen && (
        <FarmerCameraModal
          isOpen={isFarmerCameraOpen}
          onClose={() => setIsFarmerCameraOpen(false)}
        />
      )}

      <DemoBar />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
