import React, { ReactNode, Suspense } from 'react';
import { ErrorBoundary, ErrorBoundaryProps } from '../errors';

type ErrorPropsWithoutChildren = Omit<ErrorBoundaryProps, 'children'>;

interface SuspendFactoryOptions {
    errorOptions?: ErrorPropsWithoutChildren;
    loadingFallback?: NonNullable<ReactNode> | null;
}

export const suspend = <T extends Record<string, unknown>>(
    Component: React.ComponentType<T>,
    options: SuspendFactoryOptions = {},
) => (props: T) => {
    const errorBoundaryProps: ErrorBoundaryProps = (options?.errorOptions ?? {}) as ErrorBoundaryProps;

    return (
        <ErrorBoundary {...errorBoundaryProps}>
            <Suspense fallback={options?.loadingFallback ?? <div>loading</div>}>
                <Component {...props} />
            </Suspense>
        </ErrorBoundary>
    )
}
