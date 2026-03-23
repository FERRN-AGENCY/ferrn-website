import shared from './SharedComponents.module.css';

export const SectionTitle = ({ mainText, dimText, customId }) => (
  <h2 className={shared.sectionTitle} id={customId}>
    {mainText} <span className={shared.dimText}>{dimText}</span>
  </h2>
);

export const ActionButtons = ({ ghostText, ghostLink, primaryText, primaryLink }) => (
  <div className={shared.actionRow}>
    <a href={ghostLink} className={shared.ghostBtn}>
      {ghostText}
    </a>
    <a href={primaryLink} className={shared.primaryBtn}>
      {primaryText}
    </a>
  </div>
);