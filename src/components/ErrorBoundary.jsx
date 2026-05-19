import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to an error reporting service
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Render any custom fallback UI
            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-8 bg-white dark:bg-zinc-950/50 rounded-2xl border border-red-200 dark:border-red-900/30 text-center shadow-sm">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Something went wrong</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-md">
                        {this.state.error?.message || "An unexpected error occurred while rendering this component. Please try reloading the page."}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium shadow-sm"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Reload Application
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
