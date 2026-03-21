import svgPaths from "./svg-e066os52e9";
import imgRectangle30 from "../assets/22ebf3a06cf8215c6bd0946f42302bc2204ed790.png";

function Frame() {
  return (
    <div className="absolute bg-white bottom-px content-stretch flex flex-col items-center justify-center left-[3px] overflow-clip px-[18px] py-[16px] shadow-[0px_0px_12px_0px_rgba(51,51,51,0.2)]">
      <div className="bg-[#ffeac4] content-stretch flex h-[50px] items-center justify-center py-[10px] relative rounded-[26px] shrink-0 w-[360px]" data-name="Botão">
        <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[#333] text-[20px] text-center whitespace-nowrap">Ir para próxima aula</p>
      </div>
    </div>
  );
}

function ArrowDown() {
  return <div className="size-[24px]" data-name="arrow-down" />;
}

function Modulo() {
  return (
    <div className="h-[36px] relative shrink-0 w-[304px]" data-name="módulo 01">
      <p className="absolute font-['Figtree:Bold',sans-serif] font-bold leading-[36px] left-0 text-[24px] text-black top-0 whitespace-nowrap">Aula 01: subtítulo</p>
      <div className="absolute flex items-center justify-center left-[292px] size-[24px] top-[6px]">
        <div className="flex-none rotate-180">
          <ArrowDown />
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="-translate-x-1/2 absolute bg-[#c5d6ff] content-stretch flex flex-col gap-[15px] h-[270px] items-center left-1/2 pb-[18px] pt-[22px] px-[21px] rounded-[12px] top-[160px] w-[360px]">
      <div className="h-[175px] relative rounded-[10px] shrink-0 w-[318px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[10px] size-full" src={imgRectangle30} />
      </div>
      <Modulo />
    </div>
  );
}

export default function PowerBiModulosAula() {
  return (
    <div className="bg-white relative size-full" data-name="Power bi módulos Aula">
      <Frame />
      <p className="absolute font-['Figtree:Bold',sans-serif] font-bold leading-[36px] left-[20px] text-[24px] text-black top-[88px] whitespace-nowrap">Power BI - Fundamentos</p>
      <div className="absolute bg-[#021b59] content-stretch flex h-[70px] items-center justify-between left-0 px-[20px] py-[10px] top-0 w-[402px]" data-name="Menu Superior">
        <button className="content-stretch cursor-pointer flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[46px]" data-name="Leading icon">
          <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[12px] shrink-0 w-[40px]" data-name="Content">
            <div className="content-stretch flex h-[40px] items-center justify-center relative shrink-0 w-full" data-name="State-layer">
              <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon">
                <div className="absolute bottom-1/4 left-[12.5%] right-[12.5%] top-1/4" data-name="icon">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 12">
                    <path d={svgPaths.p2304a600} fill="var(--fill-0, #FFEAC4)" id="icon" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </button>
        <div className="bg-white content-stretch flex gap-[10px] h-[40px] items-center justify-center px-[20px] py-[6px] relative rounded-[12px] shrink-0 w-[250px]" data-name="Labels">
          <div className="relative shrink-0 size-[20px]" data-name="search">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
              <g clipPath="url(#clip0_154_2304)" id="search">
                <path clipRule="evenodd" d={svgPaths.p18692e80} fill="var(--fill-0, #042E99)" fillRule="evenodd" id="Vector" />
              </g>
              <defs>
                <clipPath id="clip0_154_2304">
                  <rect fill="white" height="20" width="20" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="flex flex-[1_0_0] flex-col font-['Figtree:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#333] text-[16px]">
            <p className="leading-[24px]">Texto</p>
          </div>
          <div className="content-stretch flex items-center justify-center relative shrink-0 size-[30px]" data-name="Trailing-icon-button">
            <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[100px] shrink-0 w-[40px]" data-name="Content">
              <div className="content-stretch flex h-[40px] items-center justify-center relative shrink-0 w-full" data-name="State-layer">
                <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon">
                  <div className="absolute inset-[8.33%_20.83%_12.5%_20.83%]" data-name="icon">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 19">
                      <path d={svgPaths.p10382e00} fill="var(--fill-0, #042E99)" id="icon" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button className="block cursor-pointer overflow-clip relative rounded-[12px] shrink-0 size-[46px]" data-name="Trailing elements">
          <div className="absolute content-stretch flex items-center justify-center left-0 size-[48px] top-0" data-name="Trailing icon">
            <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[100px] shrink-0 w-[40px]" data-name="Content">
              <div className="content-stretch flex h-[40px] items-center justify-center relative shrink-0 w-full" data-name="State-layer">
                <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon">
                  <div className="absolute inset-[8.33%]" data-name="icon">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                      <path d={svgPaths.pe3d9c80} fill="var(--fill-0, #FFEAC4)" id="icon" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </button>
      </div>
      <Frame1 />
      <div className="absolute font-['Figtree:Regular',sans-serif] font-normal leading-[24px] left-[23px] text-[16px] text-black top-[443px] w-[357px]">
        <p className="mb-0">Nesta primeira aula, você terá uma visão geral do Power BI e entenderá como essa ferramenta pode ajudar na análise e visualização de dados. O Power BI permite transformar grandes volumes de informações em relatórios interativos e dashboards intuitivos, facilitando a tomada de decisões baseada em dados.</p>
        <p className="mb-0">Durante a aula, conheceremos os principais componentes da ferramenta, como o Power BI Desktop, o Power BI Service e os dashboards. Também veremos exemplos de como empresas utilizam o Power BI para acompanhar indicadores, identificar tendências e melhorar processos.</p>
        <p>Ao final desta aula, você compreenderá o papel do Power BI no contexto de Business Intelligence (BI) e estará preparado para começar a importar e explorar dados nas próximas aulas do curso.</p>
      </div>
    </div>
  );
}