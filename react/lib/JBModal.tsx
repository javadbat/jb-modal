import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import 'jb-modal';
// eslint-disable-next-line no-duplicate-imports
import { JBModalWebComponent } from 'jb-modal';
import { useEvents, EventProps } from './events-hook.js';
export type JBModalProps = EventProps & React.PropsWithChildren<{
    className?:string,
    isOpen?: boolean,
    id?: string,
}>

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
      interface IntrinsicElements {
        'jb-modal': JBModalType;
      }
      interface JBModalType extends React.DetailedHTMLProps<React.HTMLAttributes<JBModalWebComponent>, JBModalWebComponent> {
        class?:string,
      }
    }
}

const JBModal = React.forwardRef((props:JBModalProps, ref) => {
  const element = useRef<JBModalWebComponent>(null);
  const [refChangeCount, refChangeCountSetter] = useState(0);
  useImperativeHandle(
    ref,
    () => (element ? element.current : {}),
    [element],
  );
  useEffect(() => {
    refChangeCountSetter(refChangeCount + 1);
  }, [element.current]);
  useEffect(() => {
    if (element.current) {
      if (props.isOpen == true) {
        element.current.open();
      } else {
        element.current.close();
      }
    }

  }, [props.isOpen]);
  useEffect(() => {
    if (element.current) {
      element.current.id = props.id;
    }
  }, [props.id]);

  useEvents(element, props);
  return (
    <jb-modal ref={element} class={props.className ? props.className : ''}>
      <div slot="content">
        {props.children}
      </div>
    </jb-modal>
  );
});

JBModal.displayName = "JBModal";
export {JBModal};
