'use client';
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import 'jb-modal';
// eslint-disable-next-line no-duplicate-imports
import type { JBModalWebComponent } from 'jb-modal';
import { useEvents, type EventProps } from './events-hook.js';
import type { JBElementStandardProps } from 'jb-core/react';
import './module-declaration.js';

export const JBModal = React.forwardRef((props: Props, ref) => {
  const element = useRef<JBModalWebComponent>(null);

  useImperativeHandle(
    ref,
    () => (element ? element.current : undefined),
    [element],
  );
  //id is in other props
  const { isOpen, onClose, onInit, onLoad, onUrlOpen, ...otherProps } = props;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <we need to react to ref>
  useEffect(() => {

    if (isOpen == true) {
      element.current?.open();
    } else {
      element.current?.close();
    }
  }, [isOpen, element.current]);

  useEvents(element, { onClose, onInit, onLoad, onUrlOpen });
  return (
    <jb-modal ref={element} {...otherProps}>
      {props.children}
    </jb-modal>
  );
});

type ModalProps = EventProps & React.PropsWithChildren<{
  isOpen?: boolean,
}>
export type Props = ModalProps & JBElementStandardProps<JBModalWebComponent, keyof ModalProps>

JBModal.displayName = "JBModal";
