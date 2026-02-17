import { motion } from 'framer-motion';
import { Atom, Cpu, Zap, GitBranch } from 'lucide-react';

export default function QuantumAnalysisTab() {
    const gates = [
        { name: 'Hadamard (H)', desc: 'Creates superposition states', color: 'text-accent-purple' },
        { name: 'RZ Rotation', desc: 'Encodes classical features into quantum phase', color: 'text-accent-cyan' },
        { name: 'CNOT', desc: 'Entangles neighboring qubits', color: 'text-accent-blue' },
        { name: 'RY Rotation', desc: 'Trainable variational parameters', color: 'text-accent-pink' },
    ];

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <Atom className="w-5 h-5 text-accent-cyan" />
                <h3 className="text-lg font-semibold text-text-primary">
                    Quantum Circuit Analysis
                </h3>
            </div>

            {/* Circuit specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                    { label: 'Qubits', value: '4', icon: <Atom className="w-4 h-4" /> },
                    { label: 'Circuit Depth', value: '2', icon: <GitBranch className="w-4 h-4" /> },
                    { label: 'Backend', value: 'PennyLane', icon: <Cpu className="w-4 h-4" /> },
                    { label: 'Simulator', value: 'default.qubit', icon: <Zap className="w-4 h-4" /> },
                ].map((spec, i) => (
                    <motion.div
                        key={spec.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card-glass p-4 text-center"
                    >
                        <div className="flex justify-center mb-2 text-accent-cyan">{spec.icon}</div>
                        <p className="text-xl font-bold text-text-primary">{spec.value}</p>
                        <p className="text-text-muted text-xs mt-1">{spec.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Circuit diagram */}
            <div className="card-glass p-5 mb-6">
                <h4 className="text-sm font-semibold text-text-secondary mb-4">Circuit Architecture</h4>
                <div className="font-mono text-xs leading-relaxed overflow-x-auto">
                    <div className="space-y-1 text-text-primary">
                        <p><span className="text-accent-purple">q₀:</span> ──H──RZ(x₀)──●───────RY(θ₀₀)──●───────RY(θ₁₀)──●───────⟨Z⟩</p>
                        <p><span className="text-accent-purple">q₁:</span> ──H──RZ(x₁)──X──●────RY(θ₀₁)──X──●────RY(θ₁₁)──X──●────⟨Z⟩</p>
                        <p><span className="text-accent-purple">q₂:</span> ──H──RZ(x₂)─────X──●─RY(θ₀₂)─────X──●─RY(θ₁₂)─────X──●─⟨Z⟩</p>
                        <p><span className="text-accent-purple">q₃:</span> ──H──RZ(x₃)────────X─RY(θ₀₃)────────X─RY(θ₁₃)────────X─⟨Z⟩</p>
                    </div>
                </div>
            </div>

            {/* Gate descriptions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {gates.map((gate, i) => (
                    <motion.div
                        key={gate.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="card-glass p-4 flex items-start gap-3"
                    >
                        <div className={`mt-0.5 ${gate.color}`}>
                            <Zap className="w-4 h-4" />
                        </div>
                        <div>
                            <p className={`font-semibold text-sm ${gate.color}`}>{gate.name}</p>
                            <p className="text-text-muted text-xs mt-0.5">{gate.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
