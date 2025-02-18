import type { JBModalWebComponent } from "./JBModal";
import type {EventTypeWithTarget} from 'jb-core';

export type ElementsObject = {
    componentWrapper: HTMLDivElement;
    background: HTMLDivElement;
};

export type JBModalEventType<TEvent> = EventTypeWithTarget<TEvent,JBModalWebComponent>