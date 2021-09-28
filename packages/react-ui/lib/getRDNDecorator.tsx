import React from 'react';

import { Nullable } from '../typings/utility-types';

import { getRootDomNode } from './getRootDomNode';

export function getRDN<T extends new (...args: any[]) => React.Component>(Comp: T) {
  const getRDNDecorator = class extends Comp {
    public rootDomNode: any;
    public constructor(...args: any[]) {
      super(args[0]);
    }

    public render(): JSX.Element {
      return <RefWrapper ref={this.refRootDomNode}>{super.render()}</RefWrapper>;
    }

    public refRootDomNode = (e: Nullable<React.ReactNode>) => {
      console.log(e);
      this.rootDomNode = getRootDomNode(e);
      console.log(this.rootDomNode);
    };

    public getRootDomNode = () => {
      return this.rootDomNode;
    };
  };

  const nameDescriptor = Object.getOwnPropertyDescriptor(getRDNDecorator, 'name');
  if (!nameDescriptor || nameDescriptor.configurable) {
    Object.defineProperty(getRDNDecorator, 'name', { value: Comp.name });
    return getRDNDecorator;
  }
}

export class RefWrapper extends React.Component<{}, {}> {
  private rootDomNode: any;

  public render() {
    const child = this.props.children;
    let clonedChildWithRef: Nullable<React.ReactNode> = null;
    if (child) {
      clonedChildWithRef = React.cloneElement(child as JSX.Element, {
        ref: (element: Nullable<React.ReactNode>) => {
          this.refRootDomNode(element);
          if (child && (child as any).ref && typeof (child as any).ref === 'function') {
            (child as any).ref(element);
          }
        },
      });
    }
    return clonedChildWithRef;
  }

  private refRootDomNode = (e: any) => {
    this.rootDomNode = getRootDomNode(e);
  };

  public getRootDomNode = () => {
    return this.rootDomNode;
  };
}
