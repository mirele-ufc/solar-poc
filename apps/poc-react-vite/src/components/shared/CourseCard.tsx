import { Card } from "@/components/ui/card";

import { ImageWithFallback } from "./ImageWithFallback";

type CourseCardBadge = {
  label: string;
  bg: string;
  text: string;
};

type CourseCardProps = {
  title: string;
  imageSrc: string;
  imageAlt: string;
  onClick: () => void;
  description?: string;
  badge?: CourseCardBadge;
};

export function CourseCard({
  title,
  imageSrc,
  imageAlt,
  onClick,
  description,
  badge,
}: CourseCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col gap-[10px] items-start cursor-pointer group text-left w-full focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px] rounded-[4px]"
    >
      <Card className="w-full gap-[10px] border-0 shadow-none rounded-[8px] bg-transparent">
        <Card.Header className="w-full p-0">
          <Card.Content className="w-full p-0">
            <div className="w-full aspect-[16/10] overflow-hidden rounded-[8px] bg-[#e0e0e0] relative">
              <ImageWithFallback
                alt={imageAlt}
                src={imageSrc}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              {badge && (
                <span
                  className="absolute top-[8px] right-[8px] text-[11px] font-['Figtree:Medium',sans-serif] font-medium px-[8px] py-[2px] rounded-full"
                  style={{ backgroundColor: badge.bg, color: badge.text }}
                >
                  {badge.label}
                </span>
              )}
            </div>
          </Card.Content>
        </Card.Header>

        <Card.Body className="p-0">
          <Card.Title className="font-['Figtree:Medium',sans-serif] font-medium leading-[26px] text-[18px] text-black">
            {title}
          </Card.Title>
          {description && (
            <Card.Description className="font-['Figtree:Regular',sans-serif] font-normal leading-[20px] text-[14px] text-[#595959] mt-[2px]">
              {description}
            </Card.Description>
          )}
        </Card.Body>
      </Card>
    </button>
  );
}
