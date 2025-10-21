import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "@/assets/header_logo.svg?url";

const nav = [
  { label: "Главная", href: "/home" },
  { label: "Участникам", href: "/participants" },
  { label: "Партнёры", href: "/partners" },
  { label: "Новости", href: "/news" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="container-limited h-16 flex items-center justify-between md:px-8 !px-12">
        <a href="/home" className="flex items-center gap-2">
          <img src={Logo} alt="Стартлаб БГУИР" className="h-4 sm:h-6 w-auto" />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {nav.map((n) => (
            <a
              key={n.label}
              href={n.href}
              className="text-sm font-semibold hover:text-brand-purple"
            >
              {n.label}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col gap-1 w-6 h-6 relative"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <motion.span
            className="h-0.5 bg-black absolute top-0 w-full"
            animate={{
              rotate: isMenuOpen ? 45 : 0,
              y: isMenuOpen ? 8 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
          <motion.span
            className="h-0.5 bg-black absolute top-2 w-full"
            animate={{
              opacity: isMenuOpen ? 0 : 1,
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          />
          <motion.span
            className="h-0.5 bg-black absolute top-4 w-full"
            animate={{
              rotate: isMenuOpen ? -45 : 0,
              y: isMenuOpen ? -8 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            className="md:hidden bg-white/95 backdrop-blur border-t px-4 py-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
              opacity: { duration: 0.2 },
            }}
            style={{ overflow: "hidden" }}
          >
            {nav.map((n, index) => (
              <motion.a
                key={n.label}
                href={n.href}
                className="block py-3 text-sm font-semibold hover:text-brand-purple border-b border-gray-100 last:border-0"
                onClick={() => setIsMenuOpen(false)}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.3,
                  ease: "easeOut",
                }}
              >
                {n.label}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
