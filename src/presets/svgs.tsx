const MailClosed = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1 4 L14 4 L14 12 C14 12.276 13.776 12.5 13.5 12.5 L1.5 12.5 C1.224 12.5 1 12.276 1 12 Z"
      fill="currentColor"
    />
    <path
      d="M1 4 L7.5 8.5 L14 4"
      style={{ stroke: 'var(--bg-color)' }}
      strokeWidth="0.8"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

const MailOpen = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1 5 L7.5 1.2 L14 5"
      stroke="currentColor"
      strokeWidth="0.8"
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <path
      d="M0.5 5 L0.5 12 C0.5 12.276 0.724 12.5 1 12.5 L14 12.5 C14.276 12.5 14.5 12.276 14.5 12 L14.5 5 L7.5 10 Z"
      fill="currentColor"
    />
  </svg>
);

export const MailIcon = ({ open = false }: { open?: boolean } = {}) => (
  <span className="relative inline-block w-[15px] h-[15px]">
    <span
      className={`absolute inset-0 transition-opacity duration-200 ease-in-out ${
        open ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <MailClosed />
    </span>
    <span
      className={`absolute inset-0 transition-opacity duration-200 ease-in-out ${
        open ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <MailOpen />
    </span>
  </span>
);

const EyeOpen = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.5 11C4.8 11 2.53 9.62 1.1 7.5C2.53 5.38 4.8 4 7.5 4C10.2 4 12.47 5.38 13.9 7.5C12.47 9.62 10.2 11 7.5 11ZM7.5 3C4.31 3 1.66 4.71 0.08 7.24C-0.03 7.4 -0.03 7.6 0.08 7.77C1.66 10.29 4.31 12 7.5 12C10.69 12 13.34 10.29 14.92 7.77C15.03 7.6 15.03 7.4 14.92 7.24C13.34 4.71 10.69 3 7.5 3ZM7.5 11C9.43 11 11 9.43 11 7.5C11 5.57 9.43 4 7.5 4C5.57 4 4 5.57 4 7.5C4 9.43 5.57 11 7.5 11Z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
);

const EyeClosed = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0.5 7 C 3 10.5, 12 10.5, 14.5 7"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
      strokeLinecap="round"
    />
    <line x1="3.1" y1="9.2" x2="2.2" y2="10.6" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" opacity="0.95" />
    <line x1="5.3" y1="10.1" x2="4.9" y2="11.6" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" opacity="0.95" />
    <line x1="7.5" y1="10.4" x2="7.5" y2="12" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" opacity="0.95" />
    <line x1="9.7" y1="10.1" x2="10.1" y2="11.6" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" opacity="0.95" />
    <line x1="11.9" y1="9.2" x2="12.8" y2="10.6" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" opacity="0.95" />
  </svg>
);

export const EyeIcon = ({ closed = false }: { closed?: boolean } = {}) => (
  <span className="relative inline-block w-[15px] h-[15px]">
    <span
      className={`absolute inset-0 transition-opacity duration-200 ease-in-out ${
        closed ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <EyeOpen />
    </span>
    <span
      className={`absolute inset-0 transition-opacity duration-200 ease-in-out ${
        closed ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <EyeClosed />
    </span>
  </span>
);
