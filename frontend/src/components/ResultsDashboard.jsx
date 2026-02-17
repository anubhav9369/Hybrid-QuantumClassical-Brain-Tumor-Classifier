import { motion } from 'framer-motion';
import { Target, Percent, BarChart3, AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react';

const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: (i) => ({
        opacity: 1, y: 0, scale: 1,
        transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
    }),
};

function getRiskIcon(level) {
    if (level === 'HIGH RISK') return <ShieldAlert className="w-6 h-6" />;
    if (level === 'MODERATE RISK') return <AlertTriangle className="w-6 h-6" />;
    return <ShieldCheck className="w-6 h-6" />;
}

function getRiskColor(color) {
    const map = {
        red: { bg: 'bg-risk-high/10', border: 'border-risk-high/30', text: 'text-risk-high' },
        amber: { bg: 'bg-risk-moderate/10', border: 'border-risk-moderate/30', text: 'text-risk-moderate' },
        green: { bg: 'bg-risk-low/10', border: 'border-risk-low/30', text: 'text-risk-low' },
        yellow: { bg: 'bg-risk-moderate/10', border: 'border-risk-moderate/30', text: 'text-risk-moderate' },
    };
    return map[color] || map.green;
}

export default function ResultsDashboard({ results }) {
    const { prediction, confidence, model_accuracy, risk_level } = results;
    const riskColors = getRiskColor(risk_level.color);

    const cards = [
        {
            title: 'Prediction',
            value: prediction.toUpperCase(),
            icon: <Target className="w-6 h-6" />,
            accent: 'text-accent-purple',
            bg: 'bg-accent-purple/10',
            border: 'border-accent-purple/30',
        },
        {
            title: 'Confidence',
            value: `${(confidence * 100).toFixed(2)}%`,
            icon: <Percent className="w-6 h-6" />,
            accent: 'text-accent-cyan',
            bg: 'bg-accent-cyan/10',
            border: 'border-accent-cyan/30',
        },
        {
            title: 'Model Accuracy',
            value: `${(model_accuracy * 100).toFixed(2)}%`,
            icon: <BarChart3 className="w-6 h-6" />,
            accent: 'text-accent-blue',
            bg: 'bg-accent-blue/10',
            border: 'border-accent-blue/30',
        },
        {
            title: 'Risk Level',
            value: risk_level.level,
            icon: getRiskIcon(risk_level.level),
            accent: riskColors.text,
            bg: riskColors.bg,
            border: riskColors.border,
        },
    ];

    return (
        <section className="max-w-5xl mx-auto px-4 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card, i) => (
                    <motion.div
                        key={card.title}
                        className={`card-glass gradient-border p-5 ${card.border} border`}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        custom={i}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-text-secondary text-sm font-medium">
                                {card.title}
                            </span>
                            <div className={`p-2 rounded-lg ${card.bg}`}>
                                <span className={card.accent}>{card.icon}</span>
                            </div>
                        </div>
                        <p className={`text-xl font-bold ${card.accent} leading-tight`}>
                            {card.value}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
