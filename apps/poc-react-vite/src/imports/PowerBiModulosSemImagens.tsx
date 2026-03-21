import svgPaths from "./svg-ypsfft9be4";
import imgRectangle30 from "figma:asset/22ebf3a06cf8215c6bd0946f42302bc2204ed790.png";

function ArrowDown() {
  return (
    <div className="absolute left-[292px] size-[24px] top-[2px]" data-name="arrow-down">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="arrow-down">
          <path clipRule="evenodd" d={svgPaths.p1d1cb700} fill="var(--fill-0, black)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Component() {
  return (
    <div className="h-[95px] relative shrink-0 w-[304px]" data-name="Component 1">
      <p className="absolute font-['Figtree:Bold',sans-serif] font-bold leading-[36px] left-0 text-[24px] text-black top-0 whitespace-nowrap">Módulo 01</p>
      <ArrowDown />
    </div>
  );
}

function Frame() {
  return (
    <div className="-translate-x-1/2 absolute bg-[#c5d6ff] content-stretch flex flex-col gap-[8px] h-[259px] items-center left-1/2 pb-[18px] pt-[22px] px-[21px] rounded-[12px] top-[144px] w-[360px]">
      <div className="h-[175px] relative rounded-[10px] shrink-0 w-[318px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[10px] size-full" src={imgRectangle30} />
      </div>
      <Component />
    </div>
  );
}

function StateLayer() {
  return (
    <div className="content-stretch flex h-[40px] items-center justify-center relative shrink-0 w-full" data-name="State-layer">
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon">
        <div className="absolute bottom-1/4 left-[12.5%] right-[12.5%] top-1/4" data-name="icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 12">
            <path d={svgPaths.p2304a600} fill="var(--fill-0, #FFEAC4)" id="icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Content() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[12px] shrink-0 w-[40px]" data-name="Content">
      <StateLayer />
    </div>
  );
}

function LeadingIcon() {
  return (
    <button className="content-stretch cursor-pointer flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[46px]" data-name="Leading icon">
      <Content />
    </button>
  );
}

function Search() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="search">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_154_2232)" id="search">
          <path clipRule="evenodd" d={svgPaths.p18692e80} fill="var(--fill-0, #042E99)" fillRule="evenodd" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_154_2232">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function StateLayer1() {
  return (
    <div className="content-stretch flex h-[40px] items-center justify-center relative shrink-0 w-full" data-name="State-layer">
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon">
        <div className="absolute inset-[8.33%_20.83%_12.5%_20.83%]" data-name="icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 19">
            <path d={svgPaths.p10382e00} fill="var(--fill-0, #042E99)" id="icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Content1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[100px] shrink-0 w-[40px]" data-name="Content">
      <StateLayer1 />
    </div>
  );
}

function Labels() {
  return (
    <div className="bg-white content-stretch flex gap-[10px] h-[40px] items-center justify-center px-[20px] py-[6px] relative rounded-[12px] shrink-0 w-[250px]" data-name="Labels">
      <Search />
      <div className="flex flex-[1_0_0] flex-col font-['Figtree:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#333] text-[16px]">
        <p className="leading-[24px]">Texto</p>
      </div>
      <div className="content-stretch flex items-center justify-center relative shrink-0 size-[30px]" data-name="Trailing-icon-button">
        <Content1 />
      </div>
    </div>
  );
}

function StateLayer2() {
  return (
    <div className="content-stretch flex h-[40px] items-center justify-center relative shrink-0 w-full" data-name="State-layer">
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon">
        <div className="absolute inset-[8.33%]" data-name="icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d={svgPaths.pe3d9c80} fill="var(--fill-0, #FFEAC4)" id="icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Content2() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[100px] shrink-0 w-[40px]" data-name="Content">
      <StateLayer2 />
    </div>
  );
}

function TrailingElements() {
  return (
    <button className="block cursor-pointer overflow-clip relative rounded-[12px] shrink-0 size-[46px]" data-name="Trailing elements">
      <div className="absolute content-stretch flex items-center justify-center left-0 size-[48px] top-0" data-name="Trailing icon">
        <Content2 />
      </div>
    </button>
  );
}

export default function PowerBiModulosSemImagens() {
  return (
    <div className="bg-white relative size-full" data-name="Power bi módulos SEM IMAGENS">
      <p className="absolute font-['Figtree:Bold',sans-serif] font-bold leading-[36px] left-[20px] text-[24px] text-black top-[88px] whitespace-nowrap">Power BI - Fundamentos</p>
      <Frame />
      <div className="absolute bg-[#021b59] content-stretch flex h-[70px] items-center justify-between left-0 px-[20px] py-[10px] top-0 w-[402px]" data-name="Menu Superior">
        <LeadingIcon />
        <Labels />
        <TrailingElements />
      </div>
    </div>
  );
}