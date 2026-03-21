import svgPaths from "./svg-nuaxwjty0x";

function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="flex flex-row items-center justify-center size-full">
      <div className="content-stretch flex h-full items-center justify-center p-[11px] relative">{children}</div>
    </div>
  );
}

function CheckboxHelper({ children }: React.PropsWithChildren<{}>) {
  return (
    <Wrapper>
      <div className="relative rounded-[2px] shrink-0 size-[22px]" data-name="container">
        {children}
      </div>
    </Wrapper>
  );
}
type CheckboxProps = {
  className?: string;
  status?: "Unselected" | "Hover" | "Selected";
};

function Checkbox({ className, status = "Unselected" }: CheckboxProps) {
  if (status === "Hover") {
    return (
      <div className={className || "h-[46px] relative rounded-[100px]"} data-name="Status=Hover">
        <CheckboxHelper>
          <div aria-hidden="true" className="absolute border-2 border-[rgba(255,239,208,0.8)] border-solid inset-0 pointer-events-none rounded-[2px]" />
        </CheckboxHelper>
      </div>
    );
  }
  if (status === "Selected") {
    return (
      <button className={className || "cursor-pointer h-[46px] relative rounded-[100px]"} data-name="Status=Selected">
        <Wrapper>
          <div className="relative shrink-0 size-[22px]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
              <g id="Frame 6">
                <rect fill="var(--fill-0, #FFEAC4)" height="20" rx="1" width="20" x="1" y="1" />
                <rect height="20" rx="1" stroke="var(--stroke-0, #FFEAC4)" strokeWidth="2" width="20" x="1" y="1" />
                <path clipRule="evenodd" d={svgPaths.p39066800} fill="var(--fill-0, #021B59)" fillRule="evenodd" id="Vector" />
              </g>
            </svg>
          </div>
        </Wrapper>
      </button>
    );
  }
  return (
    <div className={className || "h-[46px] relative rounded-[100px]"} data-name="Status=Unselected">
      <CheckboxHelper>
        <div aria-hidden="true" className="absolute border-2 border-[#ffeac4] border-solid inset-0 pointer-events-none rounded-[2px]" />
      </CheckboxHelper>
    </div>
  );
}

export default function Checkbox1() {
  return <Checkbox className="cursor-pointer relative rounded-[100px] size-full" status="Selected" />;
}