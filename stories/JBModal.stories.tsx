import React, { Fragment, useEffect, useRef, useState } from 'react';
import { JBModal } from 'jb-modal/react';
import type { JBModalEventType, JBModalWebComponent } from 'jb-modal';
import { JBButton } from 'jb-button/react';
import type { Meta, StoryObj } from '@storybook/react';
import { faker } from '@faker-js/faker';
import "./styles/styles.css";
import {JBCheckbox} from 'jb-checkbox/react'

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
            return (<div>{u.name}</div>)
          })
        }
      </div>
    </Fragment>
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
  }
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
            <p>
              `onClose` event of the modal called for 2 reason:
              <ul>
                <li>when user click on modal background</li>
                <li>when user hit back button in android or back button of the browser</li>
              </ul>
            </p>
            <p>to simulate the first one you just have to click on modal background and you can see developer tools console that shows `BACKGROUND_CLICK`</p>
            <p>to experience the second scenario with back button since we are in storybook and storybook load stories in a `iframe` tag you should open story in <a rel="noopener" target='_blank' href='./iframe.html?globals=&id=components-jbmodal--close-detail&viewMode=story'>isolated mode</a> then hit back button</p>
            <q>back button scenario only works if your modal has an `id` attribute</q>
            <JBButton onClick={() => { setIsOpen(false); }}>Close Modal</JBButton>
          </div>
        </JBModal>
      </div>
    )
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
