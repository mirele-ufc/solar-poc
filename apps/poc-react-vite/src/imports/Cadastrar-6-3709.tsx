import svgPaths from "./svg-5q5fw6m2fl";
import imgUfcLogo1 from "figma:asset/9098abf5bf97a1aac4c76f171ec108cee92cfddb.png";
import imgAtivo224X1 from "figma:asset/a17a08a750e97ba9bb12c3ad582c426a8debf0fa.png";

function Labels({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start relative w-full">{children}</div>
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
type Text1Props = {
  text: string;
};

function Text1({ text }: Text1Props) {
  return (
    <Wrapper>
      <div className="content-stretch flex gap-[10px] items-center px-[20px] py-[12px] relative size-full">
        <div className="flex flex-[1_0_0] flex-col font-['Figtree:Regular',sans-serif] font-normal h-full justify-center leading-[0] min-h-px min-w-px relative text-[#8e8e8e] text-[16px]">
          <p className="leading-[24px]">{text}</p>
        </div>
        <div className="relative shrink-0 size-[24px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
            <g id="eye">
              <path clipRule="evenodd" d={svgPaths.p15535700} fill="var(--fill-0, #021B59)" fillRule="evenodd" id="Vector" />
            </g>
          </svg>
        </div>
      </div>
    </Wrapper>
  );
}
type TextProps = {
  text: string;
};

function Text({ text }: TextProps) {
  return (
    <Wrapper>
      <div className="content-stretch flex items-center px-[20px] py-[12px] relative size-full">
        <div className="flex flex-[1_0_0] flex-col font-['Figtree:Regular',sans-serif] font-normal h-full justify-center leading-[0] min-h-px min-w-px relative text-[#8e8e8e] text-[16px]">
          <p className="leading-[24px]">{text}</p>
        </div>
      </div>
    </Wrapper>
  );
}

export default function Cadastrar() {
  return (
    <div className="bg-gradient-to-b content-stretch flex flex-col from-[#021b59] gap-[20px] items-center p-[20px] relative size-full to-[#042e99]" data-name="Cadastrar">
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
      <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
        <Labels>
          <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[#ffeac4] text-[20px] w-full">CPF</p>
          <Text text="Formato: 000.000.000-00" />
        </Labels>
        <Labels>
          <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[#ffeac4] text-[20px] w-full">Email</p>
          <Text text="Insira seu email" />
        </Labels>
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Labels">
          <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[#ffeac4] text-[20px] w-full">Senha</p>
          <Text1 text="Insira sua senha" />
        </div>
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Labels">
          <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[#ffeac4] text-[20px] w-full">Confirme sua senha</p>
          <Text1 text="Repita sua senha" />
        </div>
        <div className="content-stretch flex h-[61px] items-start relative shrink-0 w-full">
          <div className="h-[46px] relative rounded-[100px] shrink-0" data-name="Checkbox">
            <div className="flex flex-row items-center justify-center size-full">
              <div className="content-stretch flex h-full items-center justify-center p-[10px] relative">
                <div className="relative rounded-[2px] shrink-0 size-[22px]" data-name="container">
                  <div aria-hidden="true" className="absolute border-2 border-[#ffeac4] border-solid inset-0 pointer-events-none rounded-[2px]" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-[1_0_0] flex-col font-['Figtree:Regular',sans-serif] font-normal h-[61px] justify-center leading-[0] min-h-px min-w-px relative text-[#ffeac4] text-[16px]">
            <p className="leading-[24px]">Concordo com os termos de privacidade e segurança.</p>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[120px] items-center overflow-clip relative shrink-0 w-full">
        <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full">
          <button className="bg-[#ffeac4] cursor-pointer relative shrink-0 w-full" data-name="Botão">
            <div className="flex flex-row items-center justify-center size-full">
              <div className="content-stretch flex items-center justify-center py-[9px] relative w-full">
                <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[#333] text-[20px] text-center whitespace-nowrap">Cadastrar</p>
              </div>
            </div>
          </button>
          <div className="h-[50px] relative shrink-0 w-full" data-name="botão  secundário">
            <div aria-hidden="true" className="absolute border-2 border-[#ffeac4] border-solid inset-0 pointer-events-none" />
            <div className="flex flex-col items-center justify-center size-full">
              <div className="content-stretch flex flex-col items-center justify-center px-[20px] py-[10px] relative size-full">
                <div className="flex flex-col font-['Figtree:Medium',sans-serif] font-medium h-[23px] justify-center leading-[0] relative shrink-0 text-[#ffeac4] text-[20px] text-center w-full">
                  <p className="leading-[30px]">Já sou usuário</p>
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
  );
}