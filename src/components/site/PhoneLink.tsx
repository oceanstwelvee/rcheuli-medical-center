import { CLINIC } from "@/lib/constants";

export function PhoneLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {CLINIC.phones.map((phone) => (
        <a
          key={phone.tel}
          href={`tel:${phone.tel}`}
          className="text-lg font-semibold tracking-tight text-foreground hover:text-brand-red transition-colors"
        >
          {phone.display}
        </a>
      ))}
    </div>
  );
}

export function PrimaryCallButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={`tel:${CLINIC.phones[0].tel}`}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-brand-red px-6 py-3 font-semibold text-white shadow-sm shadow-brand-red/30 transition-transform hover:scale-[1.03] hover:bg-brand-red-dark ${className}`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
      {CLINIC.phones[0].display}
    </a>
  );
}
