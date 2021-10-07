import React, { useMemo, ReactNode, Suspense } from 'react';
import { ErrorBoundary, ErrorBoundaryProps } from '../errors';
import { SuspenseRepository } from './create-repository';

type ErrorPropsWithoutChildren = Omit<ErrorBoundaryProps, 'children'>;

type LoadedDataType<TReturn, TProps> = TReturn extends React.ComponentType<TProps> ? React.ComponentType<TProps> : TReturn;

interface SuspenseComponentComponentProps<
    TProps extends Record<string, unknown>,
    TReturn,
    TArgs extends unknown[] = []
> {
    errorOptions?: ErrorPropsWithoutChildren;
    loadingFallback?: NonNullable<ReactNode> | null;
    // repository: SuspenseRepository<LoadedDataType<TReturn, TProps>, TArgs>;
    repository: SuspenseRepository<React.ComponentType<TProps>, TArgs>;
    repositoryArguments: TArgs;
    props?: TProps; /* If a react component is loaded this is nice but if a xhr or fetch request is made this does not make sense */
}

interface SuspenseComponentDataProps<
    TReturn,
    TArgs extends unknown[] = []
> {
    errorOptions?: ErrorPropsWithoutChildren;
    loadingFallback?: NonNullable<ReactNode> | null;
    repository: SuspenseRepository<TReturn, TArgs>;
    repositoryArguments: TArgs;
    layoutComponent: React.ComponentType<{ children: TReturn }>;
}

type SuspenseComponentProps<
    TProps extends Record<string, unknown>,
    TReturn,
    TArgs extends unknown[] = []
> = SuspenseComponentComponentProps<TProps, TReturn, TArgs> | SuspenseComponentDataProps<TReturn, TArgs>;

interface ComponentProps<TProps, TArgs extends unknown[] = []> {
    props?: TProps;
    repositoryArguments: TArgs;
}

interface DataProps<TReturn, TArgs extends unknown[] = []> {
    layoutComponent: React.ComponentType<{ children: TReturn }>;
    repositoryArguments: TArgs;
}

const componentFactory = <
    T extends Record<string, unknown>,
    TReturn,
    TArgs extends unknown[] = []
>(repository: SuspenseRepository<React.ComponentType<T>, TArgs>) => ({
    props,
    repositoryArguments,
}: ComponentProps<T, TArgs>) => {
    const Cmp = repository.read(...repositoryArguments);
    return <Cmp {...props as T} />;
}

const dataFactory = <
    T extends Record<string, unknown>,
    TReturn,
    TArgs extends unknown[] = []
>(repository: SuspenseRepository<TReturn, TArgs>) => ({
    layoutComponent: Cmp,
    repositoryArguments,
}: DataProps<TReturn, TArgs>) => {
    const data = repository.read(...repositoryArguments);
    return <Cmp>{ data }</Cmp>;
}

export const isComponent = <
    TProps extends Record<string, unknown>,
    TReturn,
    TArgs extends unknown[] = []
>(obj: SuspenseComponentProps<TProps, TReturn, TArgs>): obj is SuspenseComponentComponentProps<TProps, TReturn, TArgs> => 
  !!(obj as SuspenseComponentComponentProps<TProps, TReturn, TArgs>).props;

const SuspenseComponentComponent = <TProps extends Record<string, unknown>, TReturn, TArgs extends unknown[] = []>({
    errorOptions,
    loadingFallback,
    repository,
    props,
    repositoryArguments,
}: SuspenseComponentComponentProps<TProps, TReturn, TArgs>) => {
    const Cmp = useMemo(() => componentFactory<TProps, TReturn, TArgs>(repository), []);
    const errorBoundaryProps: ErrorBoundaryProps = (errorOptions ?? {}) as ErrorBoundaryProps;

    return (
        <ErrorBoundary {...errorBoundaryProps}>
            <Suspense fallback={loadingFallback ?? <div>loading</div>}>
                <Cmp 
                    props={props}
                    repositoryArguments={repositoryArguments}
                />
            </Suspense>
        </ErrorBoundary>
    )
}

const SuspenseData = <TProps extends Record<string, unknown>, TReturn, TArgs extends unknown[] = []>({
    errorOptions,
    loadingFallback,
    repository,
    repositoryArguments,
    layoutComponent,
}: SuspenseComponentDataProps<TReturn, TArgs>) => {
    // const Cmp = useMemo(() => dataFactory<TProps, TReturn, TArgs>(repository), []);
    const Cmp = dataFactory<TProps, TReturn, TArgs>(repository);
    const errorBoundaryProps: ErrorBoundaryProps = (errorOptions ?? {}) as ErrorBoundaryProps;

    return (
        <ErrorBoundary {...errorBoundaryProps}>
            <Suspense fallback={loadingFallback ?? <div>loading</div>}>
                <Cmp
                    layoutComponent={layoutComponent}
                    repositoryArguments={repositoryArguments}
                />
            </Suspense>
        </ErrorBoundary>
    )
}

export const SuspenseComponent = <TProps extends Record<string, unknown>, TReturn, TArgs extends unknown[] = []>(
    props: SuspenseComponentProps<TProps, TReturn, TArgs>
) => isComponent(props) ? <SuspenseComponentComponent {...props} /> : <SuspenseData {...props} />;
