import svgPaths from "./svg-ni82usg0lf";

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
    <div className="relative shrink-0 w-[362px]">
      <div className="content-stretch flex flex-col gap-[16px] items-center justify-center overflow-clip pt-[16px] px-[16px] relative rounded-[inherit] w-full">{children}</div>
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
    </div>
  );
}
type BotaoTextProps = {
  text: string;
};

function BotaoText({ text }: BotaoTextProps) {
  return (
    <div className="bg-[#ffeac4] content-stretch flex h-[60px] items-center justify-center py-[9px] relative shrink-0 w-[362px]">
      <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[#333] text-[20px] text-center whitespace-nowrap">{text}</p>
    </div>
  );
}
type Text1Props = {
  text: string;
};

function Text1({ text }: Text1Props) {
  return (
    <div className="bg-[#c5d6ff] content-stretch flex h-[59px] items-center justify-between px-[20px] relative shrink-0 w-[327px]">
      <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[20px] text-black whitespace-nowrap">{text}</p>
      <div className="relative shrink-0 size-[24px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g>
            <path clipRule="evenodd" d={svgPaths.p13627100} fill="var(--fill-0, #801436)" fillRule="evenodd" id="Vector" />
          </g>
        </svg>
      </div>
    </div>
  );
}
type TextProps = {
  text: string;
};

function Text({ text }: TextProps) {
  return (
    <div className="bg-[#c5d6ff] h-[60px] relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[20px] relative size-full">
          <p className="flex-[1_0_0] font-['Figtree:Medium',sans-serif] font-medium h-[31px] leading-[30px] min-h-px min-w-px relative text-[20px] text-black">{text}</p>
          <div className="relative shrink-0 size-[28px]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
              <g>
                <path clipRule="evenodd" d={svgPaths.p1a4ee100} fill="var(--fill-0, #801436)" fillRule="evenodd" id="Vector" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ModuloPronto() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[20px] items-center pb-[30px] pt-[90px] px-[20px] relative size-full" data-name="Modulo pronto">
      <Wrapper>
        <p className="font-['Figtree:Bold',sans-serif] font-bold h-[26px] leading-[30px] relative shrink-0 text-[#021b59] text-[20px] w-full">Módulo 01</p>
        <Text text="Aula 01" />
        <Text1 text="Aula 02" />
        <BotaoText text="Adicionar prova" />
      </Wrapper>
      <Wrapper>
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
          <p className="font-['Figtree:Bold',sans-serif] font-bold h-[26px] leading-[30px] relative shrink-0 text-[#021b59] text-[20px] w-full">Módulo 02</p>
          <Text text="Aula 01" />
        </div>
        <Text1 text="Aula 02" />
        <BotaoText text="Adicionar prova" />
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
    </div>
  );
}