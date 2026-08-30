import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CRITICAL UNCAUGHT REACT ERROR:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    window.location.hash = '';
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-xl w-full bg-[#141414] border border-amber-500/30 rounded-3xl p-8 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[#C5A059] flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <span className="text-xs font-mono uppercase tracking-widest text-[#C5A059] block mb-2 font-bold">
              Auric Travels Recovery System
            </span>
            <h1 className="text-2xl font-serif font-bold text-white mb-3">
              Application Experience Encountered an Issue
            </h1>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              We encountered an unexpected condition while rendering this view. Our automatic fallback system is ready to restore your journey.
            </p>

            {this.state.error && (
              <div className="bg-black/60 border border-white/10 rounded-xl p-4 mb-6 text-left overflow-x-auto">
                <p className="text-xs font-mono text-rose-400 font-semibold mb-1">
                  {this.state.error.name}: {this.state.error.message}
                </p>
                {this.state.error.stack && (
                  <pre className="text-[10px] font-mono text-gray-500 max-h-32 overflow-y-auto">
                    {this.state.error.stack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C5A059] hover:bg-[#F3E5AB] text-black text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#C5A059]/20 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>
              <a
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider transition-all"
              >
                <Home className="w-4 h-4" />
                <span>Return to Homepage</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
