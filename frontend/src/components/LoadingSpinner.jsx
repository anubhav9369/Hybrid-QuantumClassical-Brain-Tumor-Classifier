import { motion } from 'framer-motion';
import { Brain, Activity, Loader } from 'lucide-react';

export default function LoadingSpinner() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16"
        >
            {/* Outer ring */}
            <div className="relative w-32 h-32 mb-6">
                {/* Spinning ring */}
                <div className="absolute inset-0 rounded-full border-2 border-border" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-purple border-r-accent-cyan spin-slow" />

                {/* Inner pulsing brain */}
                <div className="absolute inset-4 flex items-center justify-center">
                    <div className="brain-pulse">
                        <Brain className="w-14 h-14 text-accent-purple" />
                    </div>
                </div>

                {/* Orbiting dots */}
                <motion.div
                    className="absolute w-3 h-3 rounded-full bg-accent-cyan"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    style={{ top: '-4px', left: 'calc(50% - 6px)' }}
                />
            </div>

            <h3 className="text-xl font-semibold text-text-primary mb-2">
                Analyzing MRI Scan
            </h3>
            <div className="flex items-center gap-2 text-text-secondary text-sm">
                <Activity className="w-4 h-4 text-accent-cyan" />
                <span>Running quantum-classical inference...</span>
            </div>

            {/* Progress steps */}
            <div className="mt-6 space-y-2 text-xs text-text-muted">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-2"
                >
                    <Loader className="w-3 h-3 animate-spin text-accent-purple" />
                    Extracting features with DenseNet121...
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="flex items-center gap-2"
                >
                    <Loader className="w-3 h-3 animate-spin text-accent-cyan" />
                    Processing through quantum circuit...
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5 }}
                    className="flex items-center gap-2"
                >
                    <Loader className="w-3 h-3 animate-spin text-accent-blue" />
                    Generating Grad-CAM visualizations...
                </motion.div>
            </div>
        </motion.div>
    );
}
