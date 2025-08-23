import React, { useState } from 'react';
import { JBModal, Props } from 'jb-modal/react';
import { type JBModalEventType } from 'jb-modal';
import { JBButton } from 'jb-button/react';
import type { Meta, StoryObj } from '@storybook/react';

import "./styles/styles.css";
import type { } from '../dist/jb-modal';

const meta: Meta<Props> = {
  title: "Components/JBModal",
  component: JBModal,
  decorators: [(Story) => <div className='jb-modal-sample-background'><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof JBModal>;

export const Normal: Story = {
  args: {
    isOpen: true,
    children: <div className='modal-test-content'>Hello World</div>,
  }
};

const longString = "Test Long String ".repeat(200);
export const WithLargeContent: Story = {
  args: {
    isOpen: true,
    children: <div className='modal-test-content'>{longString}</div>,
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

export const CloseDetail: Story = {
  render: (story) => {
    const [isOpen, setIsOpen] = useState(false);
    const onModalClose = (e: JBModalEventType<CustomEvent<any>>) => {
      console.log("modal close event type:",e.detail.eventType);
      setIsOpen(false);
    }
    return (
        <div className='button-wrapper'>
          <JBButton color='light' onClick={(e) => setIsOpen(true)}>Open Modal</JBButton>
          <JBModal isOpen={isOpen} onClose={onModalClose} onUrlOpen={()=>setIsOpen(true)} id="MyModal">
            <div className='modal-test-content' style={{ flexDirection: 'column', alignItems:'flex-start' }}>
              <p>
                `onClose` event of the modal called for 2 reason:
              <ul>
                <li>when user click on modal background</li>
                <li>when user hit back button in android or back button of the browser</li>
              </ul>
              </p>
              <p>to simulate the first one you just have to click on modal background and you can see developer tools console that shows `BACKGROUND_CLICK`</p>
              <p>to experience the second scenario with back button since we are in storybook and storybook load stories in a `iframe` tag you should open story in <a target='_blank' href='/iframe.html?globals=&id=components-jbmodal--close-detail&viewMode=story'>isolated mode</a> then hit back button</p>
              <q>back button scenario only works if your modal has an `id` attribute</q>
              <JBButton onClick={() => { setIsOpen(false); }}>Close Modal</JBButton>
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
