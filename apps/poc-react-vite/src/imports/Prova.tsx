import clsx from "clsx";
import svgPaths from "./svg-z8bkflr22w";

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
type Text1Props = {
  text: string;
  additionalClassNames?: string;
};

function Text1({ text, additionalClassNames = "" }: Text1Props) {
  return (
    <div className={clsx("content-stretch flex items-center relative shrink-0 w-full", additionalClassNames)}>
      <Checkbox className="h-[46px] relative rounded-[100px] shrink-0" />
      <div className="flex flex-[1_0_0] flex-col font-['Figtree:Regular',sans-serif] font-normal h-[32px] justify-center leading-[0] min-h-px min-w-px relative text-[16px] text-black">
        <p className="leading-[24px]">{text}</p>
      </div>
    </div>
  );
}
type TextProps = {
  text: string;
};

function Text({ text }: TextProps) {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <Checkbox className="relative rounded-[100px] shrink-0 size-[46px]" />
      <p className="flex-[1_0_0] font-['Figtree:Regular',sans-serif] font-normal leading-[24px] min-h-px min-w-px relative text-[16px] text-black">{text}</p>
    </div>
  );
}
type HelperProps = {
  text: string;
  text1: string;
};

function Helper({ text, text1 }: HelperProps) {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <Checkbox className="relative rounded-[100px] shrink-0 size-[46px]" />
      <div className="flex-[1_0_0] font-['Figtree:Regular',sans-serif] font-normal leading-[24px] min-h-px min-w-px relative text-[16px] text-black">
        <p className="mb-0">{text}</p>
        <p>{text1}</p>
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

export default function Prova() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[20px] items-center pb-[30px] pt-[90px] px-[20px] relative size-full" data-name="Prova">
      <p className="font-['Anek_Devanagari:ExtraBold',sans-serif] font-extrabold h-[38px] leading-[normal] relative shrink-0 text-[32px] text-black w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Power BI - Fundamentos
      </p>
      <div className="content-stretch flex items-center justify-between relative shrink-0 w-[363px]">
        <p className="font-['Figtree:Bold',sans-serif] font-bold leading-[42px] relative shrink-0 text-[28px] text-black whitespace-nowrap">{`Prova 01 `}</p>
        <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
          <div className="relative shrink-0 size-[24px]" data-name="clock">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
              <g id="clock">
                <path clipRule="evenodd" d={svgPaths.p1080da80} fill="var(--fill-0, #606060)" fillRule="evenodd" id="Vector" />
              </g>
            </svg>
          </div>
          <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[#606060] text-[20px] whitespace-nowrap">01:00:00</p>
        </div>
      </div>
      <p className="font-['Figtree:Bold',sans-serif] font-bold h-[28px] leading-[36px] relative shrink-0 text-[24px] text-black w-full">Questão 1</p>
      <p className="font-['Figtree:Medium',sans-serif] font-medium h-[60px] leading-[30px] relative shrink-0 text-[20px] text-black w-[362px]">No Microsoft Power BI, qual é a principal função do Power Query?</p>
      <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-[361px]">
        <Helper text="Criar dashboards interativos" text1="para apresentação final" />
        <Helper text="Realizar tratamento, limpeza e" text1="transformação de dados antes da análise" />
        <Text text="Publicar relatórios na nuvem" />
        <Text text="Criar gráficos avançados com animações" />
      </div>
      <p className="font-['Figtree:Bold',sans-serif] font-bold leading-[36px] relative shrink-0 text-[24px] text-black w-[361px]">Questão 2</p>
      <p className="font-['Figtree:Medium',sans-serif] font-medium h-[86px] leading-[30px] relative shrink-0 text-[20px] text-black w-full">Qual linguagem é utilizada no Power BI para criação de medidas e cálculos personalizados?</p>
      <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
        <Text1 text="SQL" />
        <Text1 text="Python" />
        <Text1 text="DAX" additionalClassNames="justify-center" />
        <div className="content-stretch flex items-center relative shrink-0 w-full">
          <Checkbox className="h-[46px] relative rounded-[100px] shrink-0" />
          <div className="flex flex-[1_0_0] flex-col font-['Figtree:Regular',sans-serif] font-normal h-[34px] justify-center leading-[0] min-h-px min-w-px relative text-[16px] text-black">
            <p className="leading-[24px]">VBA</p>
          </div>
        </div>
      </div>
      <div className="bg-[rgba(255,239,208,0.8)] relative shrink-0 w-[360px]" data-name="Botão">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center py-[10px] relative w-full">
            <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[#333] text-[20px] text-center whitespace-nowrap">Enviar</p>
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
            <div className="bg-white content-stretch flex gap-[10px] h-[46px] items-center justify-center px-[20px] py-[6px] relative shrink-0 w-[250px]" data-name="Labels">
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
    </div>
  );
}