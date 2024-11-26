import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-radial from-primary-main/5 via-primary-main/10 to-transparent">
          <div className="gradient-box p-8 max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold text-text-light-primary dark:text-white mb-4">Something went wrong</h2>
            <p className="text-text-light-secondary dark:text-text-dark-secondary mb-6">
              We apologize for the inconvenience. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary-main hover:bg-primary-main/90 text-white rounded-lg transition-colors shadow-glow"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}