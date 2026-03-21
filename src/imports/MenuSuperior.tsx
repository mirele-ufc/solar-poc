import clsx from "clsx";
import svgPaths from "./svg-3imqnb48ew";
import imgImage from "figma:asset/054dfe02e425078fdd66113858fbed2e929f9c10.png";

function MenuSuperiorHelper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="h-[23px] relative shrink-0 w-[24px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 23">
        {children}
      </svg>
    </div>
  );
}

function Wrapper5({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        {children}
      </svg>
    </div>
  );
}

function Wrapper4({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="flex flex-row items-center size-full">
      <div className="content-stretch flex gap-[15px] items-center px-[30px] relative size-full">{children}</div>
    </div>
  );
}
type Wrapper3Props = {
  additionalClassNames?: string;
};

function Wrapper3({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper3Props>) {
  return (
    <div className={clsx("h-[46px] relative shrink-0 w-full", additionalClassNames)}>
      <Wrapper4>{children}</Wrapper4>
    </div>
  );
}

function MenuSuperiorBook({ children }: React.PropsWithChildren<{}>) {
  return (
    <Wrapper5>
      <g id="book">{children}</g>
    </Wrapper5>
  );
}

function Desktop({ children }: React.PropsWithChildren<{}>) {
  return (
    <Wrapper5>
      <g id="desktop">{children}</g>
    </Wrapper5>
  );
}

function Sitemap({ children }: React.PropsWithChildren<{}>) {
  return (
    <Wrapper5>
      <g id="sitemap">{children}</g>
    </Wrapper5>
  );
}

function Lock({ children }: React.PropsWithChildren<{}>) {
  return (
    <Wrapper5>
      <g id="lock">{children}</g>
    </Wrapper5>
  );
}

function Info({ children }: React.PropsWithChildren<{}>) {
  return (
    <Wrapper5>
      <g id="info">{children}</g>
    </Wrapper5>
  );
}

function CommentO({ children }: React.PropsWithChildren<{}>) {
  return (
    <Wrapper5>
      <g id="comment-o">{children}</g>
    </Wrapper5>
  );
}
type Wrapper2Props = {
  additionalClassNames?: string;
};

function Wrapper2({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper2Props>) {
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

function ListItem({ children }: React.PropsWithChildren<{}>) {
  return (
    <button className="content-stretch flex flex-col items-start justify-center min-h-[48px] overflow-clip relative rounded-[4px] shrink-0 w-full">
      <div className="relative rounded-[12px] shrink-0 w-full" data-name="State layer">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[12px] isolate items-center px-[16px] py-[10px] relative w-full">{children}</div>
        </div>
      </div>
    </button>
  );
}

function Content({ children }: React.PropsWithChildren<{}>) {
  return (
    <Wrapper2 additionalClassNames="rounded-[12px]">
      <div className="absolute bottom-1/4 left-[12.5%] right-[12.5%] top-1/4" data-name="icon">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 12">
          {children}
        </svg>
      </div>
    </Wrapper2>
  );
}

function Wrapper1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="flex flex-row items-center justify-center size-full">
      <div className="content-stretch flex items-center justify-center relative size-full">
        <Wrapper2 additionalClassNames="rounded-[100px]">{children}</Wrapper2>
      </div>
    </div>
  );
}

function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <Wrapper1>
      <div className="absolute inset-[8.33%]" data-name="icon">
        {children}
      </div>
    </Wrapper1>
  );
}
type MenuSuperiorIdiomaTextProps = {
  text: string;
  additionalClassNames?: string;
};

function MenuSuperiorIdiomaText({ text, additionalClassNames = "" }: MenuSuperiorIdiomaTextProps) {
  return (
    <button className={clsx("h-[46px] relative shrink-0 w-full", additionalClassNames)}>
      <Wrapper4>
        <CommentO>
          <path d={svgPaths.p20701600} fill="var(--fill-0, #FFEAC4)" id="Vector" />
        </CommentO>
        <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] text-left w-[189px]">{text}</p>
      </Wrapper4>
    </button>
  );
}
type HelperbuttonContentProps = {
  text: string;
  text1: string;
  additionalClassNames?: string;
};

function HelperbuttonContent({ text, text1, additionalClassNames = "" }: HelperbuttonContentProps) {
  return (
    <div className={clsx("content-stretch flex flex-[1_0_0] flex-col font-['Figtree:Regular',sans-serif] font-normal items-start justify-center min-h-[32px] min-w-px relative text-left", additionalClassNames)}>
      <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-[#1d1b20] text-[16px] w-full">
        <p className="leading-[24px]">{text}</p>
      </div>
      <p className="h-[20px] leading-[20px] overflow-hidden relative shrink-0 text-[#49454f] text-[14px] text-ellipsis tracking-[0.25px] w-full whitespace-nowrap">{text1}</p>
    </div>
  );
}
type HelperbuttonLeadingElementImageProps = {
  additionalClassNames?: string;
};

function HelperbuttonLeadingElementImage({ additionalClassNames = "" }: HelperbuttonLeadingElementImageProps) {
  return (
    <div className={clsx("content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0", additionalClassNames)}>
      <div className="overflow-clip relative rounded-[100px] shrink-0 size-[40px]" data-name="Avatar">
        <div className="absolute inset-0 rounded-[400px]" data-name="Image">
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[400px]">
            <div className="absolute bg-[#ece6f0] inset-0 rounded-[400px]" />
            <img alt="" className="absolute max-w-none mix-blend-luminosity object-contain rounded-[400px] size-full" src={imgImage} />
          </div>
        </div>
      </div>
    </div>
  );
}
type HelperbuttonText3Props = {
  text: string;
};

function HelperbuttonText3({ text }: HelperbuttonText3Props) {
  return (
    <Wrapper4>
      <Info>
        <path d={svgPaths.p34f77440} fill="var(--fill-0, #FFEAC4)" id="Vector" />
      </Info>
      <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] text-left w-[189px]">{text}</p>
    </Wrapper4>
  );
}
type HelperbuttonText2Props = {
  text: string;
};

function HelperbuttonText2({ text }: HelperbuttonText2Props) {
  return (
    <Wrapper4>
      <Lock>
        <path clipRule="evenodd" d={svgPaths.p230ab480} fill="var(--fill-0, #FFEAC4)" fillRule="evenodd" id="Vector" />
      </Lock>
      <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] text-left w-[189px]">{text}</p>
    </Wrapper4>
  );
}
type HelperbuttonText1Props = {
  text: string;
};

function HelperbuttonText1({ text }: HelperbuttonText1Props) {
  return (
    <Wrapper4>
      <Sitemap>
        <path d={svgPaths.p3d982070} fill="var(--fill-0, #FFEAC4)" id="Vector" />
      </Sitemap>
      <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] text-left w-[189px]">{text}</p>
    </Wrapper4>
  );
}
type HelperbuttonTextProps = {
  text: string;
};

function HelperbuttonText({ text }: HelperbuttonTextProps) {
  return (
    <Wrapper4>
      <Desktop>
        <path clipRule="evenodd" d={svgPaths.p12986e80} fill="var(--fill-0, #FFEAC4)" fillRule="evenodd" id="Vector" />
      </Desktop>
      <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] text-left w-[189px]">{text}</p>
    </Wrapper4>
  );
}
type MenuSuperiorTrailingElementsProps = {
  additionalClassNames?: string;
};

function MenuSuperiorTrailingElements({ children, additionalClassNames = "" }: React.PropsWithChildren<MenuSuperiorTrailingElementsProps>) {
  return (
    <div className={clsx("relative shrink-0", additionalClassNames)}>
      <div className="absolute left-0 size-[48px] top-0" data-name="Trailing icon">
        <Wrapper>
          <svg fill="none" preserveAspectRatio="none" viewBox="0 0 20 20" className="absolute block size-full">
            <path d={svgPaths.pe3d9c80} fill="var(--fill-0, #1D1B20)" id="icon" />
          </svg>
        </Wrapper>
      </div>
    </div>
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
        <Wrapper1>
          <div className="absolute inset-[8.33%_20.83%_12.5%_20.83%]" data-name="icon">
            {children}
          </div>
        </Wrapper1>
      </div>
    </div>
  );
}

function MenuSuperiorLeadingIcon() {
  return (
    <button className="content-stretch cursor-pointer flex items-center justify-center relative shrink-0 size-[46px]">
      <Content>
        <path d={svgPaths.p2304a600} fill="var(--fill-0, #1D1B20)" id="icon" />
      </Content>
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
                  <MenuSuperiorTrailingElements additionalClassNames="size-[46px]" />
                </div>
              </div>
            )}
            {isAppBarPerfilOrMenuSelected && (
              <>
                <button className={`content-stretch cursor-pointer flex items-center justify-center relative shrink-0 size-[46px] ${isMenuSelected ? "bg-[#042e99]" : ""}`} data-name="Leading icon">
                  <Content>
                    <path d={svgPaths.p2304a600} fill="var(--fill-0, #FFEAC4)" id="icon" />
                  </Content>
                </button>
                <MenuSuperiorLabelsText text="Texto">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 19">
                    <path d={svgPaths.p10382e00} fill="var(--fill-0, #042E99)" id="icon" />
                  </svg>
                </MenuSuperiorLabelsText>
                <div className="relative shrink-0 size-[46px]" data-name="Trailing elements">
                  <div className={`absolute left-0 size-[48px] top-0 ${isMenuSelected ? "" : "bg-[#042e99]"}`} data-name="Trailing icon">
                    <Wrapper>
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                        <path d={svgPaths.pe3d9c80} fill="var(--fill-0, #FFEAC4)" id="icon" />
                      </svg>
                    </Wrapper>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        <div className={`content-stretch flex relative ${isFechado ? "items-center justify-between px-[20px] py-[10px] size-full" : isCursosSelectedOrPortaisSelectedOrDesenvolvimentoSelectedOrPp ? "flex-col items-start shrink-0 w-full" : isMenuSelected ? "cursor-pointer flex-col items-start shrink-0 w-full" : isAppBarPerfil ? "flex-col gap-[20px] items-start shrink-0 w-full" : "flex-col items-center justify-center w-full"}`}>
          {["menu selected", "portais selected", "desenvolvimento selected", "PP selected", "ajuda selected", "idioma selected"].includes(status) && (
            <button className={`h-[46px] relative shrink-0 w-full ${["portais selected", "desenvolvimento selected", "PP selected", "ajuda selected", "idioma selected"].includes(status) ? "cursor-pointer" : ""}`} data-name="cursos">
              <Wrapper4>
                <MenuSuperiorBook>
                  <path d={svgPaths.p240fd300} fill="var(--fill-0, #FFEAC4)" id="Vector" />
                </MenuSuperiorBook>
                <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] text-left w-[189px]">Cursos</p>
              </Wrapper4>
            </button>
          )}
          {["menu selected", "desenvolvimento selected", "PP selected", "ajuda selected", "idioma selected"].includes(status) && (
            <button className={`h-[46px] relative shrink-0 w-full ${["desenvolvimento selected", "PP selected", "ajuda selected", "idioma selected"].includes(status) ? "cursor-pointer" : ""}`} data-name="portais">
              <HelperbuttonText text="Portais" />
            </button>
          )}
          {["menu selected", "PP selected", "ajuda selected", "idioma selected"].includes(status) && (
            <button className={`h-[46px] relative shrink-0 w-full ${["PP selected", "ajuda selected", "idioma selected"].includes(status) ? "cursor-pointer" : ""}`} data-name="desenvolvimento">
              <HelperbuttonText1 text="Desenvolvimento" />
            </button>
          )}
          {["menu selected", "ajuda selected", "idioma selected"].includes(status) && (
            <button className={`h-[46px] relative shrink-0 w-full ${["ajuda selected", "idioma selected"].includes(status) ? "cursor-pointer" : ""}`} data-name="PP">
              <HelperbuttonText2 text="Política de privacidade" />
            </button>
          )}
          {["menu selected", "idioma selected"].includes(status) && (
            <button className={`h-[46px] relative shrink-0 w-full ${isIdiomaSelected ? "cursor-pointer" : ""}`} data-name="ajuda">
              <HelperbuttonText3 text="Ajuda" />
            </button>
          )}
          {isAberto && (
            <>
              <div className="bg-[#021b59] content-stretch flex h-[70px] items-center justify-between px-[20px] py-[10px] relative shrink-0 w-[402px]" data-name="Menu Superior">
                <MenuSuperiorLeadingIcon />
                <Helper />
                <MenuSuperiorTrailingElements additionalClassNames="size-[48px]" />
              </div>
              <div className="bg-white content-stretch cursor-pointer flex flex-col h-[192px] items-start overflow-clip relative shrink-0 w-[250px]" data-name="list">
                <ListItem>
                  <HelperbuttonLeadingElementImage additionalClassNames="z-[2]" />
                  <HelperbuttonContent text="História do Design" text1="Carga horária: 64h" additionalClassNames="z-[1]" />
                </ListItem>
                <ListItem>
                  <HelperbuttonLeadingElementImage additionalClassNames="z-[3]" />
                  <HelperbuttonContent text="Matemática básica" text1="Carga horária: 36h" additionalClassNames="z-[2]" />
                </ListItem>
                <ListItem>
                  <HelperbuttonLeadingElementImage additionalClassNames="z-[3]" />
                  <HelperbuttonContent text="Excel Iniciante" text1="Carga horária: 24h" additionalClassNames="z-[2]" />
                </ListItem>
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
                <Wrapper3>
                  <MenuSuperiorHelper>
                    <g id="smile">
                      <path clipRule="evenodd" d={svgPaths.pcbe86f0} fill="var(--fill-0, #FFEAC4)" fillRule="evenodd" id="Vector" />
                    </g>
                  </MenuSuperiorHelper>
                  <p className="font-['Figtree:Regular',sans-serif] font-normal h-[23px] leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] w-[42px]">Perfil</p>
                </Wrapper3>
                <Wrapper3>
                  <MenuSuperiorHelper>
                    <g id="logout">
                      <path clipRule="evenodd" d={svgPaths.pcbd3400} fill="var(--fill-0, #FFEAC4)" fillRule="evenodd" id="Vector" />
                    </g>
                  </MenuSuperiorHelper>
                  <p className="font-['Figtree:Regular',sans-serif] font-normal h-[23px] leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] w-[34px]">Sair</p>
                </Wrapper3>
              </div>
            </>
          )}
          {isMenuSelected && <MenuSuperiorIdiomaText text="Idioma" />}
          {isCursosSelected && (
            <>
              <Wrapper3 additionalClassNames="bg-[#ffeac4]">
                <MenuSuperiorBook>
                  <path d={svgPaths.p240fd300} fill="var(--fill-0, #021B59)" id="Vector" />
                </MenuSuperiorBook>
                <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#021b59] text-[16px] w-[189px]">Cursos</p>
              </Wrapper3>
              <button className="cursor-pointer h-[46px] relative shrink-0 w-full" data-name="portais">
                <HelperbuttonText text="Portais" />
              </button>
              <button className="cursor-pointer h-[46px] relative shrink-0 w-full" data-name="desenvolvimento">
                <HelperbuttonText1 text="Desenvolvimento" />
              </button>
              <button className="cursor-pointer h-[46px] relative shrink-0 w-full" data-name="PP">
                <HelperbuttonText2 text="Política de privacidade" />
              </button>
              <button className="cursor-pointer h-[46px] relative shrink-0 w-full" data-name="ajuda">
                <HelperbuttonText3 text="Ajuda" />
              </button>
              <MenuSuperiorIdiomaText text="Idioma" additionalClassNames="cursor-pointer" />
            </>
          )}
          {isPortaisSelected && (
            <>
              <Wrapper3 additionalClassNames="bg-[#ffeac4]">
                <Desktop>
                  <path clipRule="evenodd" d={svgPaths.p12986e80} fill="var(--fill-0, #021B59)" fillRule="evenodd" id="Vector" />
                </Desktop>
                <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#021b59] text-[16px] w-[189px]">Portais</p>
              </Wrapper3>
              <button className="cursor-pointer h-[46px] relative shrink-0 w-full" data-name="desenvolvimento">
                <HelperbuttonText1 text="Desenvolvimento" />
              </button>
              <button className="cursor-pointer h-[46px] relative shrink-0 w-full" data-name="PP">
                <HelperbuttonText2 text="Política de privacidade" />
              </button>
              <button className="cursor-pointer h-[46px] relative shrink-0 w-full" data-name="ajuda">
                <HelperbuttonText3 text="Ajuda" />
              </button>
              <MenuSuperiorIdiomaText text="Idioma" additionalClassNames="cursor-pointer" />
            </>
          )}
          {isDesenvolvimentoSelected && (
            <>
              <Wrapper3 additionalClassNames="bg-[#ffeac4]">
                <Sitemap>
                  <path d={svgPaths.p3d982070} fill="var(--fill-0, #021B59)" id="Vector" />
                </Sitemap>
                <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#021b59] text-[16px] w-[189px]">Desenvolvimento</p>
              </Wrapper3>
              <button className="cursor-pointer h-[46px] relative shrink-0 w-full" data-name="PP">
                <HelperbuttonText2 text="Política de privacidade" />
              </button>
              <button className="cursor-pointer h-[46px] relative shrink-0 w-full" data-name="ajuda">
                <HelperbuttonText3 text="Ajuda" />
              </button>
              <MenuSuperiorIdiomaText text="Idioma" additionalClassNames="cursor-pointer" />
            </>
          )}
          {isPpSelected && (
            <>
              <Wrapper3 additionalClassNames="bg-[#ffeac4]">
                <Lock>
                  <path clipRule="evenodd" d={svgPaths.p230ab480} fill="var(--fill-0, #021B59)" fillRule="evenodd" id="Vector" />
                </Lock>
                <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#021b59] text-[16px] w-[189px]">Política de privacidade</p>
              </Wrapper3>
              <button className="cursor-pointer h-[46px] relative shrink-0 w-full" data-name="ajuda">
                <HelperbuttonText3 text="Ajuda" />
              </button>
              <MenuSuperiorIdiomaText text="Idioma" additionalClassNames="cursor-pointer" />
            </>
          )}
          {isAjudaSelected && (
            <>
              <Wrapper3 additionalClassNames="bg-[#ffeac4]">
                <Info>
                  <path d={svgPaths.p34f77440} fill="var(--fill-0, #021B59)" id="Vector" />
                </Info>
                <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#021b59] text-[16px] w-[189px]">Ajuda</p>
              </Wrapper3>
              <MenuSuperiorIdiomaText text="Idioma" additionalClassNames="cursor-pointer" />
            </>
          )}
          {isIdiomaSelected && (
            <Wrapper3 additionalClassNames="bg-[#ffeac4]">
              <CommentO>
                <path d={svgPaths.p20701600} fill="var(--fill-0, #021B59)" id="Vector" />
              </CommentO>
              <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#021b59] text-[16px] w-[189px]">Idioma</p>
            </Wrapper3>
          )}
          {isFechado && (
            <>
              <MenuSuperiorLeadingIcon />
              <Helper />
              <MenuSuperiorTrailingElements additionalClassNames="size-[46px]" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MenuSuperior1() {
  return <MenuSuperior className="bg-[#021b59] relative size-full" status="app bar perfil" />;
}