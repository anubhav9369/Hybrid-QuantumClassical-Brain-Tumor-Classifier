import { useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, X, Scan } from 'lucide-react';

export default function UploadSection({ onAnalyze, isLoading }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef(null);

    const handleFile = useCallback((f) => {
        if (!f || !f.type.startsWith('image/')) return;
        setFile(f);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(f);
    }, []);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files[0];
        handleFile(f);
    }, [handleFile]);

    const clear = () => {
        setFile(null);
        setPreview(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto px-4 mb-8"
        >
            <div
                className={`dropzone p-8 text-center ${dragOver ? 'drag-over' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => !file && inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files[0])}
                />

                <AnimatePresence mode="wait">
                    {!preview ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="py-8"
                        >
                            <Upload className="w-12 h-12 mx-auto mb-4 text-text-muted" />
                            <p className="text-text-primary font-medium mb-1">
                                Drop your MRI scan here
                            </p>
                            <p className="text-text-muted text-sm">
                                or click to browse · JPG, PNG supported
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative"
                        >
                            <button
                                onClick={(e) => { e.stopPropagation(); clear(); }}
                                className="absolute -top-2 -right-2 z-10 bg-bg-card border border-border rounded-full p-1.5 hover:bg-risk-high/20 transition-colors"
                            >
                                <X className="w-4 h-4 text-text-secondary" />
                            </button>
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative rounded-xl overflow-hidden border border-border">
                                    <img
                                        src={preview}
                                        alt="MRI Preview"
                                        className="w-48 h-48 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/60 to-transparent" />
                                </div>
                                <div className="flex items-center gap-2 text-sm text-text-secondary">
                                    <ImageIcon className="w-4 h-4" />
                                    <span>{file?.name}</span>
                                    <span className="text-text-muted">
                                        ({(file?.size / 1024).toFixed(1)} KB)
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {file && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-center"
                >
                    <button
                        onClick={() => onAnalyze(file)}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-accent-purple to-accent-blue
              hover:from-accent-purple/90 hover:to-accent-blue/90
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300 shadow-lg shadow-accent-purple/25
              hover:shadow-accent-purple/40 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Scan className="w-5 h-5" />
                        {isLoading ? 'Analyzing...' : 'Analyze MRI Scan'}
                    </button>
                </motion.div>
            )}
        </motion.section>
    );
}
