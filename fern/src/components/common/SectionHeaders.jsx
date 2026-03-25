import shared from './SharedComponents.module.css';

export const SectionTitle = ({ mainText, dimText, customId }) => (
  <h2 className={shared.sectionTitle} id={customId}>
    {mainText} <span className={shared.dimText}>{dimText}</span>
  </h2>
);

// We removed ghostLink and primaryLink. It only needs the text now!
export const ActionButtons = ({ ghostText, primaryText }) => {
  
  // A dedicated, foolproof function that ONLY goes to the FAQ
  const scrollToFAQ = (e) => {
    e.preventDefault(); // Stops the URL from changing
    
    const element = document.getElementById('faq');
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      alert("Uh oh! I couldn't find the FAQ section. Make sure id='faq' is on the page!");
    }
  };

  return (
    <div className={shared.actionRow}>
      {/* Button 1: Always goes to FAQ */}
      <a 
        href="#faq" 
        className={shared.ghostBtn}
        onClick={scrollToFAQ}
      >
        {ghostText}
      </a>
      
      {/* Button 2: Always goes to FAQ */}
      <a 
        href="https://cal.com/ferrn-agency/discovery-call" 
        className={shared.primaryBtn}
        // onClick={scrollToFAQ}
      >
        {primaryText}
      </a>
    </div>
  );
};