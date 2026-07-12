import React, { useState } from 'react';
import { JBButton } from 'jb-button/react';
import { JBModal } from 'jb-modal/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import '../../../docs/styles/ant-design.css';
import '../../../docs/styles/aurora.css';
import '../../../docs/styles/bootstrap.css';
import '../../../docs/styles/candy.css';
import '../../../docs/styles/carbon.css';
import '../../../docs/styles/cupertino.css';
import '../../../docs/styles/fluent.css';
import '../../../docs/styles/forest.css';
import '../../../docs/styles/material.css';
import '../../../docs/styles/porcelain.css';
import '../../../docs/styles/sunset.css';
import '../../../docs/styles/terminal.css';
import '../../jb-button/stories/styles/style-ant-design.css';
import '../../jb-button/stories/styles/style-aurora.css';
import '../../jb-button/stories/styles/style-bootstrap.css';
import '../../jb-button/stories/styles/style-candy.css';
import '../../jb-button/stories/styles/style-carbon.css';
import '../../jb-button/stories/styles/style-cupertino.css';
import '../../jb-button/stories/styles/style-fluent.css';
import '../../jb-button/stories/styles/style-forest.css';
import '../../jb-button/stories/styles/style-material.css';
import '../../jb-button/stories/styles/style-porcelain.css';
import '../../jb-button/stories/styles/style-sunset.css';
import '../../jb-button/stories/styles/style-terminal.css';
import './styles/style-preview.css';
import './styles/style-ant-design.css';
import './styles/style-aurora.css';
import './styles/style-bootstrap.css';
import './styles/style-candy.css';
import './styles/style-carbon.css';
import './styles/style-cupertino.css';
import './styles/style-fluent.css';
import './styles/style-forest.css';
import './styles/style-material.css';
import './styles/style-porcelain.css';
import './styles/style-sunset.css';
import './styles/style-terminal.css';

const meta = {
  title: "Components/JBModal/Style",
  component: JBModal,
} satisfies Meta<typeof JBModal>;

export default meta;
type Story = StoryObj<typeof meta>;

const styleSamples = [
  { name: "Carbon", className: "carbon-style carbon-style", buttonClassName: "carbon-style carbon-style" },
  { name: "Aurora", className: "aurora-style aurora-style", buttonClassName: "aurora-style aurora-style" },
  { name: "Forest", className: "forest-style forest-style", buttonClassName: "forest-style forest-style" },
  { name: "Sunset", className: "sunset-style sunset-style", buttonClassName: "sunset-style sunset-style" },
  { name: "Porcelain", className: "porcelain-style porcelain-style", buttonClassName: "porcelain-style porcelain-style" },
  { name: "Candy", className: "candy-style candy-style", buttonClassName: "candy-style candy-style" },
  { name: "Terminal", className: "terminal-style terminal-style", buttonClassName: "terminal-style terminal-style" },
  { name: "Material", className: "material-style material-style", buttonClassName: "material-style material-style" },
  { name: "Fluent", className: "fluent-style fluent-style", buttonClassName: "fluent-style fluent-style" },
  { name: "Bootstrap", className: "bootstrap-style bootstrap-style", buttonClassName: "bootstrap-style bootstrap-style" },
  { name: "Cupertino", className: "cupertino-style cupertino-style", buttonClassName: "cupertino-style cupertino-style" },
  { name: "Ant Design", className: "ant-design-style", buttonClassName: "ant-design-style" },
];

function ModalContent({ buttonClassName, compact = false, onClose }: { buttonClassName: string; compact?: boolean; onClose: () => void }) {
  return (
    <>
      <div slot="header">
        <span>Project settings</span>
        <JBButton className={buttonClassName} color="light" size="sm" variant="text" onClick={onClose}>x</JBButton>
      </div>
      <div slot="content">
        <div style={{ display: "grid", gap: compact ? "0.5rem" : "0.75rem" }}>
          <strong>Release window</strong>
          <span>Review deployment options, visibility, and owner approval before publishing.</span>
        </div>
      </div>
      <div slot="footer">
        <JBButton className={buttonClassName} color="secondary" size="sm" variant="outline" onClick={onClose}>Cancel</JBButton>
        <JBButton className={buttonClassName} size="sm" onClick={onClose}>Save</JBButton>
      </div>
    </>
  );
}

function ModalStyleSample({ buttonClassName, className }: { buttonClassName: string; className: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="modal-preview-shell">
      <JBButton className={`${buttonClassName} modal-trigger`} onClick={() => setIsOpen(true)}>Open modal</JBButton>
      <JBModal className={`${className} modal-preview`} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent buttonClassName={buttonClassName} compact onClose={() => setIsOpen(false)} />
      </JBModal>
    </div>
  );
}

export const Gallery: Story = {
  name: "Gallery",
  render: () => (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(21rem, 1fr))",
      gap: "1.25rem",
      alignItems: "start",
      width: "min(100%, 82rem)",
    }}>
      {styleSamples.map((sample) => (
        <section
          key={sample.className}
          style={{
            display: "grid",
            gap: "0.75rem",
            minWidth: 0,
            padding: "1rem",
            background: "var(--jb-surface, #ffffff)",
            border: "1px solid var(--jb-border-color, #e5e7eb)",
            borderRadius: "0.75rem",
            boxShadow: "0 0.75rem 1.75rem oklch(0% 0 0 / 0.08)",
          }}
          className={sample.className.split(" ")[0]}
        >
          <div style={{
            width: "100%",
            color: "var(--jb-text-primary, #334155)",
            fontSize: "0.875rem",
            fontWeight: 700,
            lineHeight: 1.4,
            textAlign: "center",
          }}>
            {sample.name}
          </div>
          <ModalStyleSample buttonClassName={sample.buttonClassName} className={sample.className} />
        </section>
      ))}
    </div>
  ),
};

function FullscreenModalStory({ buttonClassName, className }: { buttonClassName: string; className: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={className.split(" ")[0]} style={{ minHeight: "12rem", display: "grid", placeItems: "center" }}>
      <JBButton className={`${buttonClassName} modal-trigger`} onClick={() => setIsOpen(true)}>Open modal</JBButton>
      <JBModal className={className} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent buttonClassName={buttonClassName} onClose={() => setIsOpen(false)} />
      </JBModal>
    </div>
  );
}

export const Carbon: Story = {
  name: "Carbon",
  render: () => <FullscreenModalStory buttonClassName="carbon-style carbon-style" className="carbon-style carbon-style" />,
};

export const Aurora: Story = {
  name: "Aurora",
  render: () => <FullscreenModalStory buttonClassName="aurora-style aurora-style" className="aurora-style aurora-style" />,
};

export const Forest: Story = {
  name: "Forest",
  render: () => <FullscreenModalStory buttonClassName="forest-style forest-style" className="forest-style forest-style" />,
};

export const Sunset: Story = {
  name: "Sunset",
  render: () => <FullscreenModalStory buttonClassName="sunset-style sunset-style" className="sunset-style sunset-style" />,
};

export const Porcelain: Story = {
  name: "Porcelain",
  render: () => <FullscreenModalStory buttonClassName="porcelain-style porcelain-style" className="porcelain-style porcelain-style" />,
};

export const Candy: Story = {
  name: "Candy",
  render: () => <FullscreenModalStory buttonClassName="candy-style candy-style" className="candy-style candy-style" />,
};

export const Terminal: Story = {
  name: "Terminal",
  render: () => <FullscreenModalStory buttonClassName="terminal-style terminal-style" className="terminal-style terminal-style" />,
};

export const Material: Story = {
  name: "Material",
  render: () => <FullscreenModalStory buttonClassName="material-style material-style" className="material-style material-style" />,
};

export const Fluent: Story = {
  name: "Fluent",
  render: () => <FullscreenModalStory buttonClassName="fluent-style fluent-style" className="fluent-style fluent-style" />,
};

export const Bootstrap: Story = {
  name: "Bootstrap",
  render: () => <FullscreenModalStory buttonClassName="bootstrap-style bootstrap-style" className="bootstrap-style bootstrap-style" />,
};

export const Cupertino: Story = {
  name: "Cupertino",
  render: () => <FullscreenModalStory buttonClassName="cupertino-style cupertino-style" className="cupertino-style cupertino-style" />,
};

export const AntDesign: Story = {
  name: "Ant Design",
  render: () => <FullscreenModalStory buttonClassName="ant-design-style" className="ant-design-style" />,
};
