import React from 'react';

import { Nullable } from '../typings/utility-types';

import { getRootDomNode } from './getRootDomNode';

export function getRDN<T extends new (...args: any[]) => React.Component>(Component: T) {
  const getRDNDecorator = class extends Component {
    public rootDomNode: Nullable<HTMLElement>;
    public constructor(...args: any[]) {
      super(args[0]);
    }

    public render(): JSX.Element {
      return <Component {...this.props} rootRef={this.refRootDomNode}/>
    }

    public refRootDomNode = (e: Nullable<React.ReactNode>) => {
      this.rootDomNode = getRootDomNode(e);
    };

    public getRootDomNode = () => {
      return this.rootDomNode;
    };
  };

  const nameDescriptor = Object.getOwnPropertyDescriptor(getRDNDecorator, 'name');
  if (!nameDescriptor || nameDescriptor.configurable) {
    Object.defineProperty(getRDNDecorator, 'name', { value: Component.name });
    return getRDNDecorator;
  }
}

// export class RefWrapper extends React.Component<{}, {}> {
//   private rootDomNode: any;
//
//   public render() {
//     const child = this.props.children;
//     let clonedChildWithRef: Nullable<React.ReactNode> = null;
//     if (child) {
//       clonedChildWithRef = React.cloneElement(child as JSX.Element, {
//         ref: (element: Nullable<React.ReactNode>) => {
//           this.refRootDomNode(element);
//           if (child && (child as any).ref && typeof (child as any).ref === 'function') {
//             (child as any).ref(element);
//           }
//         },
//       });
//     }
//     return clonedChildWithRef;
//   }
//
//   private refRootDomNode = (e: any) => {
//     this.rootDomNode = getRootDomNode(e);
//   };
//
//   public getRootDomNode = () => {
//     return this.rootDomNode;
//   };
// }
