"use client";
import React, { useEffect, useImperativeHandle, useRef } from "react";
import "jb-modal";
// eslint-disable-next-line no-duplicate-imports
import type { JBModalWebComponent } from "jb-modal";
import { useEvents, type EventProps } from "./events-hook.js";
import type { JBElementStandardProps } from "jb-core/react";
import "./module-declaration.js";

export const JBModal = React.forwardRef((props: Props, ref) => {
  const element = useRef<JBModalWebComponent>(null);

  useImperativeHandle(ref, () => element.current ?? undefined, []);
  //id is in other props
  const {
    isOpen,
    autoCloseOnBackgroundClick,
    autoCloseOnEscape,
    onClose,
    onInit,
    onLoad,
    onUrlOpen,
    ...otherProps
  } = props;

  useEffect(() => {
    if (element.current) {
      element.current.autoCloseOnBackgroundClick = autoCloseOnBackgroundClick ?? false;
    }
  }, [autoCloseOnBackgroundClick]);

  useEffect(() => {
    if (element.current) {
      element.current.autoCloseOnEscape = autoCloseOnEscape ?? true;
    }
  }, [autoCloseOnEscape]);

  useEffect(() => {
    if (isOpen == true) {
      element.current?.open();
    } else if(element.current?.isOpen) {
      element.current?.close();
    }
  }, [isOpen]);

  useEvents(element, { onClose, onInit, onLoad, onUrlOpen });
  return (
    <jb-modal ref={element} {...otherProps}>
      {props.children}
    </jb-modal>
  );
});

type ModalProps = EventProps &
  React.PropsWithChildren<{
    isOpen?: boolean;
    /** Automatically close after an uncanceled backdrop close request. Defaults to false. */
    autoCloseOnBackgroundClick?: boolean;
    /** Automatically close after an uncanceled Escape close request. Defaults to true. */
    autoCloseOnEscape?: boolean;
    /** Accessible name announced for the modal dialog. */
    label?: string;
    /** Additional accessible description announced for the modal dialog. */
    description?: string;
  }>;
export type Props = ModalProps & JBElementStandardProps<JBModalWebComponent, keyof ModalProps>;

JBModal.displayName = "JBModal";
