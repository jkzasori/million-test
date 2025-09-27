'use client';

import React, { ErrorInfo, ReactNode } from 'react';
import { ErrorHandler } from '../../infrastructure/errors/ErrorHandler';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorId: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call optional error handler
    this.props.onError?.(error, errorInfo);
    
    // Send to error tracking service (Sentry, LogRocket, etc.)
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: '',
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorDetails = ErrorHandler.handle(this.state.error);
      
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-icon">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            
            <h1 className="error-title">Something went wrong</h1>
            <p className="error-message">{errorDetails.userFriendlyMessage}</p>
            
            <div className="error-actions">
              <button 
                onClick={this.handleRetry}
                className="btn-primary"
              >
                Try Again
              </button>
              
              <button 
                onClick={this.handleReload}
                className="btn-secondary"
              >
                Reload Page
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Error Details (Development Only)</summary>
                <div className="error-stack">
                  <p><strong>Error ID:</strong> {this.state.errorId}</p>
                  <p><strong>Error Code:</strong> {errorDetails.code}</p>
                  <p><strong>Message:</strong> {this.state.error.message}</p>
                  <p><strong>Stack:</strong></p>
                  <pre>{this.state.error.stack}</pre>
                </div>
              </details>
            )}
          </div>
          
          <style jsx>{`
            .error-boundary {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: var(--spacing-xl);
              background: var(--color-background);
            }
            
            .error-boundary-content {
              max-width: 500px;
              text-align: center;
              padding: var(--spacing-xxl);
              border-radius: var(--radius-lg);
              background: white;
              box-shadow: var(--shadow-lg);
            }
            
            .error-icon {
              color: var(--color-error);
              margin-bottom: var(--spacing-lg);
            }
            
            .error-title {
              font-family: var(--font-display);
              font-size: 2rem;
              font-weight: 700;
              color: var(--color-primary);
              margin-bottom: var(--spacing-md);
            }
            
            .error-message {
              color: var(--color-text-secondary);
              font-size: 1.125rem;
              line-height: 1.6;
              margin-bottom: var(--spacing-xl);
            }
            
            .error-actions {
              display: flex;
              gap: var(--spacing-md);
              justify-content: center;
              margin-bottom: var(--spacing-lg);
            }
            
            .error-details {
              text-align: left;
              margin-top: var(--spacing-lg);
              padding: var(--spacing-md);
              background: var(--color-surface);
              border-radius: var(--radius-md);
              border: 1px solid var(--color-border);
            }
            
            .error-stack {
              font-size: 0.875rem;
              color: var(--color-text-secondary);
            }
            
            .error-stack pre {
              white-space: pre-wrap;
              word-break: break-word;
              background: var(--color-background);
              padding: var(--spacing-sm);
              border-radius: var(--radius-sm);
              margin-top: var(--spacing-sm);
              font-family: monospace;
              font-size: 0.75rem;
            }
            
            @media (max-width: 768px) {
              .error-boundary-content {
                padding: var(--spacing-lg);
              }
              
              .error-title {
                font-size: 1.5rem;
              }
              
              .error-actions {
                flex-direction: column;
              }
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}