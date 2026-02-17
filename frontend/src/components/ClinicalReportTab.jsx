import { motion } from 'framer-motion';
import { FileText, AlertTriangle, CheckCircle, Info } from 'lucide-react';

function getRiskExplanation(prediction, confidence, riskLevel) {
    const tumorInfo = {
        glioma: {
            description: 'Gliomas are tumors that arise from glial cells in the brain. They are the most common type of primary brain tumor and can range from low-grade (slow-growing) to high-grade (aggressive).',
            recommendation: 'Immediate neurosurgical consultation is strongly recommended. MRI with contrast and potentially a biopsy may be required to determine the exact grade and plan treatment.',
        },
        meningioma: {
            description: 'Meningiomas originate from the meninges, the membranes surrounding the brain and spinal cord. Most meningiomas are benign and slow-growing, but some can be atypical or malignant.',
            recommendation: 'Neurosurgical evaluation is recommended. Depending on size and location, treatment may include observation, surgery, or radiation therapy.',
        },
        no_tumor: {
            description: 'The analysis suggests no significant tumor mass is detected in this MRI scan. The brain structures appear within normal parameters for the model\'s assessment.',
            recommendation: 'While no tumor was detected, this AI assessment should not replace professional medical evaluation. Regular follow-up imaging may be recommended based on clinical symptoms.',
        },
        pituitary: {
            description: 'Pituitary tumors develop in the pituitary gland at the base of the brain. Most are benign adenomas, but they can cause significant hormonal imbalances and visual disturbances.',
            recommendation: 'Endocrinological and neurosurgical consultation is recommended. Hormone level testing and visual field assessment may be needed.',
        },
    };

    return tumorInfo[prediction] || tumorInfo.no_tumor;
}

export default function ClinicalReportTab({ results }) {
    const { prediction, confidence, risk_level, model_accuracy } = results;
    const info = getRiskExplanation(prediction, confidence, risk_level);

    const timestamp = new Date().toLocaleString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-accent-blue" />
                <h3 className="text-lg font-semibold text-text-primary">
                    Clinical Analysis Report
                </h3>
            </div>

            <div className="card-glass p-6 space-y-6">
                {/* Report Header */}
                <div className="border-b border-border pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-lg font-bold text-text-primary">
                                Brain MRI Analysis Report
                            </h4>
                            <p className="text-text-muted text-sm mt-1">
                                AI-Assisted Diagnostic Report · {timestamp}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-text-muted">Report ID</p>
                            <p className="text-xs font-mono text-text-secondary">
                                {`RPT-${Date.now().toString(36).toUpperCase()}`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Findings */}
                <div>
                    <h5 className="text-sm font-semibold text-accent-purple mb-3 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Findings
                    </h5>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-bg-secondary rounded-lg p-3">
                            <p className="text-text-muted text-xs">Predicted Classification</p>
                            <p className="text-text-primary font-bold capitalize mt-1">
                                {prediction.replace('_', ' ')}
                            </p>
                        </div>
                        <div className="bg-bg-secondary rounded-lg p-3">
                            <p className="text-text-muted text-xs">Confidence Level</p>
                            <p className="text-text-primary font-bold mt-1">
                                {(confidence * 100).toFixed(2)}%
                            </p>
                        </div>
                        <div className="bg-bg-secondary rounded-lg p-3">
                            <p className="text-text-muted text-xs">Risk Assessment</p>
                            <p className={`font-bold mt-1 ${risk_level.color === 'red' ? 'text-risk-high' :
                                    risk_level.color === 'amber' ? 'text-risk-moderate' :
                                        'text-risk-low'
                                }`}>
                                {risk_level.level}
                            </p>
                        </div>
                        <div className="bg-bg-secondary rounded-lg p-3">
                            <p className="text-text-muted text-xs">Model Accuracy</p>
                            <p className="text-text-primary font-bold mt-1">
                                {(model_accuracy * 100).toFixed(2)}%
                            </p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <h5 className="text-sm font-semibold text-accent-cyan mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Clinical Description
                    </h5>
                    <p className="text-text-secondary text-sm leading-relaxed">
                        {info.description}
                    </p>
                </div>

                {/* Recommendation */}
                <div>
                    <h5 className="text-sm font-semibold text-accent-blue mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Recommendation
                    </h5>
                    <p className="text-text-secondary text-sm leading-relaxed">
                        {info.recommendation}
                    </p>
                </div>

                {/* Disclaimer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-risk-moderate/5 border border-risk-moderate/20 rounded-xl p-4"
                >
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-risk-moderate flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-risk-moderate font-semibold text-sm">Important Disclaimer</p>
                            <p className="text-text-muted text-xs mt-1 leading-relaxed">
                                This report is generated by an AI model and should be used alongside professional
                                radiologist interpretation. It is not intended as a standalone diagnostic tool.
                                Always consult with qualified medical professionals for definitive diagnosis and treatment decisions.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
