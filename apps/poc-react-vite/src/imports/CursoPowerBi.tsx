import clsx from "clsx";
import svgPaths from "./svg-vej51lnf8d";
import imgImage from "figma:asset/054dfe02e425078fdd66113858fbed2e929f9c10.png";
import imgRectangle9 from "figma:asset/22ebf3a06cf8215c6bd0946f42302bc2204ed790.png";
type Wrapper1Props = {
  additionalClassNames?: string;
};

function Wrapper1({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper1Props>) {
  return (
    <div className={clsx("content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 w-[40px]", additionalClassNames)}>
      <div className="content-stretch flex h-[40px] items-center justify-center relative shrink-0 w-full" data-name="State-layer">
        <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon">
          {children}
        </div>
      </div>
    </div>
  );
}

function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="flex flex-row items-center justify-center size-full">
      <div className="content-stretch flex items-center justify-center relative size-full">
        <Wrapper1 additionalClassNames="rounded-[100px]">{children}</Wrapper1>
      </div>
    </div>
  );
}

function TrailingIcon({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute left-0 size-[48px] top-0">
      <Wrapper>
        <div className="absolute inset-[8.33%]" data-name="icon">
          {children}
        </div>
      </Wrapper>
    </div>
  );
}
type TrailingElementsProps = {
  additionalClassNames?: string;
};

function TrailingElements({ children, additionalClassNames = "" }: React.PropsWithChildren<TrailingElementsProps>) {
  return (
    <div className={clsx("relative shrink-0", additionalClassNames)}>
      <TrailingIcon>
        <svg fill="none" preserveAspectRatio="none" viewBox="0 0 20 20" className="absolute block size-full">
          <path d={svgPaths.pe3d9c80} fill="var(--fill-0, #1D1B20)" id="icon" />
        </svg>
      </TrailingIcon>
    </div>
  );
}

function MenuSuperiorTrailingElements({ children }: React.PropsWithChildren<{}>) {
  return (
    <button className="block cursor-pointer relative shrink-0 size-[46px]">
      <TrailingIcon>{children}</TrailingIcon>
    </button>
  );
}

function Helper() {
  return (
    <MenuSuperiorLabelsText text="Texto">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 19">
        <path d={svgPaths.p10382e00} fill="var(--fill-0, #1D1B20)" id="icon" />
      </svg>
    </MenuSuperiorLabelsText>
  );
}
type MenuSuperiorLabelsTextProps = {
  text: string;
};

function MenuSuperiorLabelsText({ text, children }: React.PropsWithChildren<MenuSuperiorLabelsTextProps>) {
  return (
    <div className="bg-white content-stretch flex gap-[10px] h-[46px] items-center justify-center px-[20px] py-[6px] relative shrink-0 w-[250px]">
      <div className="relative shrink-0 size-[20px]" data-name="search">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
          <g clipPath="url(#clip0_6_2388)" id="search">
            <path clipRule="evenodd" d={svgPaths.p18692e80} fill="var(--fill-0, #042E99)" fillRule="evenodd" id="Vector" />
          </g>
          <defs>
            <clipPath id="clip0_6_2388">
              <rect fill="white" height="20" width="20" />
            </clipPath>
          </defs>
        </svg>
      </div>
      <div className="flex flex-[1_0_0] flex-col font-['Figtree:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#333] text-[16px]">
        <p className="leading-[24px]">{text}</p>
      </div>
      <div className="relative shrink-0 size-[30px]" data-name="Trailing-icon-button">
        <Wrapper>
          <div className="absolute inset-[8.33%_20.83%_12.5%_20.83%]" data-name="icon">
            {children}
          </div>
        </Wrapper>
      </div>
    </div>
  );
}

function Content() {
  return (
    <Wrapper1 additionalClassNames="rounded-[12px]">
      <div className="absolute bottom-1/4 left-[12.5%] right-[12.5%] top-1/4" data-name="icon">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 12">
          <path d={svgPaths.p2304a600} fill="var(--fill-0, #1D1B20)" id="icon" />
        </svg>
      </div>
    </Wrapper1>
  );
}

function MenuSuperiorLeadingIcon() {
  return (
    <button className="content-stretch cursor-pointer flex items-center justify-center relative shrink-0 size-[46px]">
      <Content />
    </button>
  );
}
type MenuSuperiorProps = {
  className?: string;
  status?: "aberto" | "fechado" | "app bar perfil" | "menu selected" | "cursos selected" | "portais selected" | "desenvolvimento selected" | "PP selected" | "ajuda selected" | "idioma selected";
};

function MenuSuperior({ className, status = "fechado" }: MenuSuperiorProps) {
  const isAberto = status === "aberto";
  const isAjudaSelected = status === "ajuda selected";
  const isAppBarPerfil = status === "app bar perfil";
  const isAppBarPerfilOrMenuSelected = ["app bar perfil", "menu selected"].includes(status);
  const isAppBarPerfilOrMenuSelectedOrCursosSelectedOrPortaisSelectedOr = ["app bar perfil", "menu selected", "cursos selected", "portais selected", "desenvolvimento selected", "PP selected", "ajuda selected", "idioma selected"].includes(status);
  const isCursosSelected = status === "cursos selected";
  const isCursosSelectedOrPortaisSelectedOrDesenvolvimentoSelectedOrPp = ["cursos selected", "portais selected", "desenvolvimento selected", "PP selected", "ajuda selected", "idioma selected"].includes(status);
  const isDesenvolvimentoSelected = status === "desenvolvimento selected";
  const isFechado = status === "fechado";
  const isIdiomaSelected = status === "idioma selected";
  const isMenuSelected = status === "menu selected";
  const isPortaisSelected = status === "portais selected";
  const isPpSelected = status === "PP selected";
  return (
    <div className={className || `relative w-[402px] ${isFechado ? "bg-[#021b59] h-[70px]" : isAppBarPerfilOrMenuSelectedOrCursosSelectedOrPortaisSelectedOr ? "bg-[#021b59]" : ""}`}>
      <div className={`flex ${isFechado ? "flex-row items-center size-full" : isCursosSelectedOrPortaisSelectedOrDesenvolvimentoSelectedOrPp ? "content-stretch flex-col gap-[10px] items-start pb-[20px] relative w-full" : isAppBarPerfilOrMenuSelected ? "content-stretch flex-col gap-[20px] items-start pb-[20px] relative w-full" : "flex-col items-center justify-center size-full"}`}>
        {isAppBarPerfilOrMenuSelectedOrCursosSelectedOrPortaisSelectedOr && (
          <div className={`bg-[#021b59] h-[70px] relative shrink-0 w-[402px] ${isCursosSelectedOrPortaisSelectedOrDesenvolvimentoSelectedOrPp ? "" : "content-stretch flex items-center justify-between px-[20px] py-[10px]"}`} data-name="Menu Superior">
            {isCursosSelectedOrPortaisSelectedOrDesenvolvimentoSelectedOrPp && (
              <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex items-center justify-between px-[20px] py-[10px] relative size-full">
                  <MenuSuperiorLeadingIcon />
                  <Helper />
                  <MenuSuperiorTrailingElements>
                    <svg fill="none" preserveAspectRatio="none" viewBox="0 0 20 20" className="absolute block size-full">
                      <path d={svgPaths.pe3d9c80} fill="var(--fill-0, #1D1B20)" id="icon" />
                    </svg>
                  </MenuSuperiorTrailingElements>
                </div>
              </div>
            )}
            {isAppBarPerfilOrMenuSelected && (
              <>
                <button className={`content-stretch cursor-pointer flex items-center justify-center relative shrink-0 size-[46px] ${isMenuSelected ? "bg-[#042e99]" : ""}`} data-name="Leading icon">
                  <Content />
                </button>
                <Helper />
                <TrailingElements additionalClassNames="size-[46px]" />
              </>
            )}
          </div>
        )}
        <div className={`content-stretch flex relative ${isFechado ? "items-center justify-between px-[20px] py-[10px] size-full" : isCursosSelectedOrPortaisSelectedOrDesenvolvimentoSelectedOrPp ? "flex-col items-start shrink-0 w-full" : isMenuSelected ? "cursor-pointer flex-col items-start shrink-0 w-full" : isAppBarPerfil ? "flex-col gap-[20px] items-start shrink-0 w-full" : "flex-col items-center justify-center w-full"}`}>
          {["menu selected", "portais selected", "desenvolvimento selected", "PP selected", "ajuda selected", "idioma selected"].includes(status) && (
            <button className={`h-[46px] relative shrink-0 w-full ${["portais selected", "desenvolvimento selected", "PP selected", "ajuda selected", "idioma selected"].includes(status) ? "cursor-pointer" : ""}`} data-name="cursos">
              <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex gap-[15px] items-center px-[30px] relative size-full">
                  <div className="relative shrink-0 size-[24px]" data-name="book">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                      <g id="book">
                        <path d={svgPaths.p240fd300} fill="var(--fill-0, #FFEAC4)" id="Vector" />
                      </g>
                    </svg>
                  </div>
                  <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] text-left w-[189px]">Cursos</p>
                </div>
              </div>
            </button>
          )}
          {["menu selected", "desenvolvimento selected", "PP selected", "ajuda selected", "idioma selected"].includes(status) && (
            <button className={`h-[46px] relative shrink-0 w-full ${["desenvolvimento selected", "PP selected", "ajuda selected", "idioma selected"].includes(status) ? "cursor-pointer" : ""}`} data-name="portais">
              <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex gap-[15px] items-center px-[30px] relative size-full">
                  <div className="relative shrink-0 size-[24px]" data-name="desktop">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                      <g id="desktop">
                        <path clipRule="evenodd" d={svgPaths.p12986e80} fill="var(--fill-0, #FFEAC4)" fillRule="evenodd" id="Vector" />
                      </g>
                    </svg>
                  </div>
                  <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] text-left w-[189px]">Portais</p>
                </div>
              </div>
            </button>
          )}
          {["menu selected", "PP selected", "ajuda selected", "idioma selected"].includes(status) && (
            <button className={`h-[46px] relative shrink-0 w-full ${["PP selected", "ajuda selected", "idioma selected"].includes(status) ? "cursor-pointer" : ""}`} data-name="desenvolvimento">
              <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex gap-[15px] items-center px-[30px] relative size-full">
                  <div className="relative shrink-0 size-[24px]" data-name="sitemap">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                      <g id="sitemap">
                        <path d={svgPaths.p3d982070} fill="var(--fill-0, #FFEAC4)" id="Vector" />
                      </g>
                    </svg>
                  </div>
                  <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] text-left w-[189px]">Desenvolvimento</p>
                </div>
              </div>
            </button>
          )}
          {["menu selected", "ajuda selected", "idioma selected"].includes(status) && (
            <button className={`h-[46px] relative shrink-0 w-full ${["ajuda selected", "idioma selected"].includes(status) ? "cursor-pointer" : ""}`} data-name="PP">
              <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex gap-[15px] items-center px-[30px] relative size-full">
                  <div className="relative shrink-0 size-[24px]" data-name="lock">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                      <g id="lock">
                        <path clipRule="evenodd" d={svgPaths.p230ab480} fill="var(--fill-0, #FFEAC4)" fillRule="evenodd" id="Vector" />
                      </g>
                    </svg>
                  </div>
                  <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] text-left w-[189px]">Política de privacidade</p>
                </div>
              </div>
            </button>
          )}
          {["menu selected", "idioma selected"].includes(status) && (
            <button className={`h-[46px] relative shrink-0 w-full ${isIdiomaSelected ? "cursor-pointer" : ""}`} data-name="ajuda">
              <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex gap-[15px] items-center px-[30px] relative size-full">
                  <div className="relative shrink-0 size-[24px]" data-name="info">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                      <g id="info">
                        <path d={svgPaths.p34f77440} fill="var(--fill-0, #FFEAC4)" id="Vector" />
                      </g>
                    </svg>
                  </div>
                  <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] text-left w-[189px]">Ajuda</p>
                </div>
              </div>
            </button>
          )}
          {isAberto && (
            <>
              <div className="bg-[#021b59] content-stretch flex h-[70px] items-center justify-between px-[20px] py-[10px] relative shrink-0 w-[402px]" data-name="Menu Superior">
                <MenuSuperiorLeadingIcon />
                <Helper />
                <TrailingElements additionalClassNames="size-[48px]" />
              </div>
              <div className="bg-white content-stretch cursor-pointer flex flex-col h-[192px] items-start overflow-clip relative shrink-0 w-[250px]" data-name="list">
                <button className="content-stretch flex flex-col items-start justify-center min-h-[48px] overflow-clip relative rounded-[4px] shrink-0 w-full" data-name="List item 1">
                  <div className="relative rounded-[12px] shrink-0 w-full" data-name="State layer">
                    <div className="flex flex-row items-center size-full">
                      <div className="content-stretch flex gap-[12px] isolate items-center px-[16px] py-[10px] relative w-full">
                        <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 z-[2]" data-name="Leading element">
                          <div className="overflow-clip relative rounded-[100px] shrink-0 size-[40px]" data-name="Avatar">
                            <div className="absolute inset-0 rounded-[400px]" data-name="Image">
                              <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[400px]">
                                <div className="absolute bg-[#ece6f0] inset-0 rounded-[400px]" />
                                <img alt="" className="absolute max-w-none mix-blend-luminosity object-contain rounded-[400px] size-full" src={imgImage} />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="content-stretch flex flex-[1_0_0] flex-col font-['Figtree:Regular',sans-serif] font-normal items-start justify-center min-h-[32px] min-w-px relative text-left z-[1]" data-name="Content">
                          <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-[#1d1b20] text-[16px] w-full">
                            <p className="leading-[24px]">História do Design</p>
                          </div>
                          <p className="h-[20px] leading-[20px] overflow-hidden relative shrink-0 text-[#49454f] text-[14px] text-ellipsis tracking-[0.25px] w-full whitespace-nowrap">Carga horária: 64h</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
                <button className="content-stretch flex flex-col items-start justify-center min-h-[48px] overflow-clip relative rounded-[4px] shrink-0 w-full" data-name="List item 2">
                  <div className="relative rounded-[12px] shrink-0 w-full" data-name="State layer">
                    <div className="flex flex-row items-center size-full">
                      <div className="content-stretch flex gap-[12px] isolate items-center px-[16px] py-[10px] relative w-full">
                        <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 z-[3]" data-name="Leading element">
                          <div className="overflow-clip relative rounded-[100px] shrink-0 size-[40px]" data-name="Avatar">
                            <div className="absolute inset-0 rounded-[400px]" data-name="Image">
                              <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[400px]">
                                <div className="absolute bg-[#ece6f0] inset-0 rounded-[400px]" />
                                <img alt="" className="absolute max-w-none mix-blend-luminosity object-contain rounded-[400px] size-full" src={imgImage} />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="content-stretch flex flex-[1_0_0] flex-col font-['Figtree:Regular',sans-serif] font-normal items-start justify-center min-h-[32px] min-w-px relative text-left z-[2]" data-name="Content">
                          <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-[#1d1b20] text-[16px] w-full">
                            <p className="leading-[24px]">Matemática básica</p>
                          </div>
                          <p className="h-[20px] leading-[20px] overflow-hidden relative shrink-0 text-[#49454f] text-[14px] text-ellipsis tracking-[0.25px] w-full whitespace-nowrap">Carga horária: 36h</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
                <button className="content-stretch flex flex-col items-start justify-center min-h-[48px] overflow-clip relative rounded-[4px] shrink-0 w-full" data-name="List item 3">
                  <div className="relative rounded-[12px] shrink-0 w-full" data-name="State layer">
                    <div className="flex flex-row items-center size-full">
                      <div className="content-stretch flex gap-[12px] isolate items-center px-[16px] py-[10px] relative w-full">
                        <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 z-[3]" data-name="Leading element">
                          <div className="overflow-clip relative rounded-[100px] shrink-0 size-[40px]" data-name="Avatar">
                            <div className="absolute inset-0 rounded-[400px]" data-name="Image">
                              <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[400px]">
                                <div className="absolute bg-[#ece6f0] inset-0 rounded-[400px]" />
                                <img alt="" className="absolute max-w-none mix-blend-luminosity object-contain rounded-[400px] size-full" src={imgImage} />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="content-stretch flex flex-[1_0_0] flex-col font-['Figtree:Regular',sans-serif] font-normal items-start justify-center min-h-[32px] min-w-px relative text-left z-[2]" data-name="Content">
                          <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-[#1d1b20] text-[16px] w-full">
                            <p className="leading-[24px]">Excel Iniciante</p>
                          </div>
                          <p className="h-[20px] leading-[20px] overflow-hidden relative shrink-0 text-[#49454f] text-[14px] text-ellipsis tracking-[0.25px] w-full whitespace-nowrap">Carga horária: 24h</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </>
          )}
          {isAppBarPerfil && (
            <>
              <div className="relative shrink-0 w-full">
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="content-stretch flex items-center justify-center px-[30px] relative w-full">
                    <p className="flex-[1_0_0] font-['Figtree:Medium',sans-serif] font-medium h-[28.75px] leading-[30px] min-h-px min-w-px relative text-[#ffeac4] text-[20px]">Eduardo Marinho</p>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                <div className="h-[46px] relative shrink-0 w-full">
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex gap-[15px] items-center px-[30px] relative size-full">
                      <div className="h-[23px] relative shrink-0 w-[24px]" data-name="smile">
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 23">
                          <g id="smile">
                            <path clipRule="evenodd" d={svgPaths.pcbe86f0} fill="var(--fill-0, #FFEAC4)" fillRule="evenodd" id="Vector" />
                          </g>
                        </svg>
                      </div>
                      <p className="font-['Figtree:Regular',sans-serif] font-normal h-[23px] leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] w-[42px]">Perfil</p>
                    </div>
                  </div>
                </div>
                <div className="h-[46px] relative shrink-0 w-full">
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex gap-[15px] items-center px-[30px] relative size-full">
                      <div className="h-[23px] relative shrink-0 w-[24px]" data-name="logout">
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 23">
                          <g id="logout">
                            <path clipRule="evenodd" d={svgPaths.pcbd3400} fill="var(--fill-0, #FFEAC4)" fillRule="evenodd" id="Vector" />
                          </g>
                        </svg>
                      </div>
                      <p className="font-['Figtree:Regular',sans-serif] font-normal h-[23px] leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] w-[34px]">Sair</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {isMenuSelected && (
            <button className="h-[46px] relative shrink-0 w-full" data-name="idioma">
              <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex gap-[15px] items-center px-[30px] relative size-full">
                  <div className="relative shrink-0 size-[24px]" data-name="comment-o">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                      <g id="comment-o">
                        <path d={svgPaths.p20701600} fill="var(--fill-0, #FFEAC4)" id="Vector" />
                      </g>
                    </svg>
                  </div>
                  <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] text-left w-[189px]">Idioma</p>
                </div>
              </div>
            </button>
          )}
          {isCursosSelected && (
            <>
              <div className="bg-[#ffeac4] h-[46px] relative shrink-0 w-full" data-name="cursos">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[15px] items-center px-[30px] relative size-full">
                    <div className="relative shrink-0 size-[24px]" data-name="book">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                        <g id="book">
                          <path d={svgPaths.p240fd300} fill="var(--fill-0, #021B59)" id="Vector" />
                        </g>
                      </svg>
                    </div>
                    <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#021b59] text-[16px] w-[189px]">Cursos</p>
                  </div>
                </div>
              </div>
              <button className="cursor-pointer h-[46px] relative shrink-0 w-full" data-name="portais">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[15px] items-center px-[30px] relative size-full">
                    <div className="relative shrink-0 size-[24px]" data-name="desktop">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                        <g id="desktop">
                          <path clipRule="evenodd" d={svgPaths.p12986e80} fill="var(--fill-0, #FFEAC4)" fillRule="evenodd" id="Vector" />
                        </g>
                      </svg>
                    </div>
                    <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] text-left w-[189px]">Portais</p>
                  </div>
                </div>
              </button>
              <button className="cursor-pointer h-[46px] relative shrink-0 w-full" data-name="desenvolvimento">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[15px] items-center px-[30px] relative size-full">
                    <div className="relative shrink-0 size-[24px]" data-name="sitemap">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                        <g id="sitemap">
                          <path d={svgPaths.p3d982070} fill="var(--fill-0, #FFEAC4)" id="Vector" />
                        </g>
                      </svg>
                    </div>
                    <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] text-left w-[189px]">Desenvolvimento</p>
                  </div>
                </div>
              </button>
              <button className="cursor-pointer h-[46px] relative shrink-0 w-full" data-name="PP">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[15px] items-center px-[30px] relative size-full">
                    <div className="relative shrink-0 size-[24px]" data-name="lock">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                        <g id="lock">
                          <path clipRule="evenodd" d={svgPaths.p230ab480} fill="var(--fill-0, #FFEAC4)" fillRule="evenodd" id="Vector" />
                        </g>
                      </svg>
                    </div>
                    <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] text-left w-[189px]">Política de privacidade</p>
                  </div>
                </div>
              </button>
              <button className="cursor-pointer h-[46px] relative shrink-0 w-full" data-name="ajuda">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[15px] items-center px-[30px] relative size-full">
                    <div className="relative shrink-0 size-[24px]" data-name="info">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                        <g id="info">
                          <path d={svgPaths.p34f77440} fill="var(--fill-0, #FFEAC4)" id="Vector" />
                        </g>
                      </svg>
                    </div>
                    <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] text-left w-[189px]">Ajuda</p>
                  </div>
                </div>
              </button>
              <button className="cursor-pointer h-[46px] relative shrink-0 w-full" data-name="idioma">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[15px] items-center px-[30px] relative size-full">
                    <div className="relative shrink-0 size-[24px]" data-name="comment-o">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                        <g id="comment-o">
                          <path d={svgPaths.p20701600} fill="var(--fill-0, #FFEAC4)" id="Vector" />
                        </g>
                      </svg>
                    </div>
                    <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] text-left w-[189px]">Idioma</p>
                  </div>
                </div>
              </button>
            </>
          )}
          {isPortaisSelected && (
            <>
              <div className="bg-[#ffeac4] h-[46px] relative shrink-0 w-full" data-name="portais">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[15px] items-center px-[30px] relative size-full">
                    <div className="relative shrink-0 size-[24px]" data-name="desktop">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                        <g id="desktop">
                          <path clipRule="evenodd" d={svgPaths.p12986e80} fill="var(--fill-0, #021B59)" fillRule="evenodd" id="Vector" />
                        </g>
                      </svg>
                    </div>
                    <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#021b59] text-[16px] w-[189px]">Portais</p>
                  </div>
                </div>
              </div>
              <button className="cursor-pointer h-[46px] relative shrink-0 w-full" data-name="desenvolvimento">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[15px] items-center px-[30px] relative size-full">
                    <div className="relative shrink-0 size-[24px]" data-name="sitemap">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                        <g id="sitemap">
                          <path d={svgPaths.p3d982070} fill="var(--fill-0, #FFEAC4)" id="Vector" />
                        </g>
                      </svg>
                    </div>
                    <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] text-left w-[189px]">Desenvolvimento</p>
                  </div>
                </div>
              </button>
              <button className="cursor-pointer h-[46px] relative shrink-0 w-full" data-name="PP">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[15px] items-center px-[30px] relative size-full">
                    <div className="relative shrink-0 size-[24px]" data-name="lock">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                        <g id="lock">
                          <path clipRule="evenodd" d={svgPaths.p230ab480} fill="var(--fill-0, #FFEAC4)" fillRule="evenodd" id="Vector" />
                        </g>
                      </svg>
                    </div>
                    <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] text-left w-[189px]">Política de privacidade</p>
                  </div>
                </div>
              </button>
              <button className="cursor-pointer h-[46px] relative shrink-0 w-full" data-name="ajuda">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[15px] items-center px-[30px] relative size-full">
                    <div className="relative shrink-0 size-[24px]" data-name="info">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                        <g id="info">
                          <path d={svgPaths.p34f77440} fill="var(--fill-0, #FFEAC4)" id="Vector" />
                        </g>
                      </svg>
                    </div>
                    <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] text-left w-[189px]">Ajuda</p>
                  </div>
                </div>
              </button>
              <button className="cursor-pointer h-[46px] relative shrink-0 w-full" data-name="idioma">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[15px] items-center px-[30px] relative size-full">
                    <div className="relative shrink-0 size-[24px]" data-name="comment-o">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                        <g id="comment-o">
                          <path d={svgPaths.p20701600} fill="var(--fill-0, #FFEAC4)" id="Vector" />
                        </g>
                      </svg>
                    </div>
                    <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] text-left w-[189px]">Idioma</p>
                  </div>
                </div>
              </button>
            </>
          )}
          {isDesenvolvimentoSelected && (
            <>
              <div className="bg-[#ffeac4] h-[46px] relative shrink-0 w-full" data-name="desenvolvimento">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[15px] items-center px-[30px] relative size-full">
                    <div className="relative shrink-0 size-[24px]" data-name="sitemap">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                        <g id="sitemap">
                          <path d={svgPaths.p3d982070} fill="var(--fill-0, #021B59)" id="Vector" />
                        </g>
                      </svg>
                    </div>
                    <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#021b59] text-[16px] w-[189px]">Desenvolvimento</p>
                  </div>
                </div>
              </div>
              <button className="cursor-pointer h-[46px] relative shrink-0 w-full" data-name="PP">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[15px] items-center px-[30px] relative size-full">
                    <div className="relative shrink-0 size-[24px]" data-name="lock">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                        <g id="lock">
                          <path clipRule="evenodd" d={svgPaths.p230ab480} fill="var(--fill-0, #FFEAC4)" fillRule="evenodd" id="Vector" />
                        </g>
                      </svg>
                    </div>
                    <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] text-left w-[189px]">Política de privacidade</p>
                  </div>
                </div>
              </button>
              <button className="cursor-pointer h-[46px] relative shrink-0 w-full" data-name="ajuda">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[15px] items-center px-[30px] relative size-full">
                    <div className="relative shrink-0 size-[24px]" data-name="info">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                        <g id="info">
                          <path d={svgPaths.p34f77440} fill="var(--fill-0, #FFEAC4)" id="Vector" />
                        </g>
                      </svg>
                    </div>
                    <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] text-left w-[189px]">Ajuda</p>
                  </div>
                </div>
              </button>
              <button className="cursor-pointer h-[46px] relative shrink-0 w-full" data-name="idioma">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[15px] items-center px-[30px] relative size-full">
                    <div className="relative shrink-0 size-[24px]" data-name="comment-o">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                        <g id="comment-o">
                          <path d={svgPaths.p20701600} fill="var(--fill-0, #FFEAC4)" id="Vector" />
                        </g>
                      </svg>
                    </div>
                    <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] text-left w-[189px]">Idioma</p>
                  </div>
                </div>
              </button>
            </>
          )}
          {isPpSelected && (
            <>
              <div className="bg-[#ffeac4] h-[46px] relative shrink-0 w-full" data-name="PP">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[15px] items-center px-[30px] relative size-full">
                    <div className="relative shrink-0 size-[24px]" data-name="lock">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                        <g id="lock">
                          <path clipRule="evenodd" d={svgPaths.p230ab480} fill="var(--fill-0, #021B59)" fillRule="evenodd" id="Vector" />
                        </g>
                      </svg>
                    </div>
                    <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#021b59] text-[16px] w-[189px]">Política de privacidade</p>
                  </div>
                </div>
              </div>
              <button className="cursor-pointer h-[46px] relative shrink-0 w-full" data-name="ajuda">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[15px] items-center px-[30px] relative size-full">
                    <div className="relative shrink-0 size-[24px]" data-name="info">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                        <g id="info">
                          <path d={svgPaths.p34f77440} fill="var(--fill-0, #FFEAC4)" id="Vector" />
                        </g>
                      </svg>
                    </div>
                    <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] text-left w-[189px]">Ajuda</p>
                  </div>
                </div>
              </button>
              <button className="cursor-pointer h-[46px] relative shrink-0 w-full" data-name="idioma">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[15px] items-center px-[30px] relative size-full">
                    <div className="relative shrink-0 size-[24px]" data-name="comment-o">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                        <g id="comment-o">
                          <path d={svgPaths.p20701600} fill="var(--fill-0, #FFEAC4)" id="Vector" />
                        </g>
                      </svg>
                    </div>
                    <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] text-left w-[189px]">Idioma</p>
                  </div>
                </div>
              </button>
            </>
          )}
          {isAjudaSelected && (
            <>
              <div className="bg-[#ffeac4] h-[46px] relative shrink-0 w-full" data-name="ajuda">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[15px] items-center px-[30px] relative size-full">
                    <div className="relative shrink-0 size-[24px]" data-name="info">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                        <g id="info">
                          <path d={svgPaths.p34f77440} fill="var(--fill-0, #021B59)" id="Vector" />
                        </g>
                      </svg>
                    </div>
                    <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#021b59] text-[16px] w-[189px]">Ajuda</p>
                  </div>
                </div>
              </div>
              <button className="cursor-pointer h-[46px] relative shrink-0 w-full" data-name="idioma">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[15px] items-center px-[30px] relative size-full">
                    <div className="relative shrink-0 size-[24px]" data-name="comment-o">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                        <g id="comment-o">
                          <path d={svgPaths.p20701600} fill="var(--fill-0, #FFEAC4)" id="Vector" />
                        </g>
                      </svg>
                    </div>
                    <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] text-left w-[189px]">Idioma</p>
                  </div>
                </div>
              </button>
            </>
          )}
          {isIdiomaSelected && (
            <div className="bg-[#ffeac4] h-[46px] relative shrink-0 w-full" data-name="idioma">
              <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex gap-[15px] items-center px-[30px] relative size-full">
                  <div className="relative shrink-0 size-[24px]" data-name="comment-o">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                      <g id="comment-o">
                        <path d={svgPaths.p20701600} fill="var(--fill-0, #021B59)" id="Vector" />
                      </g>
                    </svg>
                  </div>
                  <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#021b59] text-[16px] w-[189px]">Idioma</p>
                </div>
              </div>
            </div>
          )}
          {isFechado && (
            <>
              <button className="content-stretch cursor-pointer flex items-center justify-center relative shrink-0 size-[46px]" data-name="Leading icon">
                <Wrapper1 additionalClassNames="rounded-[12px]">
                  <div className="absolute bottom-1/4 left-[12.5%] right-[12.5%] top-1/4" data-name="icon">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 12">
                      <path d={svgPaths.p2304a600} fill="var(--fill-0, #FFEAC4)" id="icon" />
                    </svg>
                  </div>
                </Wrapper1>
              </button>
              <MenuSuperiorLabelsText text="Texto">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 19">
                  <path d={svgPaths.p10382e00} fill="var(--fill-0, #042E99)" id="icon" />
                </svg>
              </MenuSuperiorLabelsText>
              <MenuSuperiorTrailingElements>
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                  <path d={svgPaths.pe3d9c80} fill="var(--fill-0, #FFEAC4)" id="icon" />
                </svg>
              </MenuSuperiorTrailingElements>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CursoPowerBi() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[19px] items-center pb-[120px] pt-[70px] px-[20px] relative size-full" data-name="Curso power bi">
      <div className="h-[218px] relative shrink-0 w-[402px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgRectangle9} />
      </div>
      <div className="content-stretch flex flex-col gap-[30px] items-start relative shrink-0 text-black w-[362px]">
        <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
          <p className="font-['Figtree:Bold',sans-serif] font-bold leading-[36px] relative shrink-0 text-[24px] w-full">Power BI - Fundamentos</p>
          <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[20px] w-full">{`Carga horária: 30h `}</p>
        </div>
        <div className="content-stretch flex flex-col gap-[26px] items-start relative shrink-0 text-[16px] w-full">
          <div className="content-stretch flex flex-col gap-[16px] items-start leading-[24px] relative shrink-0 w-full">
            <p className="font-['Figtree:Bold',sans-serif] font-bold relative shrink-0 w-full">Sobre o curso</p>
            <p className="font-['Figtree:Regular',sans-serif] font-normal relative shrink-0 w-full">O curso Power BI Fundamentos tem como objetivo introduzir os participantes aos conceitos essenciais de análise de dados e Business Intelligence utilizando o Microsoft Power BI. Ao longo do curso, os alunos aprendem a transformar dados brutos em informações estratégicas por meio da criação de relatórios interativos e dashboards dinâmicos.</p>
          </div>
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
            <p className="font-['Figtree:Bold',sans-serif] font-bold leading-[24px] relative shrink-0 w-full">O que você irá aprender?</p>
            <div className="font-['Figtree:Regular',sans-serif] font-normal leading-[0] relative shrink-0 w-full whitespace-pre-wrap">
              <p className="leading-[24px] mb-0">Serão abordados temas como:</p>
              <p className="leading-[24px] mb-0">&nbsp;</p>
              <ul className="list-disc mb-0">
                <li className="mb-0 ms-[24px]">
                  <span className="leading-[24px]">Conceitos básicos de Business Intelligence e análise de dados</span>
                </li>
                <li className="mb-0 ms-[24px]">
                  <span className="leading-[24px]">Interface e principais recursos do Power BI</span>
                </li>
                <li className="mb-0 ms-[24px]">
                  <span className="leading-[24px]">Importação e tratamento de dados (Power Query)</span>
                </li>
                <li className="mb-0 ms-[24px]">
                  <span className="leading-[24px]">Modelagem de dados e criação de relacionamentos</span>
                </li>
                <li className="mb-0 ms-[24px]">
                  <span className="leading-[24px]">Introdução à linguagem DAX para cálculos e métricas</span>
                </li>
                <li className="mb-0 ms-[24px]">
                  <span className="leading-[24px]">Criação de gráficos, tabelas e visualizações interativas</span>
                </li>
                <li className="ms-[24px]">
                  <span className="leading-[24px]">Publicação e compartilhamento de relatórios</span>
                </li>
              </ul>
              <p className="leading-[24px] mb-0">&nbsp;</p>
              <p className="leading-[24px]">Ao final do curso, o participante será capaz de conectar diferentes fontes de dados, estruturar modelos analíticos e desenvolver painéis que apoiem a tomada de decisão nas organizações.</p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[16px] items-start leading-[24px] relative shrink-0 w-full">
            <p className="font-['Figtree:Bold',sans-serif] font-bold relative shrink-0 w-full">Pré-requisitos</p>
            <p className="font-['Figtree:Regular',sans-serif] font-normal relative shrink-0 w-full">Conhecimentos básicos de informática e noções de planilhas eletrônicas são recomendados, mas não obrigatórios.</p>
          </div>
          <div className="content-stretch flex flex-col gap-[16px] items-start leading-[24px] relative shrink-0 w-full">
            <p className="font-['Figtree:Bold',sans-serif] font-bold relative shrink-0 w-full">Público-alvo</p>
            <p className="font-['Figtree:Regular',sans-serif] font-normal relative shrink-0 w-full">Estudantes, profissionais de diversas áreas, analistas iniciantes e todos que desejam iniciar na área de análise de dados.</p>
          </div>
        </div>
      </div>
      <div className="absolute content-stretch flex flex-col items-start left-0 top-0 w-[402px]">
        <MenuSuperior className="bg-[#021b59] h-[70px] relative shrink-0 w-full" />
      </div>
      <div className="absolute bg-white bottom-[4px] content-stretch flex flex-col items-center justify-center left-[2px] px-[18px] py-[16px] shadow-[0px_0px_12px_0px_rgba(51,51,51,0.2)]">
        <div className="bg-[#ffeac4] h-[50px] relative shrink-0 w-[360px]" data-name="Botão">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center py-[10px] relative size-full">
              <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[#333] text-[20px] text-center whitespace-nowrap">Inscrever-se</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}