# Suspense Utils

[![Demo app](https://img.shields.io/badge/demo-app-ff69b4)](https://tyson-skiba.github.io/suspense-utils/) [![Bundle size](https://badgen.net/bundlephobia/min/suspense-utils)](suspense-utils) [![Support](https://img.shields.io/badge/react-%3E%3D16.3-brightgreen)](https://img.shields.io/badge/react-%3E%3D16.6-brightgreen) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

A small library with utils that make working suspense easy as well as an error boundary that can be used so that components can have error, loading and data states.

## Install

```shell
yarn add suspense-utils
```

## Suspense

Tools used to help with suspense itself

### Create Repository

This utility method is used to create a data loader that caches each request.

__This requires React 16.6+__

This is an example using a fetch request and a public api.

```typescript
import { createRepository } from 'suspense-utils';

const dataResolver = async (searchTerm: string) => {
    const response = await fetch(`https://api.publicapis.org/entries?title=${searchTerm}`);
    const data = await response.json();

    return data;
}

export const repository = createRepository(dataResolver);
```

Here is a second example that asynchronously loads an svg based on an enum value.

```typescript
import { createRepository } from 'suspense-utils';

export const repository = createRepository(async (sprite: SpriteType) => {
    let spritePromise: () => Promise<DynamicImportType>;

    switch (sprite) {
        case SpriteType.Sun:
            spritePromise = () => import('../svg/sun');
            break;
        case SpriteType.Thermo:
            spritePromise = () => import('../svg/thermo');
            break;
        case SpriteType.Wind:
            spritePromise = () => import('../svg/wind');
            break;
        case SpriteType.Rain:
            spritePromise = () => import('../svg/rain');
            break;
        default:
            throw new Error(`Missing implementation for ${sprite} in sprite repository`);
    }

    const resolvedModule = await spritePromise();
    return resolvedModule.default;
})
```

## HOC

This is a wrapper that aims to keep things simple by creating a component with a loading state and error state built in that can handle repositories.

__This requires React 16.8+__

```jsx
import { SuspenseComponent } from 'suspense-utils';
import { repository } from '../repositories';

const LayoutComponent: React.FC<LayoutComponentProps> = ({
    children: Sprite,
}) => (
    <Panel>
        <Sprite />
    </Panel>
)

export const MyComponent: React.FC = () => (
    <SuspenseComponent
        repository={repository}
        repositoryArguments={[SpriteType.Sun]}
        layoutComponent={LayoutComponent}
        loadingFallback={<div>loading</div>}
    />
)
```

## Suspend

This is a wrapper similar to redux connect that allows you to use suspense with existing components.

__This requires React 16.6+__

```jsx
import { suspend } from 'suspense-utils';

const MyComponentBase: React.FC = () => <div>Hi</div>;

export const MyComponent = suspend(MyComponentBase, {
    loadingFallback: <div>loading</div>
})
```

## Error

Error helpers

### Error Boundary

A simple error boundary wrapper.

__This requires React 16.6+__

```jsx
import { ErrorBoundary, ErrorBoundaryFallbackProps } from 'suspense-utils';
import { App } from '../';

/* Will show on error state */
const FallbackView: React.FC<ErrorBoundaryFallbackProps> = ({
    error,
    retry
}) => (
    <div>
        <h4>Oh no!</h4>
        <h5>Something went wrong</h5>
        <button onClick={retry}>Click to retry</button>
    </div>
)

export const MyComponent: React.FC = () => (
    <ErrorBoundary fallback={FallbackView}>
        <App />
    </ErrorBoundary>
)
```

Alternatively you can set the component to retry failure, every 3 seconds stopping after 5 attempts in the below example.

```jsx
import { ErrorBoundary, ErrorBoundaryFallbackProps } from 'suspense-utils';
import { App } from '../';

/* Will show on error state */
const FallbackView: React.FC = () => (
    <div>
        <h4>Oh no!</h4>
        <h5>Something went wrong</h5>
    </div>
)

export const MyComponent: React.FC = () => (
    <ErrorBoundary
        fallback={FallbackView}
        retryPolicy={{
            times: 5,
            intervalMs: 3000
        }}
    >
        <App />
    </ErrorBoundary>
)
```