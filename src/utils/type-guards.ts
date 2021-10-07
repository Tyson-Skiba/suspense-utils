/*
const isClassComponent = (component: any) => (
    typeof component === 'function' && 
    !!component.prototype.isReactComponent
)

const isFunctionComponent = (component: any) => (
    typeof component === 'function' && 
    String(component).includes('return React.createElement')
)

const isReactComponent = (component: any) => isClassComponent(component) || isFunctionComponent(component);
*/

import React, { isValidElement } from 'react';

export const isReactElement = <T extends Record<string, unknown>>(obj: any | React.ComponentType<T>): obj is React.ComponentType<T> => 
  isValidElement(obj);

