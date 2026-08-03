import { TracingBeam } from '@/components/ui/tracing-beam';

/**
 * Avvolge il contenuto di una pagina lunga con il Tracing Beam.
 * La larghezza massima dell'originale (max-w-4xl) qui non serve: il contenuto
 * ha già la sua griglia, la linea deve solo correre di fianco.
 */
export default function PaginaConBeam({ children }: { children: React.ReactNode }) {
  return (
    <TracingBeam className="max-w-none">
      {/* lo spazio a sinistra è dove corre la linea; su mobile non serve */}
      <div className="md:pl-20">{children}</div>
    </TracingBeam>
  );
}
