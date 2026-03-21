import imgUfcLogo1 from "../assets/9098abf5bf97a1aac4c76f171ec108cee92cfddb.png";
import imgAtivo224X1 from "../assets/a17a08a750e97ba9bb12c3ad582c426a8debf0fa.png";

export default function EsqueceuASenha() {
  return (
    <div className="bg-gradient-to-b content-stretch flex flex-col from-[#021b59] gap-[20px] items-center p-[20px] relative size-full to-[#042e99]" data-name="Esqueceu a senha">
      <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
        <div className="col-1 h-[76px] ml-[72px] mt-0 relative row-1 w-[135px]" data-name="ufc logo 1">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgUfcLogo1} />
        </div>
        <div className="col-1 h-[35px] ml-0 mt-[17px] relative row-1 w-[63px]" data-name="Ativo 22@4x 1">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgAtivo224X1} />
        </div>
      </div>
      <div className="flex flex-col font-['Anek_Devanagari:ExtraBold',sans-serif] font-extrabold h-[90px] justify-center leading-[0] relative shrink-0 text-[#ffeac4] text-[96px] text-center w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">SOLAR</p>
      </div>
      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[40px] items-start min-h-px min-w-px relative w-full">
        <div className="h-[240px] relative shrink-0 w-full">
          <div className="absolute content-stretch flex flex-col gap-[20px] items-start left-0 top-0 w-[362px]">
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 text-[#ffeac4] w-full">
              <p className="font-['Figtree:Bold',sans-serif] font-bold leading-[36px] relative shrink-0 text-[24px] w-full">Esqueceu a sua senha?</p>
              <div className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[20px] w-full whitespace-pre-wrap">
                <p className="mb-0">{`Informe o email usado no cadastro `}</p>
                <p>para receber instruções de recuperação da senha.</p>
              </div>
            </div>
            <div className="relative shrink-0 w-full" data-name="Labels">
              <div className="content-stretch flex flex-col items-start relative w-full">
                <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[#ffeac4] text-[20px] w-full">Email</p>
                <div className="bg-white h-[60px] relative shrink-0 w-full">
                  <div aria-hidden="true" className="absolute border border-[#8e8e8e] border-solid inset-0 pointer-events-none" />
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex items-center px-[20px] py-[12px] relative size-full">
                      <div className="flex flex-[1_0_0] flex-col font-['Figtree:Regular',sans-serif] font-normal h-full justify-center leading-[0] min-h-px min-w-px relative text-[#8e8e8e] text-[16px]">
                        <p className="leading-[24px]">Insira seu email</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-[1_0_0] flex-col items-center justify-between min-h-px min-w-px relative w-full">
          <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-[360px]">
            <button className="bg-[#ffeac4] cursor-pointer relative shrink-0 w-full" data-name="Botão">
              <div className="flex flex-row items-center justify-center size-full">
                <div className="content-stretch flex items-center justify-center py-[9px] relative w-full">
                  <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[#333] text-[20px] text-center whitespace-nowrap">Enviar</p>
                </div>
              </div>
            </button>
            <div className="h-[50px] relative shrink-0 w-full" data-name="botão  secundário">
              <div aria-hidden="true" className="absolute border-2 border-[#ffeac4] border-solid inset-0 pointer-events-none" />
              <div className="flex flex-col items-center justify-center size-full">
                <div className="content-stretch flex flex-col items-center justify-center px-[20px] py-[10px] relative size-full">
                  <div className="flex flex-col font-['Figtree:Medium',sans-serif] font-medium h-[23px] justify-center leading-[0] relative shrink-0 text-[#ffeac4] text-[20px] text-center w-full">
                    <p className="leading-[30px]">Voltar ao login</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col font-['Figtree:Regular',sans-serif] font-normal items-start leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] text-center w-[230px]">
            <p className="relative shrink-0 w-[230px]">Portais</p>
            <p className="relative shrink-0 w-[230px]">Desenvolvimento</p>
            <p className="relative shrink-0 w-[230px]">Política de privacidade</p>
            <p className="relative shrink-0 w-[230px]">Ajuda</p>
            <p className="relative shrink-0 w-[230px]">Idioma</p>
          </div>
        </div>
      </div>
    </div>
  );
}