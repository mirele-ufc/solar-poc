import svgPaths from "./svg-kyiqi621oz";

function Wrapper4({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="flex flex-row items-center justify-center size-full">
      <div className="content-stretch flex items-center justify-center relative size-full">{children}</div>
    </div>
  );
}
type Wrapper3Props = {
  additionalClassNames?: string;
};

function Wrapper3({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper3Props>) {
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

function Wrapper2({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        {children}
      </svg>
    </div>
  );
}

function Wrapper1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="flex flex-row items-center justify-center size-full">
      <div className="content-stretch flex h-full items-center justify-center p-[11px] relative">{children}</div>
    </div>
  );
}

function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="bg-[#efbbdc] relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[20px] py-[10px] relative w-full">{children}</div>
      </div>
    </div>
  );
}

function CheckboxHelper({ children }: React.PropsWithChildren<{}>) {
  return (
    <Wrapper1>
      <div className="relative rounded-[2px] shrink-0 size-[22px]" data-name="container">
        {children}
      </div>
    </Wrapper1>
  );
}
type TextProps = {
  text: string;
};

function Text({ text }: TextProps) {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <Checkbox className="h-[46px] relative rounded-[100px] shrink-0" />
      <div className="flex flex-[1_0_0] flex-col font-['Figtree:Regular',sans-serif] font-normal h-[32px] justify-center leading-[0] min-h-px min-w-px relative text-[16px] text-black">
        <p className="leading-[24px]">{text}</p>
      </div>
    </div>
  );
}
type HelperProps = {
  text: string;
  text1: string;
};

function Helper({ text, text1 }: HelperProps) {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-['Figtree:Bold',sans-serif] font-bold leading-[36px] relative shrink-0 text-[24px] text-black whitespace-nowrap">{text}</p>
      <div className="h-0 relative shrink-0 w-[190.5px]">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 190.5 1">
            <path d="M0 0.5H190.5" id="Line 1" stroke="var(--stroke-0, black)" />
          </svg>
        </div>
      </div>
      <p className="font-['Anek_Devanagari:Medium',sans-serif] font-medium h-[21px] leading-[normal] relative shrink-0 text-[16px] text-black w-[22px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text1}
      </p>
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
        <Wrapper1>
          <div className="relative shrink-0 size-[22px]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
              <g id="Frame 6">
                <rect fill="var(--fill-0, #FFEAC4)" height="20" rx="1" width="20" x="1" y="1" />
                <rect height="20" rx="1" stroke="var(--stroke-0, #FFEAC4)" strokeWidth="2" width="20" x="1" y="1" />
                <path clipRule="evenodd" d={svgPaths.p39066800} fill="var(--fill-0, #021B59)" fillRule="evenodd" id="Vector" />
              </g>
            </svg>
          </div>
        </Wrapper1>
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

export default function ProvaRespostas() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[20px] items-start pb-[30px] pt-[90px] px-[20px] relative size-full" data-name="Prova - respostas">
      <p className="font-['Anek_Devanagari:ExtraBold',sans-serif] font-extrabold h-[38px] leading-[normal] relative shrink-0 text-[32px] text-black w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Power BI - Fundamentos
      </p>
      <p className="font-['Figtree:Bold',sans-serif] font-bold leading-[42px] min-w-full relative shrink-0 text-[28px] text-black w-[min-content]">{`Prova 01 `}</p>
      <Helper text="Questão 1" text1="0,0" />
      <p className="font-['Figtree:Medium',sans-serif] font-medium h-[57px] leading-[30px] relative shrink-0 text-[20px] text-black w-[362px]">No Microsoft Power BI, qual é a principal função do Power Query?</p>
      <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
        <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
          <Checkbox className="cursor-pointer relative rounded-[100px] shrink-0 size-[46px]" status="Selected" />
          <div className="flex-[1_0_0] font-['Figtree:Regular',sans-serif] font-normal leading-[24px] min-h-px min-w-px relative text-[16px] text-black">
            <p className="mb-0">Criar dashboards interativos</p>
            <p>para apresentação final</p>
          </div>
          <Wrapper2>
            <g>
              <path clipRule="evenodd" d={svgPaths.p13627100} fill="var(--fill-0, #801436)" fillRule="evenodd" id="Vector" />
            </g>
          </Wrapper2>
        </div>
        <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
          <Checkbox className="relative rounded-[100px] shrink-0 size-[46px]" />
          <div className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[16px] text-black w-[315.534px]">
            <p className="mb-0">Realizar tratamento, limpeza e</p>
            <p>transformação de dados antes da análise</p>
          </div>
        </div>
        <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
          <Checkbox className="relative rounded-[100px] shrink-0 size-[46px]" />
          <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[16px] text-black w-[299.29px]">Publicar relatórios na nuvem</p>
        </div>
        <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
          <Checkbox className="relative rounded-[100px] shrink-0 size-[46px]" />
          <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[16px] text-black w-[315.673px]">Criar gráficos avançados com animações</p>
        </div>
      </div>
      <Wrapper>
        <div className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[16px] text-black whitespace-nowrap">
          <p className="mb-0">Questão 01: B) Realizar tratamento, limpeza e</p>
          <p>{`transformação de dados antes da análise. `}</p>
        </div>
      </Wrapper>
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
              <Wrapper3 additionalClassNames="relative shrink-0 size-[20px]">
                <g clipPath="url(#clip0_6_2388)" id="search">
                  <path clipRule="evenodd" d={svgPaths.p18692e80} fill="var(--fill-0, #042E99)" fillRule="evenodd" id="Vector" />
                </g>
                <defs>
                  <clipPath id="clip0_6_2388">
                    <rect fill="white" height="20" width="20" />
                  </clipPath>
                </defs>
              </Wrapper3>
              <div className="flex flex-[1_0_0] flex-col font-['Figtree:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#333] text-[16px]">
                <p className="leading-[24px]">Texto</p>
              </div>
              <div className="relative shrink-0 size-[30px]" data-name="Trailing-icon-button">
                <Wrapper4>
                  <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[100px] shrink-0 w-[40px]" data-name="Content">
                    <StateLayer>
                      <div className="absolute inset-[8.33%_20.83%_12.5%_20.83%]" data-name="icon">
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 19">
                          <path d={svgPaths.p10382e00} fill="var(--fill-0, #042E99)" id="icon" />
                        </svg>
                      </div>
                    </StateLayer>
                  </div>
                </Wrapper4>
              </div>
            </div>
            <button className="block cursor-pointer relative shrink-0 size-[46px]" data-name="Trailing elements">
              <div className="absolute left-0 size-[48px] top-0" data-name="Trailing icon">
                <Wrapper4>
                  <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[100px] shrink-0 w-[40px]" data-name="Content">
                    <StateLayer>
                      <Wrapper3 additionalClassNames="absolute inset-[8.33%]">
                        <path d={svgPaths.pe3d9c80} fill="var(--fill-0, #FFEAC4)" id="icon" />
                      </Wrapper3>
                    </StateLayer>
                  </div>
                </Wrapper4>
              </div>
            </button>
          </div>
        </div>
      </div>
      <Helper text="Questão 2" text1="1,0" />
      <p className="font-['Figtree:Medium',sans-serif] font-medium h-[86px] leading-[30px] relative shrink-0 text-[20px] text-black w-full">Qual linguagem é utilizada no Power BI para criação de medidas e cálculos personalizados?</p>
      <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[361px]">
        <Text text="SQL" />
        <Text text="Python" />
        <div className="content-stretch flex items-center relative shrink-0 w-full">
          <Checkbox className="cursor-pointer h-[46px] relative rounded-[100px] shrink-0" status="Selected" />
          <div className="flex flex-[1_0_0] flex-col font-['Figtree:Regular',sans-serif] font-normal h-[32px] justify-center leading-[0] min-h-px min-w-px relative text-[16px] text-black">
            <p className="leading-[24px]">DAX</p>
          </div>
          <Wrapper2>
            <g id="check-circle-o">
              <path d={svgPaths.pec74300} fill="var(--fill-0, #042E99)" id="Vector" />
            </g>
          </Wrapper2>
        </div>
        <div className="content-stretch flex items-center relative shrink-0 w-full">
          <Checkbox className="h-[46px] relative rounded-[100px] shrink-0" />
          <div className="flex flex-[1_0_0] flex-col font-['Figtree:Regular',sans-serif] font-normal h-[34px] justify-center leading-[0] min-h-px min-w-px relative text-[16px] text-black">
            <p className="leading-[24px]">VBA</p>
          </div>
        </div>
      </div>
      <Wrapper>
        <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[16px] text-black whitespace-nowrap">Questão 02: C) DAX</p>
      </Wrapper>
      <div className="bg-[rgba(255,239,208,0.8)] relative shrink-0 w-[360px]" data-name="Botão">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center py-[10px] relative w-full">
            <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[#333] text-[20px] text-center whitespace-nowrap">Retornar ao curso</p>
          </div>
        </div>
      </div>
    </div>
  );
}