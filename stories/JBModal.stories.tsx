import { Fragment, useEffect, useRef, useState } from 'react';
import { JBModal } from 'jb-modal/react';
import type { JBModalEventType, JBModalWebComponent } from 'jb-modal';
import { JBButton } from 'jb-button/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { faker } from '@faker-js/faker';
import { expect, userEvent, waitFor } from 'storybook/test';
import "./styles/styles.css";
import {JBCheckbox} from 'jb-checkbox/react'
import {
  getBackground,
  getContentBox,
  getContentWrapper,
  getJBButton,
  getJBButtonNativeButton,
  getModal,
} from './test-utils';

const meta = {
  title: "Components/JBModal",
  component: JBModal,
  decorators: [(Story) => <div className='jb-modal-sample-background'><Story /></div>],
} satisfies Meta<typeof JBModal>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    isOpen: true,
    children: <div >Hello World</div>,
  }
};
export const WithHeaderAndFooter: Story = {
  render: () => {
    return (
      <JBModal isOpen={true}>
        <div slot="content">Here we put content of the modal, mostly we put some information here to show to the user</div>
        <div slot="header"><div>Title of Header</div> <div>X</div></div>
        <div slot="footer"><JBButton color='light'>Cancel</JBButton><JBButton>Submit</JBButton></div>
      </JBModal>
    )
  }
};

const longString = "Test Long String ".repeat(200);
export const WithLargeContent: Story = {
  args: {
    isOpen: true,
    children: <div className='modal-test-content'>{longString}</div>,
  },
  play: async ({ canvasElement }) => {
    const modal = getModal(canvasElement);
    const contentBox = getContentBox(modal);

    await waitFor(() => {
      const boxRect = contentBox.getBoundingClientRect();
      expect(modal.isOpen).toBe(true);
      expect(boxRect.width).toBeLessThanOrEqual(window.innerWidth);
      expect(boxRect.left).toBeGreaterThanOrEqual(0);
      expect(boxRect.right).toBeLessThanOrEqual(window.innerWidth);
    });
  }
};
const users = faker.helpers.multiple(() => ({ name: faker.person.fullName() }), { count: 500 });
export const WithOverflowY: Story = {
  args: {
    isOpen: true,
    children: <Fragment>
      <div slot="header">Header</div>
      <div slot="footer" style={{justifyContent:"start"}}><JBCheckbox label="I Read and Accept All People on the list"></JBCheckbox></div>
      <div slot='content'>
        {
          users.map((u) => {
            return (<div key={u.name}>{u.name}</div>)
          })
        }
      </div>
    </Fragment>
  },
  play: async ({ canvasElement }) => {
    const modal = getModal(canvasElement);
    const contentBox = getContentBox(modal);

    await waitFor(() => {
      const boxRect = contentBox.getBoundingClientRect();
      expect(modal.isOpen).toBe(true);
      expect(boxRect.height).toBeLessThanOrEqual(window.innerHeight);
      expect(boxRect.top).toBeGreaterThanOrEqual(0);
      expect(boxRect.bottom).toBeLessThanOrEqual(window.innerHeight);
      expect(getComputedStyle(contentBox).maxHeight).not.toBe('none');
    });
  }
};


export const ActionTest: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <div className='button-wrapper'>
          <JBButton color='light' onClick={() => setIsOpen(true)}>Open Modal</JBButton>
          <JBModal isOpen={isOpen} onClose={() => { setIsOpen(false); }}>
            <div className='modal-test-content'>Hello World</div>
          </JBModal>
        </div>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const modal = getModal(canvasElement);
    const openButton = getJBButton(canvasElement, 'Open Modal');

    expect(modal.isOpen).toBe(false);

    await userEvent.click(getJBButtonNativeButton(openButton));

    await waitFor(() => {
      expect(modal.isOpen).toBe(true);
      expect(getComputedStyle(modal).display).toBe('block');
      expect(canvasElement).toHaveTextContent('Hello World');
    });
  }
};

export const DesktopEnterAnimation: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className='button-wrapper'>
        <JBButton color='light' onClick={() => setIsOpen(true)}>Open enter animated modal</JBButton>
        <JBModal
          className='desktop-enter-animation-modal'
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <div slot="header">
            <span>Enter animation</span>
          </div>
          <div slot="content" className='starting-style-demo-content'>
            This example only animates the modal while it opens.
          </div>
          <div slot="footer">
            <JBButton color='light' onClick={() => setIsOpen(false)}>Close</JBButton>
          </div>
        </JBModal>
      </div>
    )
  },
  parameters: {
    viewport: {
      defaultViewport: 'responsive',
    },
  },
  play: async ({ canvasElement }) => {
    const modal = getModal(canvasElement);
    const openButton = getJBButton(canvasElement, 'Open enter animated modal');
    const contentBox = getContentBox(modal);

    await userEvent.click(getJBButtonNativeButton(openButton));

    await waitFor(() => {
      expect(modal.isOpen).toBe(true);
      expect(contentBox.getBoundingClientRect().width).toBeGreaterThan(0);
      expect(canvasElement).toHaveTextContent('This example only animates the modal while it opens.');
    });
  },
};

export const DesktopAnimation: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className='button-wrapper'>
        <JBButton color='light' onClick={() => setIsOpen(true)}>Open animated modal</JBButton>
        <JBModal
          className='desktop-starting-style-modal'
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <div slot="header">
            <span>Desktop animation</span>
          </div>
          <div slot="content" className='starting-style-demo-content'>
            This story uses CSS <code>@starting-style</code> with the modal shadow parts to animate
            the backdrop and content box as soon as the modal enters the open state on desktop.
          </div>
          <div slot="footer">
            <JBButton color='light' onClick={() => setIsOpen(false)}>Close</JBButton>
            <JBButton onClick={() => setIsOpen(false)}>Done</JBButton>
          </div>
        </JBModal>
      </div>
    )
  },
  parameters: {
    viewport: {
      defaultViewport: 'responsive',
    },
  },
  play: async ({ canvasElement }) => {
    const modal = getModal(canvasElement);
    const openButton = getJBButton(canvasElement, 'Open animated modal');
    const doneButton = getJBButton(canvasElement, 'Done');

    await userEvent.click(getJBButtonNativeButton(openButton));

    await waitFor(() => {
      expect(modal.isOpen).toBe(true);
    });

    await userEvent.click(getJBButtonNativeButton(doneButton));

    await waitFor(() => {
      expect(modal.isOpen).toBe(false);
    });
  },
};

export const MobileView: Story = {
  args: {
    isOpen: true,
    children: <div className='modal-test-content'>Mobile View</div>
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile2', // Set default to mobile viewport
    },
  },
  play: async ({ canvasElement }) => {
    const modal = getModal(canvasElement);
    const contentWrapper = getContentWrapper(modal);
    const contentBox = getContentBox(modal);

    await waitFor(() => {
      const wrapperStyle = getComputedStyle(contentWrapper);
      const boxRect = contentBox.getBoundingClientRect();
      expect(modal.isOpen).toBe(true);
      expect(wrapperStyle.alignItems).toBe('flex-end');
      expect(Math.abs(boxRect.bottom - window.innerHeight)).toBeLessThanOrEqual(2);
      expect(boxRect.width).toBeLessThanOrEqual(window.innerWidth);
    });
  }
}
export const CloseDetail: Story = {
  render: (story) => {
    const [isOpen, setIsOpen] = useState(false);
    const onModalClose = (e: JBModalEventType<CustomEvent<any>>) => {
      console.log("modal close event type:", e.detail.eventType);
      setIsOpen(false);
    }
    return (
      <div className='button-wrapper'>
        <JBButton color='light' onClick={(e) => setIsOpen(true)}>Open Modal</JBButton>
        <JBModal isOpen={isOpen} onClose={onModalClose} onUrlOpen={() => setIsOpen(true)} id="MyModal">
          <div className='modal-test-content' style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <div>
              `onClose` event of the modal called for 2 reason:
              <ul>
                <li>when user click on modal background</li>
                <li>when user hit back button in android or back button of the browser</li>
              </ul>
            </div>
            <p>to simulate the first one you just have to click on modal background and you can see developer tools console that shows `BACKGROUND_CLICK`</p>
            <p>to experience the second scenario with back button since we are in storybook and storybook load stories in a `iframe` tag you should open story in <a rel="noopener" target='_blank' href='./iframe.html?globals=&id=components-jbmodal--close-detail&viewMode=story'>isolated mode</a> then hit back button</p>
            <q>back button scenario only works if your modal has an `id` attribute</q>
            <JBButton onClick={() => { setIsOpen(false); }}>Close Modal</JBButton>
          </div>
        </JBModal>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const modal = getModal(canvasElement);
    const openButton = getJBButton(canvasElement, 'Open Modal');
    const background = getBackground(modal);
    let closeEventType = '';

    modal.addEventListener('close', (event) => {
      closeEventType = (event as JBModalEventType<CustomEvent>).detail.eventType;
    });

    await userEvent.click(getJBButtonNativeButton(openButton));

    await waitFor(() => {
      expect(modal.isOpen).toBe(true);
    });

    await userEvent.click(background);

    await waitFor(() => {
      expect(closeEventType).toBe('BACKGROUND_CLICK');
      expect(modal.isOpen).toBe(false);
    });
  }
};

export const HashIdAndAutoClose: Story = {
  render: () => {
    const modalRef = useRef<JBModalWebComponent>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [autoClose, setAutoClose] = useState(true);
    const [lastEvent, setLastEvent] = useState("No close event yet");
    const [currentHash, setCurrentHash] = useState(window.location.hash || "(empty)");
    const modalId = "HashLinkedModal";

    useEffect(() => {
      if (modalRef.current) {
        modalRef.current.config.autoCloseOnBackgroundClick = autoClose;
      }
    }, [autoClose]);

    const onModalClose = (e: JBModalEventType<CustomEvent>) => {
      const eventType = e.detail.eventType;
      setLastEvent(eventType);
      window.setTimeout(() => setCurrentHash(window.location.hash || "(empty)"));
      if (autoClose) {
        setIsOpen(false);
      }
    };

    const openModal = () => {
      setIsOpen(true);
      window.setTimeout(() => setCurrentHash(window.location.hash || "(empty)"));
    };

    return (
      <div className='button-wrapper' style={{ alignItems: 'flex-start' }}>
        <JBButton color='light' onClick={openModal}>Open modal and push #HashLinkedModal</JBButton>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={autoClose}
            onChange={(event) => setAutoClose(event.currentTarget.checked)}
          />
          autoCloseOnBackgroundClick
        </label>
        <a href={`./iframe.html?globals=&id=components-jbmodal--hash-id-and-auto-close&viewMode=story#${modalId}`} target="_blank" rel="noopener">Open isolated story with #HashLinkedModal</a>
        <div>Current hash: {currentHash}</div>
        <div>Last close event: {lastEvent}</div>
        <JBModal
          ref={modalRef}
          id={modalId}
          isOpen={isOpen}
          onUrlOpen={() => setIsOpen(true)}
          onClose={onModalClose}
        >
          <div className='modal-test-content' style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <h3>Hash linked modal</h3>
            <p>Opening this modal writes <code>#HashLinkedModal</code> to the URL.</p>
            <p>Click the backdrop or press browser back to see the close event detail.</p>
            <p>When auto close is enabled, the demo also synchronizes React state back to closed.</p>
            <JBButton onClick={() => setIsOpen(false)}>Close modal</JBButton>
          </div>
        </JBModal>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const originalUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const urlWithoutHash = `${window.location.pathname}${window.location.search}`;
    const originalHistoryGo = window.history.go.bind(window.history);
    const modal = getModal(canvasElement);
    const openButton = getJBButton(canvasElement, 'Open modal and push #HashLinkedModal');
    const background = getBackground(modal);

    try {
      window.history.go = (() => {
        window.history.replaceState({}, '', urlWithoutHash);
      }) as typeof window.history.go;

      await userEvent.click(getJBButtonNativeButton(openButton));

      await waitFor(() => {
        expect(modal.isOpen).toBe(true);
        expect(window.location.hash).toBe('#HashLinkedModal');
        expect(canvasElement).toHaveTextContent('Current hash: #HashLinkedModal');
      });

      await userEvent.click(background);

      await waitFor(() => {
        expect(modal.isOpen).toBe(false);
        expect(canvasElement).toHaveTextContent('Last close event: BACKGROUND_CLICK');
      });
    } finally {
      window.history.go = originalHistoryGo;
      window.history.replaceState({}, '', originalUrl);
    }
  }
};

export const CustomizedUi: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <h3>JBModal With a Little customization</h3>
        <div className='button-wrapper'>
          <JBButton color='light' onClick={() => setIsOpen(true)}>Open Modal</JBButton>
          <JBModal className='customized-look-modal' isOpen={isOpen} onClose={() => { setIsOpen(false); }}>
            <div className='modal-test-content'>Hello World</div>
          </JBModal>
        </div>
      </div>
    )
  }
};
