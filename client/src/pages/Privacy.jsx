import { Link } from 'react-router-dom'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import SiteLayout from '../components/SiteLayout'
import { CONTACTO, NOMBRE_TIENDA } from '../config'

function Seccion({ numero, titulo, children }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-extrabold sm:text-xl">
        <span className="text-brand">{numero}.</span> {titulo}
      </h2>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-slate-600 sm:text-base">
        {children}
      </div>
    </section>
  )
}

function Lista({ items }) {
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export default function Privacy() {
  return (
    <SiteLayout>
      <main className="flex flex-1 py-6">
        <article className="mx-auto w-full max-w-3xl rounded-3xl bg-white p-5 text-slate-800 shadow-2xl sm:p-8">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-brand hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>

          <div className="mt-2 flex items-center gap-3">
            <ShieldCheck className="h-9 w-9 shrink-0 text-brand" />
            <h1 className="text-2xl font-extrabold leading-tight sm:text-3xl">
              Política de tratamiento de datos personales
            </h1>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Última actualización: noviembre de 2026
          </p>

          <div
            role="note"
            className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900"
          >
            Texto modelo para un proyecto académico. No constituye asesoría
            legal; si {NOMBRE_TIENDA} se usa en un negocio real, debe revisarlo
            un abogado.
          </div>

          <Seccion numero="1" titulo="Responsable del tratamiento">
            <p>
              {NOMBRE_TIENDA} es el responsable del tratamiento de los datos que
              recibe a través de este sitio web.
            </p>
            <ul className="space-y-1">
              <li>
                Correo:{' '}
                <a
                  href={`mailto:${CONTACTO.email}`}
                  className="break-all font-semibold text-brand hover:underline"
                >
                  {CONTACTO.email}
                </a>
              </li>
              <li>
                Teléfono:{' '}
                <a
                  href={CONTACTO.telefonoLink}
                  className="font-semibold text-brand hover:underline"
                >
                  {CONTACTO.telefono}
                </a>
              </li>
              <li>Dirección: {CONTACTO.direccion}</li>
            </ul>
          </Seccion>

          <Seccion numero="2" titulo="Datos que recolectamos">
            <p>Cuando solicitas una cotización, te pedimos:</p>
            <Lista
              items={[
                'Nombre y teléfono de contacto.',
                'Dirección, ciudad, departamento y descripción del domicilio.',
                'Método de pago elegido (efectivo o transferencia). Solo registramos tu preferencia, nunca datos de tarjetas ni de cuentas bancarias.',
                'El detalle de tu cotización: equipos, componentes, servicios y periféricos.',
                'La fecha y hora en que aceptaste esta política.',
              ]}
            />
            <p>
              No solicitamos datos sensibles. El sitio está dirigido a personas
              mayores de edad.
            </p>
          </Seccion>

          <Seccion numero="3" titulo="Para qué usamos tus datos">
            <Lista
              items={[
                'Preparar y responder tu cotización.',
                'Coordinar la entrega y el pago.',
                'Contactarte por WhatsApp o por teléfono para confirmar disponibilidad y precio final.',
                'Gestionar internamente las solicitudes recibidas, en un panel de acceso restringido.',
              ]}
            />
            <p>
              No vendemos tus datos ni los usamos para publicidad de terceros.
            </p>
          </Seccion>

          <Seccion numero="4" titulo="Tu autorización">
            <p>
              Para enviar la cotización debes marcar la casilla de autorización.
              Con ella nos das tu consentimiento previo, expreso e informado
              para tratar tus datos con las finalidades de esta política.
              Puedes revocarla en cualquier momento escribiéndonos.
            </p>
          </Seccion>

          <Seccion numero="5" titulo="Con quién se comparten">
            <p>
              Para que el sitio funcione usamos proveedores de infraestructura
              que almacenan o procesan la información por nuestra cuenta:
            </p>
            <Lista
              items={[
                'Neon: base de datos donde se guardan las cotizaciones.',
                'Render: servidor de la aplicación.',
                'Vercel: alojamiento del sitio web.',
                'WhatsApp: al pulsar enviar, el mensaje con tu cotización pasa por esta plataforma, bajo sus propias condiciones.',
              ]}
            />
            <p>
              El sitio carga su tipografía desde Google Fonts, por lo que tu
              navegador se conecta a servidores de Google al abrirlo.
            </p>
          </Seccion>

          <Seccion numero="6" titulo="Información guardada en tu dispositivo">
            <p>
              Tu carrito se guarda en el almacenamiento local de tu navegador
              (<code className="rounded bg-slate-100 px-1">localStorage</code>)
              para que no se pierda al recargar; esa información no se envía a
              nuestros servidores. Este sitio no usa cookies de publicidad ni
              de analítica.
            </p>
          </Seccion>

          <Seccion numero="7" titulo="Tus derechos">
            <p>Como titular de los datos puedes:</p>
            <Lista
              items={[
                'Conocer, actualizar y rectificar tus datos personales.',
                'Solicitar prueba de la autorización que otorgaste.',
                'Ser informado del uso que se ha dado a tus datos.',
                'Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) por infracciones a la ley.',
                'Revocar la autorización y solicitar la supresión de tus datos.',
                'Acceder de forma gratuita a tus datos personales.',
              ]}
            />
          </Seccion>

          <Seccion numero="8" titulo="Cómo ejercer tus derechos">
            <p>
              Escríbenos a{' '}
              <a
                href={`mailto:${CONTACTO.email}`}
                className="break-all font-semibold text-brand hover:underline"
              >
                {CONTACTO.email}
              </a>{' '}
              indicando tu nombre, tu teléfono, el número de cotización (si lo
              conoces) y lo que solicitas. Responderemos dentro de los plazos
              que fija la ley.
            </p>
          </Seccion>

          <Seccion numero="9" titulo="Seguridad y conservación">
            <p>
              La comunicación con el sitio viaja cifrada (HTTPS), el panel de
              administración exige una clave y limita los intentos fallidos de
              acceso. Conservamos tus datos mientras sean necesarios para las
              finalidades descritas y para cumplir obligaciones legales; después
              se eliminan.
            </p>
          </Seccion>

          <Seccion numero="10" titulo="Cambios en esta política">
            <p>
              Si modificamos esta política, publicaremos la nueva versión en
              esta página. Si el cambio afecta la finalidad del tratamiento,
              volveremos a pedir tu autorización.
            </p>
          </Seccion>
        </article>
      </main>
    </SiteLayout>
  )
}