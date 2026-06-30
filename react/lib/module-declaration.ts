import type { JBModalWebComponent } from 'jb-modal';

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'jb-modal': JBModalType;
    }
    interface JBModalType extends React.DetailedHTMLProps<React.HTMLAttributes<JBModalWebComponent>, JBModalWebComponent> {
    }
  }
}
