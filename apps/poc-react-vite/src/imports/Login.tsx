import clsx from "clsx";
import svgPaths from "./svg-ppphmxjoa5";
import imgUfcLogo1 from "../assets/9098abf5bf97a1aac4c76f171ec108cee92cfddb.png";
import imgAtivo224X1 from "../assets/a17a08a750e97ba9bb12c3ad582c426a8debf0fa.png";

function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="bg-white h-[60px] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#8e8e8e] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">{children}</div>
    </div>
  );
}
type BotaoText2Props = {
  text: string;
  additionalClassNames?: string;
};

function BotaoText2({ text, children, additionalClassNames = "" }: React.PropsWithChildren<BotaoText2Props>) {
  return (
    <div className={clsx("content-stretch flex gap-[6px] items-center relative shrink-0", additionalClassNames)}>
      <div className="h-[32.667px] relative shrink-0 w-[32px]" data-name="document">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32.6667">
          <g id="document">{children}</g>
        </svg>
      </div>
      <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[#333] text-[20px] text-center whitespace-nowrap">{text}</p>
    </div>
  );
}
type BotaoText1Props = {
  text: string;
  additionalClassNames?: string;
};

function BotaoText1({ text, additionalClassNames = "" }: BotaoText1Props) {
  return (
    <div className={clsx("content-stretch flex items-center justify-center relative w-full", additionalClassNames)}>
      <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[#333] text-[20px] text-center whitespace-nowrap">{text}</p>
    </div>
  );
}
type BotaoTextProps = {
  text: string;
};

function BotaoText({ text }: BotaoTextProps) {
  return (
    <div className="flex flex-row items-center justify-center size-full">
      <div className="content-stretch flex items-center justify-center py-[10px] relative w-full">
        <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[20px] text-black text-center whitespace-nowrap">{text}</p>
      </div>
    </div>
  );
}
type BotaoProps = {
  className?: string;
  clicado?: boolean;
  modelo?: "Mobile";
  tipo?: "Primário" | "Secundário" | "Terciário";
};

function Botao({ className, clicado = true, modelo = "Mobile", tipo = "Primário" }: BotaoProps) {
  if (clicado && tipo === "Secundário" && modelo === "Mobile") {
    return (
      <div className={className || "bg-[#759bfb] relative w-[360px]"} data-name="Clicado=True, Tipo=Secundário, Modelo=Mobile">
        <BotaoText text="Cadastrar" />
      </div>
    );
  }
  if (!clicado && tipo === "Primário" && modelo === "Mobile") {
    return (
      <button className={className || "bg-[#ffeac4] cursor-pointer relative w-[360px]"} data-name="Clicado=False, Tipo=Primário, Modelo=Mobile">
        <div className="flex flex-row items-center justify-center size-full">
          <BotaoText1 text="Acessar" additionalClassNames="py-[9px]" />
        </div>
      </button>
    );
  }
  if (!clicado && tipo === "Secundário" && modelo === "Mobile") {
    return (
      <button className={className || "bg-[#c5d6ff] cursor-pointer relative w-[360px]"} data-name="Clicado=False, Tipo=Secundário, Modelo=Mobile">
        <BotaoText text="Cadastrar" />
      </button>
    );
  }
  if (!clicado && tipo === "Terciário" && modelo === "Mobile") {
    return (
      <button className={className || "-translate-x-1/2 -translate-y-1/2 cursor-pointer relative w-[360px]"} data-name="Clicado=False, Tipo=Terciário, Modelo=Mobile">
        <div aria-hidden="true" className="absolute border-2 border-[#021b59] border-solid inset-0 pointer-events-none" />
        <div className="flex flex-col items-center justify-center size-full">
          <div className="content-stretch flex flex-col items-center justify-center px-[20px] py-[10px] relative w-full">
            <BotaoText2 text="Adicionar aula" additionalClassNames="justify-center">
              <path d={svgPaths.p38e6580} fill="var(--fill-0, #021B59)" id="Vector" />
            </BotaoText2>
          </div>
        </div>
      </button>
    );
  }
  if (clicado && tipo === "Terciário" && modelo === "Mobile") {
    return (
      <div className={className || "-translate-x-1/2 -translate-y-1/2 bg-[#759bfb] relative w-[360px]"} data-name="Clicado=True, Tipo=Terciário, Modelo=Mobile">
        <div className="flex flex-col items-center justify-center size-full">
          <div className="content-stretch flex flex-col items-center justify-center px-[20px] py-[9px] relative w-full">
            <BotaoText2 text="Adicionar aula">
              <path d={svgPaths.p38e6580} fill="var(--fill-0, #333333)" id="Vector" />
            </BotaoText2>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={className || "bg-[rgba(255,239,208,0.8)] relative w-[360px]"} data-name="Clicado=True, Tipo=Primário, Modelo=Mobile">
      <div className="flex flex-row items-center justify-center size-full">
        <BotaoText1 text="Acessar" additionalClassNames="py-[10px]" />
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <div className="bg-gradient-to-b content-stretch flex flex-col from-[#021b59] gap-[20px] items-center p-[20px] relative size-full to-[#042e99]" data-name="Login">
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
        <div className="relative shrink-0 w-full" data-name="Labels">
          <div className="content-stretch flex flex-col items-start relative w-full">
            <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[#ffeac4] text-[20px] w-full">Login</p>
            <Wrapper>
              <div className="content-stretch flex items-center px-[20px] py-[12px] relative size-full">
                <div className="flex flex-[1_0_0] flex-col font-['Figtree:Regular',sans-serif] font-normal h-full justify-center leading-[0] min-h-px min-w-px relative text-[#8e8e8e] text-[16px]">
                  <p className="leading-[24px]">Insira seu nome de usuário ou email</p>
                </div>
              </div>
            </Wrapper>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[12px] items-end relative shrink-0 w-full">
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Labels">
            <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[#ffeac4] text-[20px] w-full">Senha</p>
            <Wrapper>
              <div className="content-stretch flex gap-[10px] items-center px-[20px] py-[12px] relative size-full">
                <div className="flex flex-[1_0_0] flex-col font-['Figtree:Regular',sans-serif] font-normal h-full justify-center leading-[0] min-h-px min-w-px relative text-[#8e8e8e] text-[16px]">
                  <p className="leading-[24px]">Insira sua senha</p>
                </div>
                <div className="relative shrink-0 size-[24px]" data-name="eye">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                    <g id="eye">
                      <path clipRule="evenodd" d={svgPaths.p15535700} fill="var(--fill-0, #021B59)" fillRule="evenodd" id="Vector" />
                    </g>
                  </svg>
                </div>
              </div>
            </Wrapper>
          </div>
          <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#ffeac4] text-[16px] whitespace-nowrap">Esqueceu a sua senha?</p>
        </div>
      </div>
      <div className="content-stretch flex flex-[1_0_0] flex-col items-center justify-between min-h-px min-w-px relative w-full">
        <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-[360px]">
          <Botao className="bg-[#ffeac4] cursor-pointer relative shrink-0 w-full" clicado={false} />
          <div className="bg-[#efbbdc] h-[50px] relative shrink-0 w-full" data-name="botão  secundário">
            <div className="flex flex-col items-center justify-center size-full">
              <div className="content-stretch flex flex-col items-center justify-center px-[20px] py-[10px] relative size-full">
                <div className="flex flex-col font-['Figtree:Medium',sans-serif] font-medium h-[23px] justify-center leading-[0] relative shrink-0 text-[#333] text-[20px] text-center w-full">
                  <p className="leading-[30px]">Cadastrar</p>
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