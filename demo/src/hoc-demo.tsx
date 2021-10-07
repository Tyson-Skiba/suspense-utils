import React, { useRef, useState } from 'react';
import { SuspenseComponent } from 'suspense-utils';
import { Input, InputWrapper, Item, Loading, Panel, ScrollRestriction } from './components/input';
import { useOnClickOutside } from './components/use-on-click-outside';
import { repository, Result } from './repository';

interface LayoutComponentProps {
    children: Result;
}

const LayoutComponent: React.FC<LayoutComponentProps> = ({
    children,
}) => (
    <Panel>
        <ScrollRestriction>
            {
                children.entries.map(result => (
                    <Item key={result.API}>
                        { result.API }
                    </Item>
                ))
            }
        </ScrollRestriction>
    </Panel>
)

export const HocDemo: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [isPanelOpen, setPanelOpen] = useState(false);
    const [value, setValue] = useState('');

    useOnClickOutside(ref, () => setPanelOpen(false));

    return (
        <InputWrapper
            isActive={isPanelOpen}
            ref={ref}
        >
            <Input
                value={value}
                onChange={event => setValue(event.target.value)}
                onFocus={() => setPanelOpen(true)}
            />
            {
                !isPanelOpen ? null : (
                    <SuspenseComponent
                        repository={repository}
                        repositoryArguments={[value]}
                        layoutComponent={LayoutComponent}
                        loadingFallback={<Panel><Loading>Loading</Loading></Panel>}
                    />
                )
            }
        </InputWrapper>
    )
}
