import clsx from "clsx";
import svgPaths from "./svg-6am54a1zen";

function Wrapper2({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="flex flex-row items-center justify-center size-full">
      <div className="content-stretch flex items-center justify-center relative size-full">{children}</div>
    </div>
  );
}
type Wrapper1Props = {
  additionalClassNames?: string;
};

function Wrapper1({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper1Props>) {
  return (
    <div className={additionalClassNames}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        {children}
      </svg>
    </div>
  );
}

function StateLayer({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="content-stretch flex h-[40px] items-center justify-center relative shrink-0 w-full">
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon">
        {children}
      </div>
    </div>
  );
}

function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="flex flex-row items-center justify-center size-full">
      <div className="content-stretch flex h-full items-center justify-center p-[11px] relative">{children}</div>
    </div>
  );
}

function CheckboxHelper({ children }: React.PropsWithChildren<{}>) {
  return (
    <Wrapper>
      <div className="relative rounded-[2px] shrink-0 size-[22px]" data-name="container">
        {children}
      </div>
    </Wrapper>
  );
}
type TextProps = {
  text: string;
  additionalClassNames?: string;
};

function Text({ text, additionalClassNames = "" }: TextProps) {
  return (
    <div className={clsx("content-stretch flex gap-[8px] items-center relative shrink-0", additionalClassNames)}>
      <Checkbox className="h-[46px] relative rounded-[100px] shrink-0" />
      <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[16px] text-black whitespace-nowrap">{text}</p>
    </div>
  );
}

function LabelsHelper() {
  return (
    <div className="flex-none rotate-180">
      <div className="overflow-clip relative size-[24px]" data-name="Frame">
        <div className="absolute h-[12.028px] left-[6px] top-[6px] w-[13px]" data-name="Frame">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 12.0275">
            <g id="Frame">
              <path d={svgPaths.p8cf740} fill="var(--fill-0, #021B59)" id="Vector" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
type CheckboxProps = {
  className?: string;
  status?: "Unselected" | "Hover" | "Selected";
};

function Checkbox({ className, status = "Unselected" }: CheckboxProps) {
  if (status === "Hover") {
    return (
      <button className={className || "cursor-pointer h-[46px] relative rounded-[100px]"} data-name="Status=Hover">
        <CheckboxHelper>
          <div aria-hidden="true" className="absolute border-2 border-[rgba(255,239,208,0.8)] border-solid inset-0 pointer-events-none rounded-[2px]" />
        </CheckboxHelper>
      </button>
    );
  }
  if (status === "Selected") {
    return (
      <button className={className || "cursor-pointer h-[46px] relative rounded-[100px]"} data-name="Status=Selected">
        <Wrapper>
          <div className="relative shrink-0 size-[22px]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
              <g id="Frame 6">
                <rect fill="var(--fill-0, #FFEAC4)" height="20" rx="1" width="20" x="1" y="1" />
                <rect height="20" rx="1" stroke="var(--stroke-0, #FFEAC4)" strokeWidth="2" width="20" x="1" y="1" />
                <path clipRule="evenodd" d={svgPaths.p39066800} fill="var(--fill-0, #021B59)" fillRule="evenodd" id="Vector" />
              </g>
            </svg>
          </div>
        </Wrapper>
      </button>
    );
  }
  return (
    <div className={className || "h-[46px] relative rounded-[100px]"} data-name="Status=Unselected">
      <CheckboxHelper>
        <div aria-hidden="true" className="absolute border-2 border-[#ffeac4] border-solid inset-0 pointer-events-none rounded-[2px]" />
      </CheckboxHelper>
    </div>
  );
}
type LabelsProps = {
  className?: string;
  iconeDireito?: boolean;
  iconeEsquerdo?: boolean;
  selecionado?: boolean;
  status?: "Preenchido" | "Digitando" | "Selecionado" | "Ocioso";
  titulo?: boolean;
};

function Labels({ className, iconeDireito = false, iconeEsquerdo = false, selecionado = false, status = "Ocioso", titulo = true }: LabelsProps) {
  const isIconeEsquerdoAndTituloAndIsPreenchidoAndSelecionadoAndNotIcone = iconeEsquerdo && titulo && ((status === "Preenchido" && selecionado && !iconeDireito) || (status === "Preenchido" && selecionado && iconeDireito) || (status === "Preenchido" && !selecionado && !iconeDireito) || (status === "Preenchido" && !selecionado && iconeDireito) || (status === "Selecionado" && selecionado && !iconeDireito) || (status === "Selecionado" && selecionado && iconeDireito) || (status === "Ocioso" && !selecionado && !iconeDireito) || (status === "Ocioso" && !selecionado && iconeDireito) || (status === "Digitando" && selecionado && !iconeDireito) || (status === "Digitando" && selecionado && iconeDireito));
  const isOciosoAndNotSelecionadoAndIconeEsquerdoAndTituloAndIsFalseOr = status === "Ocioso" && !selecionado && iconeEsquerdo && titulo && [false, true].includes(iconeDireito);
  const isPreenchidoAndNotSelecionadoAndIconeEsquerdoAndNotTituloAndIs = status === "Preenchido" && !selecionado && iconeEsquerdo && !titulo && [false, true].includes(iconeDireito);
  const isPreenchidoAndNotSelecionadoAndNotTituloAndIsNotIconeEsquerdo = status === "Preenchido" && !selecionado && !titulo && ((!iconeEsquerdo && !iconeDireito) || (!iconeEsquerdo && iconeDireito) || (iconeEsquerdo && !iconeDireito) || (iconeEsquerdo && iconeDireito));
  const isPreenchidoAndNotSelecionadoAndNotTituloAndIsNotIconeEsquerdo1 = status === "Preenchido" && !selecionado && !titulo && ((!iconeEsquerdo && iconeDireito) || (iconeEsquerdo && !iconeDireito) || (iconeEsquerdo && iconeDireito));
  const isTituloAndIsPreenchidoAndSelecionadoAndNotIconeEsquerdoAndIcone = titulo && ((status === "Preenchido" && selecionado && !iconeEsquerdo && iconeDireito) || (status === "Preenchido" && selecionado && iconeEsquerdo && !iconeDireito) || (status === "Preenchido" && selecionado && iconeEsquerdo && iconeDireito) || (status === "Preenchido" && !selecionado && !iconeEsquerdo && iconeDireito) || (status === "Preenchido" && !selecionado && iconeEsquerdo && !iconeDireito) || (status === "Preenchido" && !selecionado && iconeEsquerdo && iconeDireito) || (status === "Selecionado" && selecionado && !iconeEsquerdo && iconeDireito) || (status === "Selecionado" && selecionado && iconeEsquerdo && !iconeDireito) || (status === "Selecionado" && selecionado && iconeEsquerdo && iconeDireito) || (status === "Ocioso" && !selecionado && !iconeEsquerdo && iconeDireito) || (status === "Ocioso" && !selecionado && iconeEsquerdo && !iconeDireito) || (status === "Ocioso" && !selecionado && iconeEsquerdo && iconeDireito) || (status === "Digitando" && selecionado && !iconeEsquerdo && iconeDireito) || (status === "Digitando" && selecionado && iconeEsquerdo && !iconeDireito) || (status === "Digitando" && selecionado && iconeEsquerdo && iconeDireito));
  const isTituloAndIsPreenchidoAndSelecionadoAndNotIconeEsquerdoAndNot = titulo && ((status === "Preenchido" && selecionado && !iconeEsquerdo && !iconeDireito) || (status === "Preenchido" && selecionado && !iconeEsquerdo && iconeDireito) || (status === "Preenchido" && selecionado && iconeEsquerdo && !iconeDireito) || (status === "Preenchido" && selecionado && iconeEsquerdo && iconeDireito) || (status === "Preenchido" && !selecionado && !iconeEsquerdo && !iconeDireito) || (status === "Preenchido" && !selecionado && !iconeEsquerdo && iconeDireito) || (status === "Preenchido" && !selecionado && iconeEsquerdo && !iconeDireito) || (status === "Preenchido" && !selecionado && iconeEsquerdo && iconeDireito) || (status === "Selecionado" && selecionado && !iconeEsquerdo && !iconeDireito) || (status === "Selecionado" && selecionado && !iconeEsquerdo && iconeDireito) || (status === "Selecionado" && selecionado && iconeEsquerdo && !iconeDireito) || (status === "Selecionado" && selecionado && iconeEsquerdo && iconeDireito) || (status === "Ocioso" && !selecionado && !iconeEsquerdo && !iconeDireito) || (status === "Ocioso" && !selecionado && !iconeEsquerdo && iconeDireito) || (status === "Ocioso" && !selecionado && iconeEsquerdo && !iconeDireito) || (status === "Ocioso" && !selecionado && iconeEsquerdo && iconeDireito) || (status === "Digitando" && selecionado && !iconeEsquerdo && !iconeDireito) || (status === "Digitando" && selecionado && !iconeEsquerdo && iconeDireito) || (status === "Digitando" && selecionado && iconeEsquerdo && !iconeDireito) || (status === "Digitando" && selecionado && iconeEsquerdo && iconeDireito));
  return (
    <div className={className || "relative w-[360px]"}>
      <div aria-hidden={isPreenchidoAndNotSelecionadoAndNotTituloAndIsNotIconeEsquerdo ? "true" : undefined} className={isPreenchidoAndNotSelecionadoAndNotTituloAndIsNotIconeEsquerdo ? "absolute border border-[#8e8e8e] border-solid inset-0 pointer-events-none" : "content-stretch flex flex-col gap-[2px] items-start relative w-full"}>
        {isTituloAndIsPreenchidoAndSelecionadoAndNotIconeEsquerdoAndNot && (
          <>
            <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[#333] text-[20px] w-full">Texto</p>
            <div className="bg-white h-[50px] relative shrink-0 w-full">
              <div aria-hidden="true" className={`absolute border-solid inset-0 pointer-events-none ${!selecionado && titulo && ((status === "Preenchido" && !iconeEsquerdo && !iconeDireito) || (status === "Preenchido" && !iconeEsquerdo && iconeDireito) || (status === "Preenchido" && iconeEsquerdo && !iconeDireito) || (status === "Preenchido" && iconeEsquerdo && iconeDireito) || (status === "Ocioso" && !iconeEsquerdo && !iconeDireito) || (status === "Ocioso" && !iconeEsquerdo && iconeDireito) || (status === "Ocioso" && iconeEsquerdo && !iconeDireito) || (status === "Ocioso" && iconeEsquerdo && iconeDireito)) ? "border border-[#8e8e8e]" : "border-2 border-[#021b59]"}`} />
              <div className="flex flex-row items-center size-full">
                <div className={`content-stretch flex items-center px-[20px] py-[12px] relative size-full ${isTituloAndIsPreenchidoAndSelecionadoAndNotIconeEsquerdoAndIcone ? "gap-[10px]" : ""}`}>
                  <div className={`flex justify-center relative ${status === "Ocioso" && !selecionado && !iconeEsquerdo && titulo && [false, true].includes(iconeDireito) ? 'flex-[1_0_0] flex-col font-["Figtree:Regular",sans-serif] font-normal h-full leading-[0] min-h-px min-w-px text-[#8e8e8e] text-[16px]' : isIconeEsquerdoAndTituloAndIsPreenchidoAndSelecionadoAndNotIcone ? "items-center shrink-0" : 'flex-[1_0_0] flex-col font-["Figtree:Regular",sans-serif] font-normal h-full leading-[0] min-h-px min-w-px text-[#333] text-[16px]'}`}>
                    {!iconeEsquerdo && titulo && ((status === "Preenchido" && selecionado && !iconeDireito) || (status === "Preenchido" && selecionado && iconeDireito) || (status === "Preenchido" && !selecionado && !iconeDireito) || (status === "Preenchido" && !selecionado && iconeDireito) || (status === "Selecionado" && selecionado && !iconeDireito) || (status === "Selecionado" && selecionado && iconeDireito) || (status === "Ocioso" && !selecionado && !iconeDireito) || (status === "Ocioso" && !selecionado && iconeDireito) || (status === "Digitando" && selecionado && !iconeDireito) || (status === "Digitando" && selecionado && iconeDireito)) && <p className="leading-[24px]">{status === "Digitando" && selecionado && !iconeEsquerdo && titulo && [false, true].includes(iconeDireito) ? "Texto|" : status === "Ocioso" && !selecionado && !iconeEsquerdo && iconeDireito && titulo ? "Texto de dica" : status === "Selecionado" && selecionado && !iconeEsquerdo && titulo && [false, true].includes(iconeDireito) ? "|" : status === "Preenchido" && !iconeEsquerdo && titulo && ((selecionado && !iconeDireito) || (selecionado && iconeDireito) || (!selecionado && !iconeDireito) || (!selecionado && iconeDireito)) ? "Texto" : "Texto de dica"}</p>}
                    {isIconeEsquerdoAndTituloAndIsPreenchidoAndSelecionadoAndNotIcone && <LabelsHelper />}
                  </div>
                  {isTituloAndIsPreenchidoAndSelecionadoAndNotIconeEsquerdoAndIcone && (
                    <div className={`flex justify-center relative ${isOciosoAndNotSelecionadoAndIconeEsquerdoAndTituloAndIsFalseOr ? 'flex-[1_0_0] flex-col font-["Figtree:Regular",sans-serif] font-normal h-full leading-[0] min-h-px min-w-px text-[#8e8e8e] text-[16px]' : iconeEsquerdo && titulo && ((status === "Preenchido" && selecionado && !iconeDireito) || (status === "Preenchido" && selecionado && iconeDireito) || (status === "Preenchido" && !selecionado && !iconeDireito) || (status === "Preenchido" && !selecionado && iconeDireito) || (status === "Selecionado" && selecionado && !iconeDireito) || (status === "Selecionado" && selecionado && iconeDireito) || (status === "Digitando" && selecionado && !iconeDireito) || (status === "Digitando" && selecionado && iconeDireito)) ? 'flex-[1_0_0] flex-col font-["Figtree:Regular",sans-serif] font-normal h-full leading-[0] min-h-px min-w-px text-[#333] text-[16px]' : "items-center shrink-0"}`}>
                      {isIconeEsquerdoAndTituloAndIsPreenchidoAndSelecionadoAndNotIcone && <p className="leading-[24px]">{status === "Digitando" && selecionado && iconeEsquerdo && titulo && [false, true].includes(iconeDireito) ? "Texto|" : isOciosoAndNotSelecionadoAndIconeEsquerdoAndTituloAndIsFalseOr ? "Texto de dica" : status === "Selecionado" && selecionado && iconeEsquerdo && titulo && [false, true].includes(iconeDireito) ? "|" : status === "Preenchido" && iconeEsquerdo && titulo && ((selecionado && !iconeDireito) || (selecionado && iconeDireito) || (!selecionado && !iconeDireito) || (!selecionado && iconeDireito)) ? "Texto" : ""}</p>}
                      {!iconeEsquerdo && iconeDireito && titulo && ((status === "Preenchido" && selecionado) || (status === "Preenchido" && !selecionado) || (status === "Selecionado" && selecionado) || (status === "Ocioso" && !selecionado) || (status === "Digitando" && selecionado)) && <LabelsHelper />}
                    </div>
                  )}
                  {iconeEsquerdo && iconeDireito && titulo && ((status === "Preenchido" && selecionado) || (status === "Preenchido" && !selecionado) || (status === "Selecionado" && selecionado) || (status === "Ocioso" && !selecionado) || (status === "Digitando" && selecionado)) && (
                    <div className="flex items-center justify-center relative shrink-0">
                      <LabelsHelper />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {isPreenchidoAndNotSelecionadoAndNotTituloAndIsNotIconeEsquerdo && (
        <div className="content-stretch flex flex-col items-start relative w-full">
          <div className="bg-white h-[50px] relative shrink-0 w-full">
            <div className="flex flex-row items-center size-full">
              <div className={`content-stretch flex items-center px-[20px] py-[12px] relative size-full ${isPreenchidoAndNotSelecionadoAndNotTituloAndIsNotIconeEsquerdo1 ? "gap-[10px]" : ""}`}>
                <div className={`flex justify-center relative ${isPreenchidoAndNotSelecionadoAndIconeEsquerdoAndNotTituloAndIs ? "items-center shrink-0" : 'flex-[1_0_0] flex-col font-["Figtree:Regular",sans-serif] font-normal h-full leading-[0] min-h-px min-w-px text-[#333] text-[16px]'}`}>
                  {status === "Preenchido" && !selecionado && !iconeEsquerdo && !titulo && [false, true].includes(iconeDireito) && <p className="leading-[24px]">Texto</p>}
                  {isPreenchidoAndNotSelecionadoAndIconeEsquerdoAndNotTituloAndIs && <LabelsHelper />}
                </div>
                {isPreenchidoAndNotSelecionadoAndNotTituloAndIsNotIconeEsquerdo1 && (
                  <div className={`flex justify-center relative ${isPreenchidoAndNotSelecionadoAndIconeEsquerdoAndNotTituloAndIs ? 'flex-[1_0_0] flex-col font-["Figtree:Regular",sans-serif] font-normal h-full leading-[0] min-h-px min-w-px text-[#333] text-[16px]' : "items-center shrink-0"}`}>
                    {isPreenchidoAndNotSelecionadoAndIconeEsquerdoAndNotTituloAndIs && <p className="leading-[24px]">Texto</p>}
                    {status === "Preenchido" && !selecionado && !iconeEsquerdo && iconeDireito && !titulo && <LabelsHelper />}
                  </div>
                )}
                {status === "Preenchido" && !selecionado && iconeEsquerdo && iconeDireito && !titulo && (
                  <div className="flex items-center justify-center relative shrink-0">
                    <LabelsHelper />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CriacaoDeCurso() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[20px] items-center pb-[40px] pt-[70px] px-[20px] relative size-full" data-name="Criação de curso">
      <div className="bg-[#484848] content-stretch flex h-[218px] items-center justify-center pb-[78px] pt-[62px] px-[162px] relative shrink-0 w-[402px]">
        <div className="relative shrink-0 size-[78px]" data-name="file-image">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 78 78">
            <g id="file-image">
              <path clipRule="evenodd" d={svgPaths.p287cd300} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
            </g>
          </svg>
        </div>
      </div>
      <Labels className="relative shrink-0 w-[360px]" status="Preenchido" />
      <Labels className="relative shrink-0 w-[360px]" status="Preenchido" />
      <Labels className="relative shrink-0 w-[360px]" status="Preenchido" />
      <Labels className="relative shrink-0 w-[360px]" status="Preenchido" />
      <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
        <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
          <p className="col-1 font-['Figtree:Medium',sans-serif] font-medium h-[60px] leading-[30px] ml-0 mt-0 relative row-1 text-[20px] text-black w-[362px]">Selecione quais dados os cadastrados deverão informar para cursar:</p>
        </div>
        <div className="content-stretch flex flex-col items-start relative shrink-0">
          <Text text="Endereço" additionalClassNames="justify-center" />
          <Text text="Gênero" additionalClassNames="w-[123px]" />
          <Text text="Idade" additionalClassNames="justify-center" />
        </div>
      </div>
      <div className="absolute bg-[#021b59] h-[70px] left-0 top-0 w-[402px]" data-name="Menu Superior">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex items-center justify-between px-[20px] py-[10px] relative size-full">
            <button className="content-stretch cursor-pointer flex items-center justify-center relative shrink-0 size-[46px]" data-name="Leading icon">
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[12px] shrink-0 w-[40px]" data-name="Content">
                <StateLayer>
                  <div className="absolute bottom-1/4 left-[12.5%] right-[12.5%] top-1/4" data-name="icon">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 12">
                      <path d={svgPaths.p2304a600} fill="var(--fill-0, #FFEAC4)" id="icon" />
                    </svg>
                  </div>
                </StateLayer>
              </div>
            </button>
            <div className="bg-white content-stretch flex gap-[10px] h-[40px] items-center justify-center px-[20px] py-[6px] relative shrink-0 w-[250px]" data-name="Labels">
              <Wrapper1 additionalClassNames="relative shrink-0 size-[20px]">
                <g clipPath="url(#clip0_6_2388)" id="search">
                  <path clipRule="evenodd" d={svgPaths.p18692e80} fill="var(--fill-0, #042E99)" fillRule="evenodd" id="Vector" />
                </g>
                <defs>
                  <clipPath id="clip0_6_2388">
                    <rect fill="white" height="20" width="20" />
                  </clipPath>
                </defs>
              </Wrapper1>
              <div className="flex flex-[1_0_0] flex-col font-['Figtree:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#333] text-[16px]">
                <p className="leading-[24px]">Texto</p>
              </div>
              <div className="relative shrink-0 size-[30px]" data-name="Trailing-icon-button">
                <Wrapper2>
                  <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[100px] shrink-0 w-[40px]" data-name="Content">
                    <StateLayer>
                      <div className="absolute inset-[8.33%_20.83%_12.5%_20.83%]" data-name="icon">
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 19">
                          <path d={svgPaths.p10382e00} fill="var(--fill-0, #042E99)" id="icon" />
                        </svg>
                      </div>
                    </StateLayer>
                  </div>
                </Wrapper2>
              </div>
            </div>
            <button className="block cursor-pointer relative shrink-0 size-[46px]" data-name="Trailing elements">
              <div className="absolute left-0 size-[48px] top-0" data-name="Trailing icon">
                <Wrapper2>
                  <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[100px] shrink-0 w-[40px]" data-name="Content">
                    <StateLayer>
                      <Wrapper1 additionalClassNames="absolute inset-[8.33%]">
                        <path d={svgPaths.pe3d9c80} fill="var(--fill-0, #FFEAC4)" id="icon" />
                      </Wrapper1>
                    </StateLayer>
                  </div>
                </Wrapper2>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="-translate-x-1/2 absolute bg-white bottom-0 content-stretch flex flex-col items-center justify-center left-1/2 px-[18px] py-[16px] shadow-[0px_0px_12px_0px_rgba(51,51,51,0.2)]">
        <div className="bg-[#ffeac4] h-[50px] relative rounded-[26px] shrink-0 w-[360px]" data-name="Botão">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center py-[10px] relative size-full">
              <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[#333] text-[20px] text-center whitespace-nowrap">Próximo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}