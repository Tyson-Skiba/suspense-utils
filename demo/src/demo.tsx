import React, { useState, useRef, Suspense } from 'react';
import { Input, InputWrapper, Item, Loading, Panel, ScrollRestriction } from './components/input';
import { useOnClickOutside } from './components/use-on-click-outside';
import { repository } from './repository';

interface DataProps {
    searchTerm: string;
}

const Data: React.FC<DataProps> = ({ searchTerm }) => {
    const { entries } = repository.read(searchTerm);

    return (
        <Panel>
            <ScrollRestriction>
                {
                    entries.map(result => (
                        <Item key={result.API}>
                            { result.API }
                        </Item>
                    ))
                }
            </ScrollRestriction>
        </Panel>
    )
}

export const Example: React.FC = () => {
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
                    <Suspense fallback={<Panel><Loading>Loading</Loading></Panel>}>
                        <Data searchTerm={value} />
                    </Suspense>
                )
            }
        </InputWrapper>
    )
}
