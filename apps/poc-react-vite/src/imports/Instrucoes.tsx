import svgPaths from "./svg-o3l3qs58l5";

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
        <g clipPath="url(#clip0_95_2245)" id="search">
          <path clipRule="evenodd" d={svgPaths.p18692e80} fill="var(--fill-0, #042E99)" fillRule="evenodd" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_95_2245">
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

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 text-[16px] text-black w-full">
      <p className="font-['Figtree:Bold',sans-serif] font-bold leading-[24px] relative shrink-0 w-full">Instruções</p>
      <div className="font-['Figtree:Regular',sans-serif] font-normal leading-[0] relative shrink-0 w-full">
        <ul className="list-disc mb-0">
          <li className="mb-0 ms-[24px]">
            <span className="leading-[24px]">A prova tem 10 questões;</span>
          </li>
          <li className="mb-0 ms-[24px]">
            <span className="leading-[24px]">O tempo total é de 60 minutos;</span>
          </li>
          <li className="mb-0 ms-[24px]">
            <span className="leading-[24px]">O cronômetro começa ao acessar a prova;</span>
          </li>
          <li className="mb-0 ms-[24px]">
            <span className="leading-[24px]">As respostas são salvas automaticamente;</span>
          </li>
          <li className="mb-0 ms-[24px]">
            <span className="leading-[24px]">Ao acabar o tempo, a prova é encerrada automaticamente e suas respostas ficam registradas.</span>
          </li>
          <li className="ms-[24px]">
            <span className="leading-[24px]">{`Você terá apenas 1 tentativa. `}</span>
          </li>
        </ul>
        <p className="leading-[24px] mb-0 whitespace-pre-wrap">&nbsp;</p>
        <p className="leading-[24px] whitespace-pre-wrap">Boa prova!</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame />
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute bg-white bottom-0 content-stretch flex flex-col items-center justify-center left-[3px] overflow-clip px-[18px] py-[16px] shadow-[0px_0px_12px_0px_rgba(51,51,51,0.2)]">
      <div className="bg-[#ffeac4] content-stretch flex h-[50px] items-center justify-center py-[10px] relative rounded-[26px] shrink-0 w-[360px]" data-name="Botão">
        <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[#333] text-[20px] text-center whitespace-nowrap">Realizar prova</p>
      </div>
    </div>
  );
}

export default function Instrucoes() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[20px] items-center pb-[30px] pt-[90px] px-[20px] relative size-full" data-name="Instruções">
      <div className="absolute bg-[#021b59] content-stretch flex h-[70px] items-center justify-between left-0 px-[20px] py-[10px] top-0 w-[402px]" data-name="Menu Superior">
        <LeadingIcon />
        <Labels />
        <TrailingElements />
      </div>
      <p className="font-['Anek_Devanagari:ExtraBold',sans-serif] font-extrabold leading-[normal] relative shrink-0 text-[32px] text-black w-[362px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Prova 01
      </p>
      <Frame1 />
      <Frame2 />
    </div>
  );
}