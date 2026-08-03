import { Button as MovingBorderButton } from '@/components/ui/moving-border';

/**
 * CTA principale con il bordo che scorre lungo il perimetro. Sempre bianco,
 * movimento lento: deve accorgersene chi guarda, non chi viene distratto.
 */
interface Props {
  href: string;
  children: React.ReactNode;
  durata?: number;
}

export default function BottoneBordo({ href, children, durata = 4200 }: Props) {
  return (
    <MovingBorderButton
      as="a"
      href={href}
      duration={durata}
      borderRadius="999px"
      containerClassName="h-[54px] w-auto min-w-[210px] text-base"
      borderClassName="h-16 w-16 bg-[radial-gradient(#FAFAFA_40%,transparent_60%)] opacity-90"
      className="gap-3 px-7 text-[14px] font-medium tracking-[0.01em] no-underline"
    >
      {children}
      <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path
          d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </MovingBorderButton>
  );
}
