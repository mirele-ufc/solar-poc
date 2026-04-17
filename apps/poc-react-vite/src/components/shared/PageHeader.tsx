import { useNavigate } from "react-router-dom";

const BACK_ARROW =
  "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2Z";

export type Crumb = { label: string; path?: string };

interface PageHeaderProps {
  title: string;
  backPath: string;
  crumbs: Crumb[];
}

export function PageHeader({ title, backPath, crumbs }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-[6px]">
      {/* Back button + title */}
      <div className="flex items-center gap-[8px]">
        <button
          type="button"
          aria-label="Voltar"
          onClick={() => navigate(backPath)}
          className="shrink-0 flex items-center justify-center size-[44px] rounded-full hover:bg-[#021b59]/10 transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
        >
          <svg
            className="size-[22px]"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d={BACK_ARROW} fill="#021B59" />
          </svg>
        </button>
        <h1
          className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] leading-[32px]"
          style={{ fontSize: "22px" }}
        >
          {title}
        </h1>
      </div>

      {/* Breadcrumb */}
      <nav aria-label="Navegação estrutural" className="pl-[42px]">
        <ol className="flex items-center flex-wrap gap-x-[4px] gap-y-[2px] list-none m-0 p-0">
          {crumbs.map((crumb, i) => {
            const isCurrent = i === crumbs.length - 1;
            return (
              <li key={crumb.label + i} className="flex items-center gap-[4px]">
                {i > 0 && (
                  <span
                    className="text-[#8e8e8e] text-[13px] select-none"
                    aria-hidden="true"
                  >
                    ›
                  </span>
                )}
                {crumb.path ? (
                  <button
                    type="button"
                    onClick={() => navigate(crumb.path!)}
                    className="font-['Figtree:Regular',sans-serif] font-normal text-[#042e99] text-[13px] hover:underline underline-offset-2 focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] rounded-sm min-h-[44px] inline-flex items-center"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span
                    className="font-['Figtree:Regular',sans-serif] font-normal text-[#595959] text-[13px]"
                    aria-current={isCurrent ? "page" : undefined}
                  >
                    {crumb.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
