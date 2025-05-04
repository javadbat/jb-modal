import React from 'react';
import {JBModal, Props} from 'jb-modal/react';
import NormalP from './samples/Normal';
import type { Meta, StoryObj } from '@storybook/react';


const meta: Meta<Props> = {
  title: "Components/JBModal",
  component: JBModal,
};
export default meta;
type Story = StoryObj<typeof JBModal>;

export const Normal:Story = {
  args:{
    isOpen:true,
  }
};

export const ActionTest:Story = {
  render:() => <NormalP></NormalP>
};

