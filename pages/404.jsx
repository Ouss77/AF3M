import Head from "next/head";
import Link from "next/link";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page introuvable - AF3M</title>
        <meta
          name="description"
          content="La page que vous cherchez est introuvable. Retournez à l'accueil ou consultez nos actualités."
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-16 text-slate-800">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-xl shadow-slate-200/60 backdrop-blur sm:p-12">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-4xl font-bold text-blue-700">
            404
          </div>

          <h1 className="mb-3 text-center text-3xl font-semibold sm:text-4xl">
            Oups ! Cette page est introuvable
          </h1>

          <p className="mb-8 max-w-2xl text-center text-base leading-7 text-slate-600 sm:text-lg">
            Le contenu que vous essayez d’ouvrir n’est pas disponible pour le moment.
            Cela peut être dû à un lien cassé, à un document déplacé ou à une ressource temporairement indisponible.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-full bg-blue-600 px-6 py-3 text-center font-medium text-white transition hover:bg-blue-700"
            >
              Retour à l’accueil
            </Link>
            <Link
              href="/actualites"
              className="rounded-full border border-slate-300 px-6 py-3 text-center font-medium text-slate-700 transition hover:border-blue-500 hover:text-blue-600"
            >
              Voir les actualités
            </Link>
          </div>

          <div className="mt-10 rounded-2xl bg-slate-50 px-5 py-4 text-sm text-slate-600">
            Si vous pensez qu’il s’agit d’une erreur, veuillez nous contacter pour nous aider à corriger le problème.
          </div>
        </div>
      </main>
    </>
  );
}
