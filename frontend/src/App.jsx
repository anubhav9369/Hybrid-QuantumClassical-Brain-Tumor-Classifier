import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Eye, Atom, Layers, ShieldCheck, FileText } from 'lucide-react';

import Header from './components/Header';
import UploadSection from './components/UploadSection';
import LoadingSpinner from './components/LoadingSpinner';
import ResultsDashboard from './components/ResultsDashboard';
import ProbabilityChart from './components/ProbabilityChart';
import GradCAMTab from './components/GradCAMTab';
import QuantumAnalysisTab from './components/QuantumAnalysisTab';
import FeatureAnalysisTab from './components/FeatureAnalysisTab';
import ConfidenceAnalysisTab from './components/ConfidenceAnalysisTab';
import ClinicalReportTab from './components/ClinicalReportTab';
import { analyzeMRI } from './api';

const TABS = [
  { id: 'gradcam', label: 'Grad-CAM', icon: <Eye className="w-4 h-4" /> },
  { id: 'quantum', label: 'Quantum Analysis', icon: <Atom className="w-4 h-4" /> },
  { id: 'features', label: 'Feature Analysis', icon: <Layers className="w-4 h-4" /> },
  { id: 'confidence', label: 'Confidence Analysis', icon: <ShieldCheck className="w-4 h-4" /> },
  { id: 'clinical', label: 'Clinical Report', icon: <FileText className="w-4 h-4" /> },
];

export default function App() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('gradcam');

  const handleAnalyze = async (file) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await analyzeMRI(file);
      setResults(data);
      setActiveTab('gradcam');
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderTabContent = () => {
    if (!results) return null;

    switch (activeTab) {
      case 'gradcam':
        return (
          <GradCAMTab
            gradcamImages={results.gradcam_images}
            probabilities={results.probabilities}
            prediction={results.prediction}
          />
        );
      case 'quantum':
        return <QuantumAnalysisTab />;
      case 'features':
        return <FeatureAnalysisTab />;
      case 'confidence':
        return (
          <ConfidenceAnalysisTab
            probabilities={results.probabilities}
            prediction={results.prediction}
            confidence={results.confidence}
          />
        );
      case 'clinical':
        return <ClinicalReportTab results={results} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-12">
      <Header />

      <UploadSection onAnalyze={handleAnalyze} isLoading={isLoading} />

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl mx-auto px-4 mb-6"
          >
            <div className="card-glass border-risk-high/30 border p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-risk-high flex-shrink-0" />
              <div>
                <p className="text-risk-high font-semibold text-sm">Analysis Failed</p>
                <p className="text-text-muted text-xs mt-0.5">{error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      <AnimatePresence>
        {isLoading && <LoadingSpinner />}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {results && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ResultsDashboard results={results} />

            <ProbabilityChart
              probabilities={results.probabilities}
              prediction={results.prediction}
            />

            {/* Tabs */}
            <section className="max-w-5xl mx-auto px-4">
              <div className="card-glass p-6">
                {/* Tab buttons */}
                <div className="flex gap-2 overflow-x-auto pb-2 mb-6 border-b border-border">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`tab-button flex items-center gap-2 ${activeTab === tab.id ? 'active' : ''
                        }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderTabContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="text-center py-8 mt-8">
        <p className="text-text-muted text-xs">
          Hybrid Quantum-Classical Brain Tumor Classifier · DenseNet121 + PennyLane
        </p>
        <p className="text-text-muted text-xs mt-1">
          For research and educational purposes only. Not a medical device.
        </p>
      </footer>
    </div>
  );
}
