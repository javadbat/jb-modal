import { useEvent } from "jb-core/react";
import { RefObject } from "react";
import type {JBModalWebComponent, JBModalEventType} from 'jb-modal';

export type EventProps = {
  /**
   * when component loaded, in most cases component is already loaded before react mount so you dont need this but if you load web-component dynamically with lazy load it will be called after react mount
   */
  onLoad?: (e: JBModalEventType<CustomEvent>) => void,
    /**
   * when all property set and ready to use, in most cases component is already loaded before react mount so you dont need this but if you load web-component dynamically with lazy load it will be called after react mount
   */
  onInit?: (e: JBModalEventType<CustomEvent>) => void,
  onClose?: (e: JBModalEventType<CustomEvent>) => void,
  /**
   * when modal opened automatically by url hash (when element have id and url has #id) use this to update open state in parent component
   */
  onUrlOpen?: (e: JBModalEventType<CustomEvent>) => void,
}
export function useEvents(element:RefObject<JBModalWebComponent>,props:EventProps){
  useEvent(element, 'load', props.onLoad, true);
  useEvent(element, 'init', props.onInit, true);
  useEvent(element, 'close', props.onClose);
  useEvent(element, 'urlOpen', props.onUrlOpen);
}