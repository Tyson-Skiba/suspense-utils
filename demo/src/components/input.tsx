import styled from 'styled-components/macro';

interface IsActive {
    isActive?: boolean;
}

export const Panel = styled.div`
    top: 100%;
    background-color: rgb(255, 255, 255);
    border-radius: 4px;
    box-shadow: rgb(0 0 0 / 10%) 0px 0px 0px 1px, rgb(0 0 0 / 10%) 0px 4px 11px;
    margin-bottom: 8px;
    margin-top: 8px;
    position: absolute;
    width: 100%;
    z-index: 1;
    box-sizing: border-box;
`;

export const ScrollRestriction = styled.div`
    max-height: 300px;
    overflow-y: auto;
    padding-bottom: 4px;
    padding-top: 4px;
    position: relative;
    box-sizing: border-box;
`;

export const Item = styled.div`
    background-color: transparent;
    cursor: default;
    display: block;
    padding: 0.5rem 0.75rem;
    width: 100%;
    user-select: none;
    box-sizing: border-box;

    &:hover {
        background: aliceblue;
    }
`;

export const InputWrapper = styled.div<IsActive>`
    align-items: center;
    border-color: ${ ({ isActive }) => isActive ? 'rgb(38, 132, 255)' : '#444444' };
    border-radius: 4px;
    border-style: solid;
    border-width: 1px;
    box-shadow: ${ ({ isActive }) => isActive ? 'rgb(38 132 255) 0px 0px 0px 1px' : 'rgb(60 60 60) 0px 0px 0px 1px' };
    cursor: default;
    display: flex;
    flex-wrap: wrap;
    -webkit-box-pack: justify;
    justify-content: space-between;
    min-height: 2.375rem;
    position: relative;
    transition: all 100ms ease 0s;
    box-sizing: border-box;
    outline: 0px !important;
    margin: 2rem;
`;

export const Input = styled.input`
    outline: 0;
    border: 0;
    line-height: 2rem;
    margin-left: 0.5rem;
    width: 100%;
`;

export const Loading = styled.div`
    padding: 1rem;
`;
