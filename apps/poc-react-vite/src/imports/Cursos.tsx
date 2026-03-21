import svgPaths from "./svg-xz30l7l57d";
import imgRectangle8 from "figma:asset/22ebf3a06cf8215c6bd0946f42302bc2204ed790.png";

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
type ImageAndTextProps = {
  text: string;
};

function ImageAndText({ text }: ImageAndTextProps) {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0">
      <div className="h-[120px] relative shrink-0 w-[217px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgRectangle8} />
      </div>
      <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[20px] text-black w-[217px]">{text}</p>
    </div>
  );
}

export default function Cursos() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[30px] items-start pt-[90px] px-[20px] relative size-full" data-name="Cursos">
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
        <div className="font-['Figtree:Bold',sans-serif] font-bold h-[37px] leading-[36px] relative shrink-0 text-[#021b59] text-[24px] w-full">
          <p className="mb-0">Conheça nossos cursos!</p>
          <p>&nbsp;</p>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[21px] items-start relative shrink-0 w-[382px]">
        <p className="font-['Figtree:Bold',sans-serif] font-bold leading-[36px] relative shrink-0 text-[#021b59] text-[24px] w-full">Computação</p>
        <div className="content-stretch flex gap-[10px] items-start overflow-x-auto overflow-y-clip relative shrink-0 w-full">
          <ImageAndText text="Power Bi - Fundamentos" />
          <ImageAndText text="Python Iniciante" />
          <ImageAndText text="Matemática básica" />
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-[382px]">
        <p className="font-['Figtree:Bold',sans-serif] font-bold leading-[36px] relative shrink-0 text-[#021b59] text-[24px] w-full">Design</p>
        <div className="content-stretch flex gap-[10px] items-start overflow-x-auto overflow-y-clip py-[10px] relative shrink-0 w-full">
          <ImageAndText text="História do Design" />
          <ImageAndText text="Design Gráfico - Iniciante" />
          <ImageAndText text="Design de Interfaces Gráficas" />
        </div>
      </div>
      <div className="absolute bottom-0 h-[874px] left-0 pointer-events-none top-0">
        <div className="bg-[#021b59] h-[70px] pointer-events-auto sticky top-0 w-[402px]" data-name="Menu Superior">
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
      </div>
    </div>
  );
}