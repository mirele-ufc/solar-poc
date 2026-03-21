import clsx from "clsx";
import svgPaths from "./svg-bea7wdjph4";

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
type HelperProps = {
  text: string;
  text1: string;
  additionalClassNames?: string;
};

function Helper({ text, text1, additionalClassNames = "" }: HelperProps) {
  return (
    <div className={clsx("content-stretch flex flex-col gap-[16px] items-start leading-[normal] pt-[8px] relative text-[20px] text-black", additionalClassNames)}>
      <p className="font-['Anek_Devanagari:SemiBold',sans-serif] font-semibold h-[24px] relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
      <p className="font-['Anek_Devanagari:Regular',sans-serif] font-normal relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text1}
      </p>
    </div>
  );
}
type Frame56AbaTextProps = {
  text: string;
};

function Frame56AbaText({ text }: Frame56AbaTextProps) {
  return (
    <div className="h-[60px] relative shrink-0 w-[134px]">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center relative size-full">
          <p className="font-['Anek_Devanagari:SemiBold',sans-serif] font-semibold h-[24px] leading-[normal] relative shrink-0 text-[20px] text-black text-center w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
            {text}
          </p>
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
type AbaProps = {
  className?: string;
  hover?: boolean;
  status?: "Ativo" | "Não-ativo";
};

function Aba({ className, hover = false, status = "Ativo" }: AbaProps) {
  const isAtivoAndIsFalseOrTrue = status === "Ativo" && [false, true].includes(hover);
  const isNaoAtivoAndIsFalseOrTrue = status === "Não-ativo" && [false, true].includes(hover);
  return (
    <div className={className || `h-[60px] relative w-[134px] ${hover && ["Não-ativo", "Ativo"].includes(status) ? "bg-[rgba(96,96,96,0.2)]" : ""}`}>
      <div className={`flex flex-col items-center size-full ${isNaoAtivoAndIsFalseOrTrue ? "justify-center" : ""}`}>
        <div className={`content-stretch flex flex-col items-center relative size-full ${isNaoAtivoAndIsFalseOrTrue ? "justify-center" : "justify-between pt-[8px]"}`}>
          {isAtivoAndIsFalseOrTrue && (
            <>
              <div className="flex flex-col font-['Anek_Devanagari:SemiBold',sans-serif] font-semibold h-[42px] justify-end leading-[0] relative shrink-0 text-[20px] text-black text-center w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                <p className="leading-[normal]">Perguntas</p>
              </div>
              <div className="bg-[#efbbdc] h-[3px] shrink-0 w-full" />
            </>
          )}
          {isNaoAtivoAndIsFalseOrTrue && (
            <p className="font-['Anek_Devanagari:SemiBold',sans-serif] font-semibold h-[24px] leading-[normal] relative shrink-0 text-[20px] text-black text-center w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
              Perguntas
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdicaoDeConfiguracoes() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[20px] items-center pb-[30px] pt-[70px] px-[20px] relative size-full" data-name="Adição de configurações">
      <div className="content-stretch flex items-center relative shrink-0 w-[402px]">
        <Aba className="h-[60px] relative shrink-0 w-[134px]" />
        <Frame56AbaText text="Respostas" />
        <Frame56AbaText text="Configurações" />
      </div>
      <div className="content-stretch flex flex-col gap-[20px] items-center relative shrink-0 w-[360px]">
        <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
          <Checkbox className="h-[46px] relative rounded-[100px] shrink-0" />
          <Helper text="Respostas erradas" text1="Os participantes podem ver as perguntas que foram respondidas incorretamente." additionalClassNames="flex-[1_0_0] min-h-px min-w-px" />
        </div>
        <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
          <Checkbox className="h-[46px] relative rounded-[100px] shrink-0" />
          <div className="flex-[1_0_0] min-h-px min-w-px relative self-stretch">
            <Helper text="Respostas corretas" text1="Os participantes podem ver as respostas corretas após a liberação das notas." additionalClassNames="size-full" />
          </div>
        </div>
        <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
          <Checkbox className="h-[46px] relative rounded-[100px] shrink-0" />
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start leading-[normal] min-h-px min-w-px pt-[8px] relative text-[20px] text-black">
            <p className="font-['Anek_Devanagari:SemiBold',sans-serif] font-semibold h-[24px] relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
              Valores
            </p>
            <div className="font-['Anek_Devanagari:Regular',sans-serif] font-normal relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
              <p className="mb-0">Os participantes podem ver a</p>
              <p className="mb-0">pontuação total e os pontos recebidos</p>
              <p>para cada pergunta.</p>
            </div>
          </div>
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
              <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[#333] text-[20px] text-center whitespace-nowrap">Finalizar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}