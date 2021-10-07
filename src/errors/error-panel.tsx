import React from 'react';
import { ErrorBoundaryFallbackProps } from './error-boundary';

export const ErrorPanel: React.FC<ErrorBoundaryFallbackProps> = ({
    error,
    retry,
}) => (
    <div>
        <div>Something went wrong!</div>
        <div>{ error.message }</div>
        <button onClick={() => retry()}>
            Retry
        </button>
    </div>
)
