import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, BarChart3 } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    ResponsiveContainer, Cell, Tooltip,
} from 'recharts';

const CLASS_COLORS = {
    glioma: '#ef4444',
    meningioma: '#f59e0b',
    no_tumor: '#22c55e',
    pituitary: '#3b82f6',
};

export default function ConfidenceAnalysisTab({ probabilities, prediction, confidence }) {
    // Sort probabilities
    const sorted = Object.entries(probabilities)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    const top = sorted[0];
    const second = sorted[1];
    const margin = top.value - second.value;

    // Determine reliability
    let reliability, reliabilityColor, reliabilityBg;
    if (confidence >= 0.90) {
        reliability = 'Very High';
        reliabilityColor = 'text-risk-low';
        reliabilityBg = 'bg-risk-low/10';
    } else if (confidence >= 0.70) {
        reliability = 'High';
        reliabilityColor = 'text-accent-cyan';
        reliabilityBg = 'bg-accent-cyan/10';
    } else if (confidence >= 0.50) {
        reliability = 'Moderate';
        reliabilityColor = 'text-risk-moderate';
        reliabilityBg = 'bg-risk-moderate/10';
    } else {
        reliability = 'Low';
        reliabilityColor = 'text-risk-high';
        reliabilityBg = 'bg-risk-high/10';
    }

    const metrics = [
        {
            label: 'Top Prediction',
            value: top.name.replace('_', ' ').toUpperCase(),
            sub: `${(top.value * 100).toFixed(2)}%`,
            icon: <TrendingUp className="w-5 h-5" />,
            color: 'text-accent-purple',
        },
        {
            label: 'Runner-up',
            value: second.name.replace('_', ' ').toUpperCase(),
            sub: `${(second.value * 100).toFixed(2)}%`,
            icon: <BarChart3 className="w-5 h-5" />,
            color: 'text-accent-blue',
        },
        {
            label: 'Confidence Margin',
            value: `${(margin * 100).toFixed(2)}%`,
            sub: margin > 0.5 ? 'Strong separation' : margin > 0.2 ? 'Moderate separation' : 'Weak separation',
            icon: <ShieldCheck className="w-5 h-5" />,
            color: margin > 0.5 ? 'text-risk-low' : margin > 0.2 ? 'text-risk-moderate' : 'text-risk-high',
        },
        {
            label: 'Reliability',
            value: reliability,
            sub: `Based on ${(confidence * 100).toFixed(2)}% confidence`,
            icon: <ShieldCheck className="w-5 h-5" />,
            color: reliabilityColor,
        },
    ];

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-accent-cyan" />
                <h3 className="text-lg font-semibold text-text-primary">
                    Confidence Analysis
                </h3>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {metrics.map((m, i) => (
                    <motion.div
                        key={m.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card-glass p-4"
                    >
                        <div className={`mb-2 ${m.color}`}>{m.icon}</div>
                        <p className="text-text-muted text-xs">{m.label}</p>
                        <p className={`font-bold text-sm mt-1 ${m.color}`}>{m.value}</p>
                        <p className="text-text-muted text-xs mt-0.5">{m.sub}</p>
                    </motion.div>
                ))}
            </div>

            {/* Comparison chart */}
            <div className="card-glass p-5">
                <h4 className="text-sm font-semibold text-text-secondary mb-3">
                    Probability Distribution
                </h4>
                <div style={{ width: '100%', height: 200 }}>
                    <ResponsiveContainer>
                        <BarChart data={sorted} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2a3050" />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: '#94a3b8', fontSize: 11 }}
                                tickFormatter={(v) => v.replace('_', ' ')}
                                axisLine={{ stroke: '#2a3050' }}
                            />
                            <YAxis
                                domain={[0, 1]}
                                tick={{ fill: '#94a3b8', fontSize: 11 }}
                                tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                                axisLine={{ stroke: '#2a3050' }}
                            />
                            <Tooltip
                                formatter={(v) => `${(v * 100).toFixed(2)}%`}
                                contentStyle={{ background: '#1a1f35', border: '1px solid #2a3050', borderRadius: '8px', color: '#f1f5f9' }}
                            />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
                                {sorted.map((entry) => (
                                    <Cell
                                        key={entry.name}
                                        fill={CLASS_COLORS[entry.name]}
                                        opacity={entry.name === prediction ? 1 : 0.4}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
