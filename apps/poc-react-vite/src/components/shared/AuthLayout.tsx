import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router";
import svgPaths from "@/imports/svg-3imqnb48ew";
import { useApp } from "@/context/AppContext";
import { Toaster } from "sonner";

// ── Common SVG icons ──────────────────────────────────────────────────────────
const hamburgerPath = "M0 12V10H18V12H0ZM0 7V5H18V7H0ZM0 2V0H18V2H0Z";
const searchPath =
  "M14.3251 12.8985L19.7048 18.2783C19.8939 18.4676 20.0001 18.7242 20 18.9917C19.9999 19.2592 19.8935 19.5157 19.7043 19.7048C19.5151 19.8939 19.2585 20.0001 18.991 20C18.7235 19.9999 18.467 19.8935 18.2779 19.7043L12.8981 14.3244C11.2899 15.5701 9.26759 16.1563 7.24253 15.9638C5.21748 15.7712 3.34182 14.8145 1.99713 13.2881C0.652446 11.7617 -0.0602623 9.78035 0.00399614 7.74712C0.0682545 5.7139 0.904653 3.78152 2.34304 2.3431C3.78143 0.904675 5.71376 0.0682562 7.74693 0.00399624C9.7801 -0.0602638 11.7614 0.652463 13.2877 1.99718C14.8141 3.3419 15.7708 5.21761 15.9634 7.24271C16.1559 9.26782 15.5697 11.2902 14.3241 12.8985M8.00037 13.9994C9.5916 13.9994 11.1176 13.3673 12.2428 12.2421C13.368 11.1169 14.0001 9.59084 14.0001 7.99957C14.0001 6.40831 13.368 4.88222 12.2428 3.75702C11.1176 2.63183 9.5916 1.9997 8.00037 1.9997C6.40915 1.9997 4.88309 2.63183 3.75793 3.75702C2.63276 4.88222 2.00065 6.40831 2.00065 7.99957C2.00065 9.59084 2.63276 11.1169 3.75793 12.2421C4.88309 13.3673 6.40915 13.9994 8.00037 13.9994Z";
const micPath =
  "M7 12C6.16667 12 5.45833 11.7083 4.875 11.125C4.29167 10.5417 4 9.83333 4 9V3C4 2.16667 4.29167 1.45833 4.875 0.875C5.45833 0.291667 6.16667 0 7 0C7.83333 0 8.54167 0.291667 9.125 0.875C9.70833 1.45833 10 2.16667 10 3V9C10 9.83333 9.70833 10.5417 9.125 11.125C8.54167 11.7083 7.83333 12 7 12ZM6 19V15.925C4.26667 15.6917 2.83333 14.9167 1.7 13.6C0.566667 12.2833 0 10.75 0 9H2C2 10.3833 2.4875 11.5625 3.4625 12.5375C4.4375 13.5125 5.61667 14 7 14C8.38333 14 9.5625 13.5125 10.5375 12.5375C11.5125 11.5625 12 10.3833 12 9H14C14 10.75 13.4333 12.2833 12.3 13.6C11.1667 14.9167 9.73333 15.6917 8 15.925V19H6Z";
const profilePath =
  "M3.85 15.1C4.7 14.45 5.65 13.9375 6.7 13.5625C7.75 13.1875 8.85 13 10 13C11.15 13 12.25 13.1875 13.3 13.5625C14.35 13.9375 15.3 14.45 16.15 15.1C16.7333 14.4167 17.1875 13.6417 17.5125 12.775C17.8375 11.9083 18 10.9833 18 10C18 7.78333 17.2208 5.89583 15.6625 4.3375C14.1042 2.77917 12.2167 2 10 2C7.78333 2 5.89583 2.77917 4.3375 4.3375C2.77917 5.89583 2 7.78333 2 10C2 10.9833 2.1625 11.9083 2.4875 12.775C2.8125 13.6417 3.26667 14.4167 3.85 15.1ZM10 11C9.01667 11 8.1875 10.6625 7.5125 9.9875C6.8375 9.3125 6.5 8.48333 6.5 7.5C6.5 6.51667 6.8375 5.6875 7.5125 5.0125C8.1875 4.3375 9.01667 4 10 4C10.9833 4 11.8125 4.3375 12.4875 5.0125C13.1625 5.6875 13.5 6.51667 13.5 7.5C13.5 8.48333 13.1625 9.3125 12.4875 9.9875C11.8125 10.6625 10.9833 11 10 11ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20Z";

const menuItems = [
  { label: "Cursos", path: "/cursos", iconPath: svgPaths.p240fd300 },
  { label: "Portais", path: null, iconPath: svgPaths.p12986e80 },
  { label: "Desenvolvimento", path: null, iconPath: svgPaths.p3d982070 },
  { label: "Política de privacidade", path: null, iconPath: svgPaths.p230ab480 },
  { label: "Ajuda", path: null, iconPath: svgPaths.p34f77440 },
  { label: "Idioma", path: null, iconPath: svgPaths.p20701600 },
];

export function AuthLayout() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Refs para gestão de foco
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const profileBtnRef = useRef<HTMLButtonElement>(null);
  const drawerCloseRef = useRef<HTMLButtonElement>(null);

  // Fechar com Escape e devolver foco ao trigger
  useEffect(() => {
    if (!menuOpen && !profileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (menuOpen) {
          setMenuOpen(false);
          hamburgerRef.current?.focus();
        } else if (profileOpen) {
          setProfileOpen(false);
          profileBtnRef.current?.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen, profileOpen]);

  // Mover foco para o botão fechar quando o drawer abre
  useEffect(() => {
    if (menuOpen) {
      // timeout para aguardar a renderização
      const id = setTimeout(() => drawerCloseRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
  }, [menuOpen]);

  // compute initials for avatar fallback
  const initials = (() => {
    const parts = user.name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  })();

  return (
    <div className="bg-white flex flex-col w-full min-h-screen">

      {/* ── Top navigation bar ── */}
      <header className="bg-[#021b59] h-[56px] sticky top-0 z-10 w-full relative shrink-0">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between px-[16px] h-full">

          {/* Hamburger */}
          <button
            ref={hamburgerRef}
            type="button"
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            aria-controls="main-nav-drawer"
            onClick={() => { setMenuOpen(true); setProfileOpen(false); }}
            className={`flex items-center justify-center size-[44px] rounded-sm focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#ffeac4] transition-colors ${menuOpen ? "bg-[#042e99]" : ""}`}
          >
            <svg className="size-[16px]" fill="none" viewBox="0 0 18 12" aria-hidden="true">
              <path d={hamburgerPath} fill="#FFEAC4" />
            </svg>
          </button>

          {/* Search bar */}
          <div className="bg-white flex gap-[8px] h-[36px] items-center px-[14px] py-[4px] w-[220px] sm:w-[300px] md:w-[380px] lg:w-[480px] rounded-sm">
            <svg className="size-[18px] shrink-0" fill="none" viewBox="0 0 20 20" aria-hidden="true">
              <g clipPath="url(#clip-search-nav)">
                <path clipRule="evenodd" d={searchPath} fill="#042E99" fillRule="evenodd" />
              </g>
              <defs>
                <clipPath id="clip-search-nav">
                  <rect fill="white" height="20" width="20" />
                </clipPath>
              </defs>
            </svg>
            <input
              type="search"
              aria-label="Buscar cursos"
              placeholder="Buscar cursos"
              className="flex-1 font-['Figtree:Regular',sans-serif] font-normal text-[15px] text-[#333] bg-transparent outline-none min-w-0 placeholder-[#595959]"
            />
            <button
              type="button"
              aria-label="Pesquisar por voz"
              className="relative shrink-0 size-[20px] focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#042e99] rounded-sm"
            >
              <svg className="block size-full" fill="none" viewBox="0 0 14 19" aria-hidden="true">
                <path d={micPath} fill="#042E99" />
              </svg>
            </button>
          </div>

          {/* Profile icon */}
          <div className="relative">
            <button
              ref={profileBtnRef}
              type="button"
              aria-label="Menu do perfil"
              aria-expanded={profileOpen}
              aria-controls="profile-dropdown"
              onClick={() => { setProfileOpen(!profileOpen); setMenuOpen(false); }}
              className={`flex items-center justify-center size-[44px] rounded-full border-2 border-[#ffeac4] overflow-hidden focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#ffeac4] transition-colors bg-[#042e99]`}
            >
              {user.photoUrl ? (
                <img src={user.photoUrl} alt="Foto de perfil" className="size-full object-cover" />
              ) : (
                <span aria-hidden="true" className="font-['Figtree:Bold',sans-serif] font-bold text-[#ffeac4] text-[16px] select-none">
                  {initials}
                </span>
              )}
            </button>

            {/* Profile dropdown */}
            {profileOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setProfileOpen(false)}
                  aria-hidden="true"
                />
                <div
                  id="profile-dropdown"
                  role="menu"
                  aria-label="Menu do perfil"
                  className="absolute right-0 top-[46px] z-40 bg-[#021b59] min-w-[220px] py-[10px] shadow-xl"
                >
                  {/* User info */}
                  <div className="px-[20px] py-[8px] pb-[14px] flex items-center gap-[12px] border-b border-[#ffeac4]/20 mb-[6px]">
                    <div className="size-[38px] rounded-full overflow-hidden bg-[#042e99] border border-[#ffeac4] shrink-0 flex items-center justify-center">
                      {user.photoUrl ? (
                        <img src={user.photoUrl} alt="" className="size-full object-cover" aria-hidden="true" />
                      ) : (
                        <span aria-hidden="true" className="font-['Figtree:Bold',sans-serif] font-bold text-[#ffeac4] text-[14px] select-none">
                          {initials}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[22px] text-[#ffeac4] text-[16px]">
                        {user.name}
                      </p>
                      <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#ffeac4]/70 text-[12px]">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Perfil */}
                  <button
                    role="menuitem"
                    type="button"
                    className="w-full flex items-center gap-[15px] px-[20px] py-[11px] hover:bg-[#042e99] focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#ffeac4] focus-visible:outline-offset-[-2px] transition-colors"
                    onClick={() => { setProfileOpen(false); navigate("/perfil"); }}
                  >
                    <svg className="shrink-0 size-[22px]" fill="none" viewBox="0 0 20 20" aria-hidden="true">
                      <path d={svgPaths.pe3d9c80} fill="#FFEAC4" />
                    </svg>
                    <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#ffeac4] text-[16px]">Perfil</span>
                  </button>
                  
                  {/* Mensagem — somente para professores */}
                  {user.role === "professor" && (
                    <button
                      role="menuitem"
                      type="button"
                      className="w-full flex items-center gap-[15px] px-[20px] py-[11px] hover:bg-[#042e99] focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#ffeac4] focus-visible:outline-offset-[-2px] transition-colors"
                      onClick={() => { setProfileOpen(false); navigate("/mensagens"); }}
                    >
                      <svg className="shrink-0 size-[22px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" fill="#FFEAC4" />
                      </svg>
                      <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#ffeac4] text-[16px]">Mensagem</span>
                    </button>
                  )}
                  
                  {/* Meus Cursos — para professores e estudantes */}
                  {user.role === "professor" && (
                    <button
                      role="menuitem"
                      type="button"
                      className="w-full flex items-center gap-[15px] px-[20px] py-[11px] hover:bg-[#042e99] focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#ffeac4] focus-visible:outline-offset-[-2px] transition-colors"
                      onClick={() => { setProfileOpen(false); navigate("/meus-cursos"); }}
                    >
                      <svg className="shrink-0 size-[22px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 14H8v-2h8v2zm0-4H8v-2h8v2zm0-4H8V6h8v2z" fill="#FFEAC4" />
                      </svg>
                      <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#ffeac4] text-[16px]">Meus cursos</span>
                    </button>
                  )}
                  
                  {/* Meus Cursos — somente para estudantes */}
                  {user.role === "estudante" && (
                    <button
                      role="menuitem"
                      type="button"
                      className="w-full flex items-center gap-[15px] px-[20px] py-[11px] hover:bg-[#042e99] focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#ffeac4] focus-visible:outline-offset-[-2px] transition-colors"
                      onClick={() => { setProfileOpen(false); navigate("/meus-cursos"); }}
                    >
                      <svg className="shrink-0 size-[22px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 14H8v-2h8v2zm0-4H8v-2h8v2zm0-4H8V6h8v2z" fill="#FFEAC4" />
                      </svg>
                      <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#ffeac4] text-[16px]">Meus cursos</span>
                    </button>
                  )}

                  {/* Mensagens recebidas — somente para estudantes */}
                  {user.role === "estudante" && (
                    <button
                      role="menuitem"
                      type="button"
                      className="w-full flex items-center gap-[15px] px-[20px] py-[11px] hover:bg-[#042e99] focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#ffeac4] focus-visible:outline-offset-[-2px] transition-colors"
                      onClick={() => { setProfileOpen(false); navigate("/mensagens-recebidas"); }}
                    >
                      <svg className="shrink-0 size-[22px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" fill="#FFEAC4" />
                      </svg>
                      <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#ffeac4] text-[16px]">Mensagens</span>
                    </button>
                  )}
                  {/* Sair */}
                  <button
                    role="menuitem"
                    type="button"
                    className="w-full flex items-center gap-[15px] px-[20px] py-[11px] hover:bg-[#042e99] focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#ffeac4] focus-visible:outline-offset-[-2px] transition-colors"
                    onClick={() => { setProfileOpen(false); navigate("/"); }}
                  >
                    <svg className="shrink-0 size-[22px]" fill="none" viewBox="0 0 24 23" aria-hidden="true">
                      <path clipRule="evenodd" d={svgPaths.pcbd3400} fill="#FFEAC4" fillRule="evenodd" />
                    </svg>
                    <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#ffeac4] text-[16px]">Sair</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Page content ── */}
      <div className="flex-1 max-w-[1280px] mx-auto w-full overflow-x-hidden">
        <Outlet />
      </div>

      {/* ── Hamburger menu drawer ── */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-title"
        >
          <nav
            id="main-nav-drawer"
            className="bg-[#021b59] w-[300px] sm:w-[340px] h-full flex flex-col pt-[20px] pb-[40px] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between px-[20px] pb-[20px] border-b border-[#ffeac4]/20">
              <p
                id="drawer-title"
                className="font-['Figtree:Medium',sans-serif] font-medium text-[#ffeac4]/70 text-[12px] uppercase tracking-widest"
              >
                Menu
              </p>
              <button
                ref={drawerCloseRef}
                type="button"
                aria-label="Fechar menu"
                onClick={() => { setMenuOpen(false); hamburgerRef.current?.focus(); }}
                className="flex items-center justify-center size-[44px] text-[#ffeac4] hover:bg-[#ffeac4]/10 rounded-sm focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#ffeac4]"
              >
                <span aria-hidden="true" className="text-[20px] leading-none">✕</span>
              </button>
            </div>

            {menuItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className="flex items-center gap-[15px] text-left w-full px-[30px] py-[14px] font-['Figtree:Regular',sans-serif] font-normal text-[#ffeac4] text-[16px] hover:bg-[#ffeac4]/10 active:bg-[#ffeac4]/20 transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#ffeac4] focus-visible:outline-offset-[-2px]"
                onClick={() => {
                  setMenuOpen(false);
                  if (item.path) navigate(item.path);
                }}
              >
                <svg className="shrink-0 size-[24px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <path d={item.iconPath} fill="#FFEAC4" fillRule="evenodd" clipRule="evenodd" />
                </svg>
                {item.label}
              </button>
            ))}
          </nav>

          <div
            className="flex-1 bg-black/50"
            onClick={() => { setMenuOpen(false); hamburgerRef.current?.focus(); }}
            aria-hidden="true"
          />
        </div>
      )}
      <Toaster position="top-center" richColors />
    </div>
  );
}