import React from 'react';

export interface ErrorBoundaryFallbackProps {
    error: Error;
    retry: () => void;
}

interface RetryConfig {
    times: number;
    intervalMs: number;
}

interface ErrorBoundaryBaseProps {
    children: React.ReactChild | React.ReactNodeArray;
}

interface ErrorBoundaryManualProps extends ErrorBoundaryBaseProps {
    fallback: React.ComponentType<ErrorBoundaryFallbackProps>;
}

interface ErrorBoundaryRetryPolicyProps extends ErrorBoundaryBaseProps {
    fallback: React.ComponentType<{}>;
    retryPolicy: RetryConfig;
}

export type ErrorBoundaryProps = ErrorBoundaryManualProps | ErrorBoundaryRetryPolicyProps;

interface ErrorBoundaryState {
    error?: Error;
    count: number;
    hasError: boolean;
}

const isRetryPolicy = (props: ErrorBoundaryProps): props is ErrorBoundaryRetryPolicyProps => !!(props as ErrorBoundaryRetryPolicyProps).retryPolicy;

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    public readonly state: ErrorBoundaryState = {
        count: 0,
        hasError: false,
        error: undefined, 
    };

    static getDerivedStateFromError(error: Error) {
      return {
        hasError: true,
        error
      };
    }

    private retry = () => {
        this.setState(state => ({
            hasError: false,
            count: state.count + 1,
            error: undefined,
        }));
    }

    render() {
        const {
            count,
            error,
            hasError,
        } = this.state;

        const {
            fallback: Fallback,
            children,
        } = this.props;

        if (!isRetryPolicy(this.props)) return hasError ? <Fallback error={error!} retry={this.retry} /> : children;

        const { retryPolicy } = this.props;
        if (hasError && count < retryPolicy.times) setTimeout(() => { this.retry() }, retryPolicy.intervalMs);
        
        const Fb = Fallback as React.ComponentType<{}>;
        return hasError ? <Fb /> : children;
    }
}
