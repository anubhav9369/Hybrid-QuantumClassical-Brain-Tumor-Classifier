import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

const CLASS_COLORS = {
    glioma: { border: 'border-red-500/40', label: 'text-red-400', bg: 'bg-red-500/10' },
    meningioma: { border: 'border-amber-500/40', label: 'text-amber-400', bg: 'bg-amber-500/10' },
    no_tumor: { border: 'border-green-500/40', label: 'text-green-400', bg: 'bg-green-500/10' },
    pituitary: { border: 'border-blue-500/40', label: 'text-blue-400', bg: 'bg-blue-500/10' },
};

export default function GradCAMTab({ gradcamImages, probabilities, prediction }) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-accent-purple" />
                <h3 className="text-lg font-semibold text-text-primary">
                    Grad-CAM Activation Maps
                </h3>
            </div>
            <p className="text-text-secondary text-sm mb-6">
                Gradient-weighted Class Activation Mapping shows which regions of the MRI the model focuses on for each class prediction.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(gradcamImages).map(([className, base64Img], i) => {
                    const isPredicted = className === prediction;
                    const prob = probabilities[className];
                    const colors = CLASS_COLORS[className] || CLASS_COLORS.glioma;

                    return (
                        <motion.div
                            key={className}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`card-glass overflow-hidden ${isPredicted ? `ring-2 ring-accent-purple ${colors.border}` : 'border border-border'}`}
                        >
                            {isPredicted && (
                                <div className="bg-accent-purple/20 text-accent-purple text-xs font-semibold text-center py-1">
                                    ★ PREDICTED CLASS
                                </div>
                            )}
                            <div className="p-3">
                                <img
                                    src={`data:image/png;base64,${base64Img}`}
                                    alt={`Grad-CAM ${className}`}
                                    className="w-full aspect-square object-cover rounded-lg mb-3"
                                />
                                <div className="text-center">
                                    <p className={`font-semibold capitalize ${colors.label}`}>
                                        {className.replace('_', ' ')}
                                    </p>
                                    <p className="text-text-muted text-sm mt-1">
                                        {(prob * 100).toFixed(2)}%
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
