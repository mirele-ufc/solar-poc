import clsx from "clsx";
import svgPaths from "./svg-gqlxc03oj7";

function Wrapper1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="flex flex-row items-center justify-center size-full">
      <div className="content-stretch flex items-center justify-center relative size-full">{children}</div>
    </div>
  );
}
type WrapperProps = {
  additionalClassNames?: string;
};

function Wrapper({ children, additionalClassNames = "" }: React.PropsWithChildren<WrapperProps>) {
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

function Frame46Botao({ children }: React.PropsWithChildren<{}>) {
  return (
    <button className="relative rounded-[26px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-2 border-[#021b59] border-solid inset-0 pointer-events-none rounded-[26px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center px-[20px] py-[10px] relative w-full">{children}</div>
      </div>
    </button>
  );
}
type TextProps = {
  text: string;
  additionalClassNames?: string;
};

function Text({ text, additionalClassNames = "" }: TextProps) {
  return (
    <div className={clsx("content-stretch flex items-center justify-center relative", additionalClassNames)}>
      <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[#333] text-[20px] text-center whitespace-nowrap">{text}</p>
    </div>
  );
}

function Document() {
  return (
    <div className="h-[32.667px] relative shrink-0 w-[32px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32.6667">
        <g id="document">
          <path d={svgPaths.p38e6580} fill="var(--fill-0, #021B59)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

export default function AdicaoDeAula() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[20px] items-center pb-[30px] pt-[90px] px-[20px] relative size-full" data-name="Adição de Aula">
      <div className="content-stretch flex flex-col h-[681px] items-start justify-between relative shrink-0 w-[363px]">
        <div className="relative shrink-0 w-full">
          <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
            <div className="content-stretch flex flex-col gap-[16px] items-center justify-center p-[16px] relative w-full">
              <p className="font-['Figtree:Bold',sans-serif] font-bold h-[26px] leading-[30px] relative shrink-0 text-[#021b59] text-[20px] w-[327px]">Módulo 01</p>
              <div className="bg-[#c5d6ff] content-stretch flex h-[60px] items-center justify-between px-[20px] relative shrink-0 w-[327px]">
                <p className="flex-[1_0_0] font-['Figtree:Medium',sans-serif] font-medium h-[31px] leading-[30px] min-h-px min-w-px relative text-[20px] text-black">Aula 01</p>
                <div className="relative shrink-0 size-[28px]" data-name="close">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
                    <g>
                      <path clipRule="evenodd" d={svgPaths.p1a4ee100} fill="var(--fill-0, #801436)" fillRule="evenodd" id="Vector" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
        </div>
        <div className="content-stretch cursor-pointer flex flex-col gap-[20px] items-start relative shrink-0 w-full">
          <Frame46Botao>
            <div className="content-stretch flex gap-[6px] items-center justify-center relative shrink-0">
              <Document />
              <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[#333] text-[20px] text-center whitespace-nowrap">Adicionar aula</p>
            </div>
          </Frame46Botao>
          <Frame46Botao>
            <div className="content-stretch flex gap-[6px] items-center justify-center relative shrink-0">
              <Document />
              <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[#333] text-[20px] text-left whitespace-nowrap">Adicionar módulo</p>
            </div>
          </Frame46Botao>
        </div>
      </div>
      <div className="absolute bg-white left-[26px] shadow-[0px_0px_6.6px_2px_#606060] top-[268px] w-[351px]" data-name="Pop Up">
        <div className="overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col gap-[20px] items-start px-[14px] py-[13px] relative w-full">
            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
              <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[#333] text-[20px] whitespace-nowrap">Adicionar Aula</p>
              <div className="relative shrink-0 size-[24px]" data-name="close">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                  <g>
                    <path clipRule="evenodd" d={svgPaths.p13627100} fill="var(--fill-0, #021B59)" fillRule="evenodd" id="Vector" />
                  </g>
                </svg>
              </div>
            </div>
            <div className="content-stretch flex h-[68px] items-center justify-center relative shrink-0 w-full">
              <div aria-hidden="true" className="absolute border border-[#8e8e8e] border-dashed inset-0 pointer-events-none" />
              <div className="flex flex-col font-['Figtree:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#606060] text-[16px] text-center w-[233px]">
                <p className="leading-[24px]">Clique aqui para selecionar um arquivo para adicionar</p>
              </div>
            </div>
            <button className="cursor-pointer relative shrink-0 w-full" data-name="Dropdown">
              <div className="content-stretch flex flex-col items-start relative w-full">
                <p className="font-['Figtree:Medium',sans-serif] font-medium h-[36px] leading-[30px] relative shrink-0 text-[#333] text-[20px] text-left w-full">Módulo</p>
                <div className="h-[50px] relative shrink-0 w-full">
                  <div aria-hidden="true" className="absolute border border-[#8e8e8e] border-solid inset-0 pointer-events-none" />
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex gap-[10px] items-center px-[20px] py-[12px] relative size-full">
                      <div className="flex flex-[1_0_0] flex-col font-['Figtree:Regular',sans-serif] font-normal h-full justify-center leading-[0] min-h-px min-w-px relative text-[#333] text-[16px] text-left">
                        <p className="leading-[24px]">Texto</p>
                      </div>
                      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Frame">
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
              </div>
            </button>
            <button className="bg-[#ffeac4] cursor-pointer relative rounded-[26px] shrink-0 w-full" data-name="Botão">
              <div className="flex flex-row items-center justify-center size-full">
                <Text text="Finalizar" additionalClassNames="py-[9px] w-full" />
              </div>
            </button>
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
              <Wrapper additionalClassNames="relative shrink-0 size-[20px]">
                <g clipPath="url(#clip0_6_2388)" id="search">
                  <path clipRule="evenodd" d={svgPaths.p18692e80} fill="var(--fill-0, #042E99)" fillRule="evenodd" id="Vector" />
                </g>
                <defs>
                  <clipPath id="clip0_6_2388">
                    <rect fill="white" height="20" width="20" />
                  </clipPath>
                </defs>
              </Wrapper>
              <div className="flex flex-[1_0_0] flex-col font-['Figtree:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#333] text-[16px]">
                <p className="leading-[24px]">Texto</p>
              </div>
              <div className="relative shrink-0 size-[30px]" data-name="Trailing-icon-button">
                <Wrapper1>
                  <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[100px] shrink-0 w-[40px]" data-name="Content">
                    <StateLayer>
                      <div className="absolute inset-[8.33%_20.83%_12.5%_20.83%]" data-name="icon">
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 19">
                          <path d={svgPaths.p10382e00} fill="var(--fill-0, #042E99)" id="icon" />
                        </svg>
                      </div>
                    </StateLayer>
                  </div>
                </Wrapper1>
              </div>
            </div>
            <button className="block cursor-pointer relative shrink-0 size-[46px]" data-name="Trailing elements">
              <div className="absolute left-0 size-[48px] top-0" data-name="Trailing icon">
                <Wrapper1>
                  <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[100px] shrink-0 w-[40px]" data-name="Content">
                    <StateLayer>
                      <Wrapper additionalClassNames="absolute inset-[8.33%]">
                        <path d={svgPaths.pe3d9c80} fill="var(--fill-0, #FFEAC4)" id="icon" />
                      </Wrapper>
                    </StateLayer>
                  </div>
                </Wrapper1>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="-translate-x-1/2 absolute bg-white bottom-0 content-stretch flex flex-col items-center justify-center left-1/2 px-[18px] py-[16px] shadow-[0px_0px_12px_0px_rgba(51,51,51,0.2)]">
        <div className="bg-[#ffeac4] h-[50px] relative rounded-[26px] shrink-0 w-[360px]" data-name="Botão">
          <div className="flex flex-row items-center justify-center size-full">
            <Text text="Próximo" additionalClassNames="py-[10px] size-full" />
          </div>
        </div>
      </div>
    </div>
  );
}