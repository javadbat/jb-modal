import type { JBModalWebComponent } from "./jb-modal";
import type { EventTypeWithTarget } from "jb-core";

export type ElementsObject = {
  componentWrapper: HTMLDivElement;
  background: HTMLDivElement;
  content:{
    section:HTMLDivElement,
    wrapper:HTMLDivElement;
  }
  bottomSheetHandle:HTMLDivElement;
  headerSlot: HTMLSlotElement;
};

export type JBModalEventType<TEvent> = EventTypeWithTarget<TEvent, JBModalWebComponent>;

export type JBModalCloseEventType = "BACKGROUND_CLICK" | "HISTORY_BACK_EVENT" | "CLOSE_BUTTON_CLICK" | "ESCAPE_KEY" | "SWIPE_DOWN";

export type JBModalCloseEvent = CustomEvent<{
  eventType: JBModalCloseEventType;
}>;
