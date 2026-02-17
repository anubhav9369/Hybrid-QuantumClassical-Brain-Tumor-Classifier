import { motion } from 'framer-motion';
import { Layers, ArrowRight, Brain, Atom, Merge } from 'lucide-react';

export default function FeatureAnalysisTab() {
    const pipeline = [
        {
            title: 'Input MRI',
            desc: '224 × 224 × 3 RGB image',
            icon: <Layers className="w-5 h-5" />,
            color: 'text-accent-blue',
            bg: 'bg-accent-blue/10',
        },
        {
            title: 'DenseNet121',
            desc: '1024-dim feature vector extracted via adaptive avg pooling',
            icon: <Brain className="w-5 h-5" />,
            color: 'text-accent-purple',
            bg: 'bg-accent-purple/10',
        },
        {
            title: 'Feature Reducer',
            desc: '1024 → 256 → 64 → 4 (Tanh activation)',
            icon: <Layers className="w-5 h-5" />,
            color: 'text-accent-cyan',
            bg: 'bg-accent-cyan/10',
        },
        {
            title: 'Quantum Layer',
            desc: '4 qubits, 2-depth variational circuit → 4 PauliZ expectations',
            icon: <Atom className="w-5 h-5" />,
            color: 'text-accent-pink',
            bg: 'bg-accent-pink/10',
        },
        {
            title: 'Feature Fusion',
            desc: 'Concatenate quantum output (4) + classical features (1024) = 1028-dim',
            icon: <Merge className="w-5 h-5" />,
            color: 'text-risk-moderate',
            bg: 'bg-risk-moderate/10',
        },
        {
            title: 'Classifier',
            desc: '1028 → 512 → 256 → 4 classes (with BatchNorm + Dropout)',
            icon: <Layers className="w-5 h-5" />,
            color: 'text-risk-low',
            bg: 'bg-risk-low/10',
        },
    ];

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-accent-blue" />
                <h3 className="text-lg font-semibold text-text-primary">
                    Feature Extraction Pipeline
                </h3>
            </div>
            <p className="text-text-secondary text-sm mb-6">
                The hybrid quantum-classical architecture combines deep learning feature extraction with quantum computing for enhanced classification.
            </p>

            <div className="space-y-3">
                {pipeline.map((step, i) => (
                    <motion.div
                        key={step.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <div className="card-glass p-4 flex items-center gap-4">
                            <div className={`flex-shrink-0 p-2.5 rounded-xl ${step.bg}`}>
                                <span className={step.color}>{step.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`font-semibold text-sm ${step.color}`}>{step.title}</p>
                                <p className="text-text-muted text-xs mt-0.5">{step.desc}</p>
                            </div>
                            <div className="flex-shrink-0 text-text-muted text-xs font-mono bg-bg-secondary px-2 py-1 rounded">
                                Step {i + 1}
                            </div>
                        </div>
                        {i < pipeline.length - 1 && (
                            <div className="flex justify-center py-1">
                                <ArrowRight className="w-4 h-4 text-border-light rotate-90" />
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
