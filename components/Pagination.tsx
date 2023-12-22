import { FC } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import CustomButtonLink from "@/components/ui/CustomButtonLink";

export interface PaginationProps {
  className?: string;
  page: number;
  pageCount: number;
}

const PaginationNumber = ({
  isCurrent,
  number,
}: {
  isCurrent: boolean;
  number: number;
}) => {
  return (
    <li>
      <CustomButtonLink
        aria-current={isCurrent ? "page" : undefined}
        aria-label={`Goto page ${number}`}
        disabled={isCurrent}
        href={{ query: { page: number } }}
      >
        {number}
      </CustomButtonLink>
    </li>
  );
};

const Pagination: FC<PaginationProps> = ({
  className = "",
  page,
  pageCount,
}) => {
  const isFirstPage = page === 1;
  const isLastPage = page === pageCount;
  return (
    <nav aria-label="Page navigation example" className={className}>
      <ul className="flex h-8 items-center space-x-px text-sm">
        <li>
          <CustomButtonLink
            disabled={isFirstPage}
            href={{ query: { page: page - 1 } }}
          >
            <span className="sr-only">Previous</span>
            <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          </CustomButtonLink>
        </li>
        {Array.from({ length: pageCount }, (_, i) => (
          <PaginationNumber
            key={`pagination-number${i + 1}`}
            isCurrent={i + 1 === page}
            number={i + 1}
          />
        ))}
        <li>
          <CustomButtonLink
            disabled={isLastPage}
            href={{ query: { page: page + 1 } }}
          >
            <span className="sr-only">Next</span>
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </CustomButtonLink>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
