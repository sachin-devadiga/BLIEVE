"use client";

import {
  useState,
  useEffect,
  useRef,
  useSyncExternalStore,
  type MouseEvent,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import {
  getSession,
  getServerSession,
  subscribeSession,
} from "@/lib/clientAuth";
import { INSTITUTION, INSTITUTION_URL, INSTITUTION_SHORT, INSTITUTION_LOCATION } from "@/config/site";
type NavLink = { label: string; path: string };
type NavItem = NavLink & { children?: NavLink[] };

const navItems: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  {
    label: "Ecosystem",
    path: "/programs",
    children: [
      { label: "Programs", path: "/programs" },
      { label: "Journey", path: "/journey" },
      { label: "Startups", path: "/startups" },
      { label: "Events", path: "/events" },
      { label: "Membership", path: "/membership" },
    ],
  },
  { label: "Blog", path: "/blog" },
  { label: "Board", path: "/#board" },
  { label: "Contact", path: "/contact" },
];

const primaryGroup = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Blog", path: "/blog" },
  { label: "Board", path: "/#board" },
  { label: "Contact", path: "/contact" },
];

const ecosystemGroup = [
  { label: "Programs", path: "/programs" },
  { label: "Journey", path: "/journey" },
  { label: "Startups", path: "/startups" },
  { label: "Events", path: "/events" },
  { label: "Membership", path: "/membership" },
];

function isActive(pathname: string, item: NavItem): boolean {
  if (item.children) {
    return item.children.some((c) => pathname === c.path);
  }
  return pathname === item.path;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const session = useSyncExternalStore(
    subscribeSession,
    getSession,
    getServerSession
  );
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Every public page opens with a dark navy hero, so the transparent
  // white-text header works there. The admin console and the anonymous /
  // administrator dashboard states open on a light surface instead, where
  // white text would vanish — force the solid bar on those routes.
  const onLightTop =
    pathname === "/admin" ||
    (pathname === "/dashboard" && session?.role !== "member") ||
    (pathname === "/profile" && !session);
  const solid = scrolled || onLightTop;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setOpenDropdown(null);
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  const closeMenu = () => setIsOpen(false);

  // Next.js updates the URL for same-page hash links but does not scroll.
  // Handle those clicks ourselves so the "Board" menu item jumps to the
  // E-Cell Board section when the visitor is already on the homepage.
  // Mobile passes a delay so the menu's exit animation finishes first —
  // collapsing it mid-scroll makes the browser cancel the smooth scroll.
  const handleHashClick = (
    e: MouseEvent<HTMLAnchorElement>,
    path: string,
    delay = 0
  ) => {
    if (pathname !== "/" || !path.startsWith("/#")) return;
    const target = document.getElementById(path.slice(2));
    if (!target) return;
    e.preventDefault();
    window.history.replaceState(null, "", path);
    window.setTimeout(() => {
      document
        .getElementById(path.slice(2))
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, delay);
  };

  const openNow = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(label);
  };
  const closeSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  const linkBase =
    "px-1 xl:px-2 2xl:px-2.5 py-2 rounded-lg text-[13px] xl:text-sm font-medium transition-colors";
  const linkIdle = solid
    ? "text-navy/70 dark:text-white/70 hover:text-navy dark:hover:text-white hover:bg-navy/5 dark:hover:bg-white/10"
    : "text-white/75 hover:text-white hover:bg-white/10";
  const linkActive = "text-orange bg-orange/10";

  // Brand text sits over the navy hero while transparent (unscrolled),
  // so it must be white there; once scrolled it sits on the solid bar.
  const brandNameClass = solid
    ? "text-navy dark:text-white"
    : "text-white";

  return (
    <header
      className={`site-header fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solid
          ? "bg-white/95 dark:bg-[#080F24]/95 backdrop-blur-md shadow-lg shadow-black/5 border-b border-black/5 dark:border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[104px] xl:h-[116px] 2xl:h-[124px] gap-2 sm:gap-2.5 lg:gap-3">
          {/* LEFT — College identity */}
          <a
            href={INSTITUTION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 sm:gap-3 lg:gap-3 shrink-0 group min-w-0"
            title={`Visit the ${INSTITUTION} website`}
          >
            <span className="relative w-11 h-11 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-[76px] xl:h-[76px] 2xl:w-[88px] 2xl:h-[88px] rounded-full bg-white ring-1 ring-black/10 shadow-sm overflow-hidden shrink-0">
                <Image
                  src="/acet-logo.png"
                  alt={`${INSTITUTION} crest`}
                  fill
                  sizes="96px"
                  className="object-contain scale-[1.42]"
                  priority
                />
            </span>
            <span className="min-w-0 leading-tight">
              <span className={`block font-bold uppercase ${brandNameClass} text-[9px] leading-[1.2] sm:leading-tight sm:text-xs lg:text-[13px] xl:text-[15px] 2xl:text-[17px] tracking-wide max-w-[72px] sm:max-w-[130px] lg:max-w-[150px] xl:max-w-[180px] 2xl:max-w-[230px]`}>
                {INSTITUTION}
              </span>
              <span className="hidden sm:block text-[9px] lg:text-[10px] xl:text-[11px] font-semibold uppercase tracking-[0.2em] text-orange mt-0.5 lg:mt-1">
                {INSTITUTION_LOCATION}
              </span>
            </span>
          </a>

          {/* CENTER — Navigation (desktop) */}
          <nav
            ref={navRef}
            aria-label="Primary"
            className="hidden lg:flex items-center gap-0 2xl:gap-0.5"
          >
            {navItems.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => openNow(item.label)}
                  onMouseLeave={closeSoon}
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={openDropdown === item.label}
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === item.label ? null : item.label
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        openNow(item.label);
                      }
                    }}
                    className={`${linkBase} flex items-center gap-1 ${
                      isActive(pathname, item) ? linkActive : linkIdle
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${
                        openDropdown === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full mt-1 w-48 bg-white dark:bg-navy-dark rounded-xl border border-gray-100 dark:border-white/10 shadow-xl shadow-black/10 py-2"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            href={child.path}
                            onClick={() => {
                              setOpenDropdown(null);
                            }}
                            className={`block px-4 py-2 text-sm transition-colors ${
                              pathname === child.path
                                ? "text-orange bg-orange/5 font-medium"
                                : "text-navy/80 dark:text-white/80 hover:text-orange hover:bg-orange/5"
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.path}
                  onClick={(e) => handleHashClick(e, item.path)}
                  className={`${linkBase} ${
                    pathname === item.path ? linkActive : linkIdle
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* RIGHT — Login, Apply, theme, BLIEVE identity */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2 2xl:gap-2.5 shrink-0">
            {session ? (
              <Link
                href="/profile"
                title="Open my profile"
                aria-label="Open my profile"
                className="hidden lg:flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-orange/10 dark:hover:bg-white/10 transition-colors"
              >
                <span
                  className="w-7 h-7 rounded-full bg-orange text-white text-[10px] font-bold flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  {session.avatar}
                </span>
                <span
                  className={`text-[13px] font-medium max-w-[60px] truncate ${
                    solid ? "text-navy dark:text-white" : "text-white"
                  }`}
                >
                  {session.name.split(" ")[0]}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className={`hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                  solid
                    ? "text-navy dark:text-white border-gray-200 dark:border-white/15 hover:border-orange hover:text-orange"
                    : "text-white border-white/25 hover:border-white/70 hover:bg-white/10"
                }`}
              >
                <LogIn size={15} aria-hidden="true" />
                Login
              </Link>
            )}
            <Link
              href="/apply"
              className="hidden sm:inline-flex items-center px-3 lg:px-3.5 py-2.5 min-h-11 bg-orange text-white font-semibold text-[13px] rounded-xl hover:bg-orange-light transition-colors shadow-lg shadow-orange/20"
            >
              Apply to BLIEVE
            </Link>
            <ThemeToggle onDark={!solid} />
            <Link
              href="/"
              className="flex items-center gap-2.5 lg:gap-3 group"
              aria-label="BLIEVE home"
            >
              <span className="relative w-11 h-11 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-[76px] xl:h-[76px] 2xl:w-[88px] 2xl:h-[88px] rounded-full bg-white ring-1 ring-black/10 shadow-sm overflow-hidden shrink-0">
                <Image
                  src="/blieve-logo.png"
                  alt="BLIEVE E-Cell logo"
                  fill
                  sizes="96px"
                  className="object-contain scale-[1.05]"
                  priority
                />
              </span>
              <span className="block leading-tight">
                <span className={`block font-bold uppercase ${brandNameClass} text-[10px] sm:text-[13px] xl:text-[15px] 2xl:text-[17px] tracking-wide`}>
                  BLI<span className="text-orange">E</span>VE
                </span>
                <span className="hidden sm:block text-[9px] xl:text-[10px] 2xl:text-[11px] font-semibold uppercase tracking-[0.2em] text-orange mt-0.5 lg:mt-1">
                  E-Cell &middot; {INSTITUTION_SHORT}
                </span>
              </span>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2.5 rounded-lg transition-colors ${
                solid
                  ? "text-navy dark:text-white hover:bg-navy/5 dark:hover:bg-white/10"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden"
          >
            <div className="bg-white dark:bg-navy-dark border-t border-gray-100 dark:border-white/10 px-4 pb-[calc(1.5rem_+_env(safe-area-inset-bottom))] pt-2 max-h-[calc(100dvh_-_4rem_-_env(safe-area-inset-top))] overflow-y-auto">
              <p className="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-text-light dark:text-white/40">
                Explore
              </p>
              {primaryGroup.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={(e) => {
                    // Wait for the mobile menu (300ms exit) to finish
                    // collapsing before starting the smooth scroll.
                    handleHashClick(e, link.path, 380);
                    closeMenu();
                  }}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.path
                      ? "text-orange bg-orange/10"
                      : "text-navy/70 dark:text-white/70 hover:text-navy dark:hover:text-white hover:bg-navy/5 dark:hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <p className="px-4 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-text-light dark:text-white/40">
                Ecosystem
              </p>
              {ecosystemGroup.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={closeMenu}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.path
                      ? "text-orange bg-orange/10"
                      : "text-navy/70 dark:text-white/70 hover:text-navy dark:hover:text-white hover:bg-navy/5 dark:hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {session ? (
                <div className="mt-4 space-y-2">
                  <div className="px-4 py-3 rounded-xl bg-pale dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-navy dark:text-white truncate">
                      {session.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold tracking-wider shrink-0 ${
                        session.role === "admin"
                          ? "text-orange"
                          : "text-text-light"
                      }`}
                    >
                      {session.role === "admin" ? "ADMIN" : "MEMBER"}
                    </span>
                  </div>
                  <Link
                    href={session.role === "admin" ? "/admin" : "/dashboard"}
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-orange text-white rounded-xl text-sm font-semibold hover:bg-orange-light transition-colors"
                  >
                    {session.role === "admin" ? "Admin Console" : "My Dashboard"}
                  </Link>
                  <Link
                    href="/profile"
                    onClick={closeMenu}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-navy/10 dark:border-white/15 text-sm font-semibold text-navy dark:text-white hover:border-orange hover:text-orange transition-colors"
                  >
                    Profile &amp; Logout
                  </Link>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="mt-4 flex items-center justify-center gap-2 px-4 py-3 border border-navy/10 dark:border-white/15 rounded-xl text-sm font-semibold text-navy dark:text-white hover:border-orange hover:text-orange transition-colors"
                >
                  <LogIn size={15} aria-hidden="true" />
                  Login
                </Link>
              )}
              <Link
                href="/apply"
                onClick={closeMenu}
                className="block mt-3 px-4 py-3 bg-orange text-white font-semibold text-sm rounded-xl text-center hover:bg-orange-light transition-colors"
              >
                Apply to BLIEVE
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
