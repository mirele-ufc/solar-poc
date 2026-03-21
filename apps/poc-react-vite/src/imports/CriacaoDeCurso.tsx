import svgPaths from "./svg-a3kxuonf4t";

function Labels({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 w-[360px]">
      <div className="content-stretch flex flex-col items-start relative w-full">{children}</div>
    </div>
  );
}

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
    <div className="bg-white h-[60px] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#8e8e8e] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">{children}</div>
    </div>
  );
}
type TextProps = {
  text: string;
};

function Text({ text }: TextProps) {
  return (
    <Wrapper>
      <div className="content-stretch flex items-center px-[20px] py-[12px] relative size-full">
        <div className="flex flex-[1_0_0] flex-col font-['Figtree:Regular',sans-serif] font-normal h-full justify-center leading-[0] min-h-px min-w-px relative text-[#333] text-[16px]">
          <p className="leading-[24px]">{text}</p>
        </div>
      </div>
    </Wrapper>
  );
}

export default function CriacaoDeCurso() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[20px] items-center pb-[40px] pt-[70px] px-[20px] relative size-full" data-name="Criação de curso">
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
      <div className="absolute bg-white bottom-0 content-stretch flex flex-col items-center justify-center left-[3px] overflow-clip px-[18px] py-[16px] shadow-[0px_0px_12px_0px_rgba(51,51,51,0.2)]">
        <div className="bg-[#ffeac4] h-[50px] relative shrink-0 w-[360px]" data-name="Botão">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center py-[10px] relative size-full">
              <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[#333] text-[20px] text-center whitespace-nowrap">Finalizar inscrição</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#484848] content-stretch flex h-[218px] items-center justify-center pb-[78px] pt-[62px] px-[162px] relative shrink-0 w-[402px]">
        <div className="relative shrink-0 size-[78px]" data-name="file-image">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 78 78">
            <g id="file-image">
              <path clipRule="evenodd" d={svgPaths.p287cd300} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
            </g>
          </svg>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 text-black w-full">
        <p className="font-['Figtree:Bold',sans-serif] font-bold h-[36px] leading-[36px] relative shrink-0 text-[24px] w-full">Power BI - Fundamentos</p>
        <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[20px] w-full">Confirme seus dados</p>
      </div>
      <Labels>
        <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[#333] text-[20px] w-full">Nome</p>
        <Text text="Insira seu nome" />
      </Labels>
      <Labels>
        <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[#333] text-[20px] w-full">Sobrenome</p>
        <Text text="Insira seu sobrenome" />
      </Labels>
      <Labels>
        <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[#333] text-[20px] w-full">Cidade</p>
        <Text text="Insira o nome da cidade onde você mora" />
      </Labels>
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-[360px]" data-name="Labels">
        <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[#333] text-[20px] w-full">Gênero</p>
        <Wrapper>
          <div className="content-stretch flex gap-[10px] items-center px-[20px] py-[12px] relative size-full">
            <div className="flex flex-[1_0_0] flex-col font-['Figtree:Regular',sans-serif] font-normal h-full justify-center leading-[0] min-h-px min-w-px relative text-[#333] text-[16px]">
              <p className="leading-[24px]">Prefiro não informar</p>
            </div>
            <div className="flex items-center justify-center relative shrink-0">
              <div className="-scale-y-100 flex-none rotate-180">
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
            </div>
          </div>
        </Wrapper>
      </div>
      <div className="font-['Figtree:Medium',sans-serif] font-medium h-[60px] leading-[30px] relative shrink-0 text-[20px] text-black w-[362px]">
        <p className="mb-0">Seus dados serão utilizados para</p>
        <p>emissão da sua declaração.</p>
      </div>
    </div>
  );
}