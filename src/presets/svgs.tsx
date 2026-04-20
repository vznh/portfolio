const MailClosed = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1 4 L14 4 L14 12 C14 12.276 13.776 12.5 13.5 12.5 L1.5 12.5 C1.224 12.5 1 12.276 1 12 Z"
      fill="currentColor"
    />
    <path
      d="M1 4 L7.5 8.5 L14 4"
      stroke="#F8FBF8"
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
      d="M7.5 11C4.80285 11 2.52952 9.62184 1.09622 7.50001C2.52952 5.37816 4.80285 4 7.5 4C10.1971 4 12.4705 5.37816 13.9038 7.50001C12.4705 9.62183 10.1971 11 7.5 11ZM7.5 3C4.30786 3 1.65639 4.70638 0.0760002 7.23501C-0.0253338 7.39715 -0.0253334 7.60288 0.0760014 7.76501C1.65639 10.2936 4.30786 12 7.5 12C10.6921 12 13.3436 10.2936 14.924 7.76501C15.0253 7.60288 15.0253 7.39715 14.924 7.23501C13.3436 4.70638 10.6921 3 7.5 3ZM7.5 11C9.433 11 11 9.433 11 7.5C11 5.567 9.433 4 7.5 4C5.567 4 4 5.567 4 7.5C4 9.433 5.567 11 7.5 11Z"
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
    <line x1="3.3" y1="9.2" x2="2.6" y2="10.2" stroke="currentColor" strokeWidth="0.4" strokeLinecap="round" opacity="0.7" />
    <line x1="5.3" y1="10.1" x2="5" y2="11.2" stroke="currentColor" strokeWidth="0.4" strokeLinecap="round" opacity="0.7" />
    <line x1="7.5" y1="10.4" x2="7.5" y2="11.5" stroke="currentColor" strokeWidth="0.4" strokeLinecap="round" opacity="0.7" />
    <line x1="9.7" y1="10.1" x2="10" y2="11.2" stroke="currentColor" strokeWidth="0.4" strokeLinecap="round" opacity="0.7" />
    <line x1="11.7" y1="9.2" x2="12.4" y2="10.2" stroke="currentColor" strokeWidth="0.4" strokeLinecap="round" opacity="0.7" />
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
