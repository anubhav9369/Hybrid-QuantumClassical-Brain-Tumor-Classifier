import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, LabelList,
} from 'recharts';

const CLASS_COLORS = {
    glioma: '#ef4444',
    meningioma: '#f59e0b',
    no_tumor: '#22c55e',
    pituitary: '#3b82f6',
};

function CustomTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
        <div className="card-glass px-4 py-3 text-sm">
            <p className="font-semibold text-text-primary capitalize">{d.name}</p>
            <p className="text-accent-cyan">{d.percentage}%</p>
        </div>
    );
}

export default function ProbabilityChart({ probabilities, prediction }) {
    const data = Object.entries(probabilities)
        .map(([name, value]) => ({
            name,
            value: value,
            percentage: (value * 100).toFixed(2),
        }))
        .sort((a, b) => b.value - a.value);

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-5xl mx-auto px-4 mb-8"
        >
            <div className="card-glass p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4">
                    Class Probabilities
                </h2>
                <div style={{ width: '100%', height: 220 }}>
                    <ResponsiveContainer>
                        <BarChart
                            data={data}
                            layout="vertical"
                            margin={{ top: 5, right: 60, left: 20, bottom: 5 }}
                            barCategoryGap="25%"
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#2a3050" horizontal={false} />
                            <XAxis
                                type="number"
                                domain={[0, 1]}
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                                axisLine={{ stroke: '#2a3050' }}
                            />
                            <YAxis
                                type="category"
                                dataKey="name"
                                tick={{ fill: '#f1f5f9', fontSize: 13, fontWeight: 500 }}
                                axisLine={{ stroke: '#2a3050' }}
                                width={100}
                                tickFormatter={(v) => v.replace('_', ' ').toUpperCase()}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124, 58, 237, 0.08)' }} />
                            <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={28}>
                                {data.map((entry) => (
                                    <Cell
                                        key={entry.name}
                                        fill={CLASS_COLORS[entry.name]}
                                        opacity={entry.name === prediction ? 1 : 0.45}
                                    />
                                ))}
                                <LabelList
                                    dataKey="percentage"
                                    position="right"
                                    fill="#f1f5f9"
                                    fontSize={12}
                                    fontWeight={600}
                                    formatter={(v) => `${v}%`}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </motion.section>
    );
}
