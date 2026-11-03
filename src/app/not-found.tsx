import Link from "next/link";
import { ArrowLeft, Home, Compass } from "lucide-react";

const links = [
  { label: "About", path: "/about" },
  { label: "Programs", path: "/programs" },
  { label: "Events", path: "/events" },
  { label: "Blog", path: "/blog" },
  { label: "Contact", path: "/contact" },
];

export default function NotFound() {
  return (
    <section className="bg-navy dark:bg-[#080F24] min-h-[70vh] flex items-center justify-center pt-32 pb-20 px-4">
      <div className="max-w-xl w-full text-center">
        <p className="font-serif text-7xl sm:text-8xl font-bold text-orange mb-4">
          404
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
          This page hasn&apos;t been built yet.
        </h1>
        <p className="text-white/60 leading-relaxed mb-8">
          Like every venture here, some things start as ideas. The page
          you&apos;re looking for doesn&apos;t exist &mdash; but the rest of the
          ecosystem does.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange text-white font-semibold rounded-xl hover:bg-orange-light transition-colors"
          >
            <Home size={16} aria-hidden="true" /> Back to Home
          </Link>
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors border border-white/10"
          >
            <Compass size={16} aria-hidden="true" /> Explore Programs
          </Link>
        </div>
        <nav aria-label="Suggested pages" className="flex flex-wrap justify-center gap-3">
          {links.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className="inline-flex items-center gap-1 text-sm text-white/50 hover:text-orange transition-colors"
            >
              <ArrowLeft size={12} aria-hidden="true" className="-scale-x-100" />
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
