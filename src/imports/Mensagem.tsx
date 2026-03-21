import svgPaths from "./svg-nhjpeemzab";
import { imgGroup } from "./svg-xbgbx";

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p213ee031} fill="var(--fill-0, #FFEAC4)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Figtree:Medium',sans-serif] font-medium leading-[24px] left-[22px] text-[#ffeac4] text-[16px] text-center top-[-0.5px] whitespace-nowrap">Voltar</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[24px] items-center left-0 rounded-[6px] top-0 w-[71.417px]" data-name="Button">
      <Icon />
      <Text />
    </div>
  );
}

function Button1() {
  return (
    <div className="flex-[1_0_0] h-[19.5px] min-h-px min-w-px relative rounded-[6px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Figtree:Regular',sans-serif] font-normal leading-[19.5px] left-[20.5px] text-[13px] text-[rgba(255,234,196,0.7)] text-center top-[1.25px] whitespace-nowrap">Cursos</p>
      </div>
    </div>
  );
}

function ListItem() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[40.65px]" data-name="List Item">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Button1 />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[4.1px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[19.5px] left-0 not-italic text-[13px] text-[rgba(255,234,196,0.4)] top-[-1.75px] whitespace-nowrap">›</p>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="flex-[1_0_0] h-[19.5px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Figtree:Regular',sans-serif] font-normal leading-[19.5px] left-0 text-[13px] text-[rgba(255,234,196,0.5)] top-[1.25px] whitespace-nowrap">Perfil</p>
      </div>
    </div>
  );
}

function ListItem1() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[37.683px]" data-name="List Item">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Text1 />
        <Text2 />
      </div>
    </div>
  );
}

function NumberedList() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[19.5px] items-center left-[28px] top-[30px] w-[832px]" data-name="Numbered List">
      <ListItem />
      <ListItem1 />
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[49.5px] relative shrink-0 w-[860px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Button />
        <NumberedList />
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Figtree:Bold',sans-serif] font-bold leading-[33px] left-[96px] text-[#ffeac4] text-[22px] text-center top-0 whitespace-nowrap">Prof. Eduardo Silva</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Figtree:Regular',sans-serif] font-normal leading-[21px] left-[95.77px] text-[14px] text-[rgba(255,234,196,0.8)] text-center top-0 whitespace-nowrap">Estudante</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[56px] items-start left-0 top-[122px] w-[191.517px]" data-name="Container">
      <Paragraph />
      <Paragraph1 />
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[54px] relative shrink-0 w-[43.55px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Figtree:Bold',sans-serif] font-bold leading-[54px] left-0 text-[#ffeac4] text-[36px] top-[-0.5px] whitespace-nowrap">PS</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute bg-[#042e99] left-0 rounded-[3.402820018375656e+38px] size-[110px] top-0" data-name="Container">
      <div className="content-stretch flex items-center justify-center overflow-clip pl-[33.217px] pr-[33.233px] py-[4px] relative rounded-[inherit] size-full">
        <Text3 />
      </div>
      <div aria-hidden="true" className="absolute border-4 border-[#ffeac4] border-solid inset-0 pointer-events-none rounded-[3.402820018375656e+38px]" />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p30d32980} fill="var(--fill-0, #021B59)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute bg-[#ffeac4] content-stretch flex items-center justify-center left-[76px] px-[8px] py-[2px] rounded-[3.402820018375656e+38px] size-[34px] top-[76px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#021b59] border-solid inset-0 pointer-events-none rounded-[3.402820018375656e+38px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)]" />
      <Icon1 />
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute left-[40.75px] size-[110px] top-0" data-name="Container">
      <Container6 />
      <Button2 />
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[178px] relative shrink-0 w-[191.517px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container4 />
        <Container5 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[323.5px] items-center pt-[32px] relative shrink-0 w-full" data-name="Container">
      <Container2 />
      <Container3 />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex flex-col h-[323.5px] items-start left-0 px-[190px] top-0 w-[1280px]" data-name="Container" style={{ backgroundImage: "linear-gradient(rgb(2, 27, 89) 0%, rgb(2, 29, 94) 8.3333%, rgb(2, 30, 99) 16.667%, rgb(2, 32, 104) 25%, rgb(3, 33, 110) 33.333%, rgb(3, 35, 115) 41.667%, rgb(3, 36, 120) 50%, rgb(3, 38, 126) 58.333%, rgb(3, 40, 131) 66.667%, rgb(3, 41, 136) 75%, rgb(4, 43, 142) 83.333%, rgb(4, 44, 147) 91.667%, rgb(4, 46, 153) 100%)" }}>
      <Container1 />
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[30px] relative shrink-0 w-[122.583px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Figtree:Bold',sans-serif] font-bold leading-[30px] left-0 text-[#021b59] text-[20px] top-0 whitespace-nowrap">Mensagem</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex h-[44px] items-center pb-[2px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#021b59] border-b-2 border-solid inset-0 pointer-events-none" />
      <Heading />
    </div>
  );
}

function Label() {
  return (
    <div className="absolute h-[24px] left-0 top-0 w-[402px]" data-name="Label">
      <p className="absolute font-['Figtree:Medium',sans-serif] font-medium leading-[24px] left-0 text-[#333] text-[16px] top-[-0.5px] whitespace-nowrap">Destinatário</p>
    </div>
  );
}

function PasswordInput() {
  return <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px" data-name="Password Input" />;
}

function Container10() {
  return (
    <div className="absolute bg-white content-stretch flex h-[56px] items-center left-[0.5px] px-[21px] py-px top-[28.5px] w-[818px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#5f5f5f] border-solid inset-0 pointer-events-none" />
      <PasswordInput />
    </div>
  );
}

function PasswordField() {
  return (
    <div className="absolute h-[84px] left-0 top-0 w-[402px]" data-name="PasswordField">
      <Label />
      <Container10 />
    </div>
  );
}

function Label1() {
  return (
    <div className="absolute h-[24px] left-0 top-0 w-[402px]" data-name="Label">
      <p className="absolute font-['Figtree:Medium',sans-serif] font-medium leading-[24px] left-0 text-[#333] text-[16px] top-[-0.5px] whitespace-nowrap">Assuntos</p>
    </div>
  );
}

function PasswordInput1() {
  return <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px" data-name="Password Input" />;
}

function Container11() {
  return (
    <div className="absolute bg-white content-stretch flex h-[56px] items-center left-[0.5px] px-[21px] py-px top-[28.5px] w-[819px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#5f5f5f] border-solid inset-0 pointer-events-none" />
      <PasswordInput1 />
    </div>
  );
}

function PasswordField1() {
  return (
    <div className="absolute h-[84px] left-0 top-[100px] w-[402px]" data-name="PasswordField">
      <Label1 />
      <Container11 />
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[184px] relative shrink-0 w-[820px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <PasswordField />
        <PasswordField1 />
      </div>
    </div>
  );
}

function Label2() {
  return (
    <div className="absolute h-[24px] left-0 top-0 w-[402px]" data-name="Label">
      <p className="absolute font-['Figtree:Medium',sans-serif] font-medium leading-[24px] left-0 text-[#333] text-[16px] top-[-0.5px] whitespace-nowrap">Texto da mensagem</p>
    </div>
  );
}

function PasswordInput2() {
  return <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px" data-name="Password Input" />;
}

function Container12() {
  return (
    <div className="absolute bg-white content-stretch flex h-[222px] items-center left-[0.5px] px-[21px] py-px top-[28.5px] w-[817px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#5f5f5f] border-solid inset-0 pointer-events-none" />
      <PasswordInput2 />
    </div>
  );
}

function PasswordField2() {
  return (
    <div className="h-[84px] relative shrink-0 w-[402px]" data-name="PasswordField">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Label2 />
        <Container12 />
      </div>
    </div>
  );
}

function Form() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] h-[364px] items-start relative shrink-0 w-full" data-name="Form">
      <Container9 />
      <PasswordField2 />
    </div>
  );
}

function Section() {
  return (
    <div className="h-[518px] relative shrink-0 w-[820px]" data-name="Section">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[20px] items-start relative size-full">
        <Container8 />
        <Form />
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#ffeac4] h-[50px] relative rounded-[26px] shrink-0 w-[181.4px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Figtree:Medium',sans-serif] font-medium leading-[27px] left-[91px] text-[#333] text-[18px] text-center top-[11px] whitespace-nowrap">Enviar mensagem</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[50px] relative shrink-0 w-[820px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <Button3 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[40px] h-[780px] items-start left-[190px] pl-[40px] py-[32px] top-[323.5px] w-[900px]" data-name="Container">
      <Section />
      <Container13 />
    </div>
  );
}

function ProfilePage() {
  return (
    <div className="bg-white h-[1103.5px] relative shrink-0 w-[1280px]" data-name="ProfilePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <Container />
        <Container7 />
      </div>
    </div>
  );
}

function AuthLayout() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[898px] items-start left-0 pl-[135.5px] pt-[56px] top-0 w-[1551px]" data-name="AuthLayout">
      <ProfilePage />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_149_1158)" id="Icon">
          <path d={svgPaths.p1875e170} fill="var(--fill-0, #FFEAC4)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_149_1158">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="relative rounded-[6px] shrink-0 size-[38px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[11px] relative size-full">
        <Icon2 />
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[18px_18px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.p2c34f900} fill="var(--fill-0, #042E99)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group />
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[14px] overflow-clip size-[18px] top-[9px]" data-name="Icon">
      <ClipPathGroup />
    </div>
  );
}

function SearchInput() {
  return (
    <div className="absolute content-stretch flex h-[22.5px] items-center left-[40px] overflow-clip top-[6.75px] w-[398px]" data-name="Search Input">
      <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#595959] text-[15px] whitespace-nowrap">Buscar cursos</p>
    </div>
  );
}

function Icon4() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[0_13.16%]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.7368 20">
          <path d={svgPaths.p3800c180} fill="var(--fill-0, #042E99)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[446px] rounded-[6px] size-[20px] top-[8px]" data-name="Button">
      <Icon4 />
    </div>
  );
}

function Container14() {
  return (
    <div className="bg-white h-[36px] relative rounded-[6px] shrink-0 w-[480px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon3 />
        <SearchInput />
        <Button5 />
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[24px] relative shrink-0 w-[19.367px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Figtree:Bold',sans-serif] font-bold leading-[24px] left-[10px] text-[#ffeac4] text-[16px] text-center top-[-0.5px] whitespace-nowrap">PS</p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-[#042e99] relative rounded-[3.402820018375656e+38px] shrink-0 size-[38px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[9.317px] py-[2px] relative rounded-[inherit] size-full">
        <Text4 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#ffeac4] border-solid inset-0 pointer-events-none rounded-[3.402820018375656e+38px]" />
    </div>
  );
}

function AuthLayout1() {
  return (
    <div className="absolute bg-[#021b59] content-stretch flex h-[56px] items-center justify-between left-0 px-[151.5px] top-0 w-[1551px]" data-name="AuthLayout">
      <Button4 />
      <Container14 />
      <Button6 />
    </div>
  );
}

export default function Mensagem() {
  return (
    <div className="bg-white relative size-full" data-name="Mensagem">
      <AuthLayout />
      <AuthLayout1 />
    </div>
  );
}