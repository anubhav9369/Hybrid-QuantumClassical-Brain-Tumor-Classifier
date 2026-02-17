import { motion } from 'framer-motion';
import { Brain, Cpu, Atom } from 'lucide-react';

export default function Header() {
    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-8 px-4"
        >
            <div className="flex items-center justify-center gap-3 mb-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                    <Atom className="w-8 h-8 text-accent-purple" />
                </motion.div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent-purple via-accent-blue to-accent-cyan bg-clip-text text-transparent">
                    🧠 Hybrid Quantum-Classical Brain Tumor Classifier
                </h1>
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                    <Atom className="w-8 h-8 text-accent-cyan" />
                </motion.div>
            </div>
            <div className="flex items-center justify-center gap-4 text-text-secondary text-sm">
                <span className="flex items-center gap-1.5">
                    <Atom className="w-4 h-4 text-accent-purple" />
                    PennyLane Quantum Computing
                </span>
                <span className="text-border-light">|</span>
                <span className="flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-accent-blue" />
                    DenseNet121
                </span>
                <span className="text-border-light">|</span>
                <span className="flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-accent-cyan" />
                    Medical AI
                </span>
            </div>
        </motion.header>
    );
}
