
"use client"

import * as React from "react"
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, ButtonProps, buttonVariants } from "@/components/ui/button"

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    className,
}: {
    currentPage: number,
    totalPages: number,
    onPageChange: (page: number) => void
} & React.ComponentProps<"nav">) => {

    const renderPageNumbers = () => {
        const pageNumbers = []
        const maxPagesToShow = 5;
        const halfMaxPages = Math.floor(maxPagesToShow / 2);
        
        let startPage = Math.max(1, currentPage - halfMaxPages);
        let endPage = Math.min(totalPages, currentPage + halfMaxPages);

        if (currentPage - 1 <= halfMaxPages) {
            endPage = Math.min(totalPages, maxPagesToShow);
        }
        if (totalPages - currentPage < halfMaxPages) {
            startPage = Math.max(1, totalPages - maxPagesToShow + 1);
        }
        
        if (startPage > 1) {
            pageNumbers.push(<PaginationItem key="1"><PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink></PaginationItem>);
            if (startPage > 2) {
                pageNumbers.push(<PaginationItem key="start-ellipsis"><PaginationEllipsis /></PaginationItem>);
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        onClick={() => onPageChange(i)}
                        isActive={currentPage === i}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pageNumbers.push(<PaginationItem key="end-ellipsis"><PaginationEllipsis /></PaginationItem>);
            }
            pageNumbers.push(<PaginationItem key={totalPages}><PaginationLink onClick={() => onPageChange(totalPages)}>{totalPages}</PaginationLink></PaginationItem>);
        }

        return pageNumbers;
    };

    return (
      <nav
        role="navigation"
        aria-label="pagination"
        className={cn("mx-auto flex w-full justify-center", className)}
      >
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          {renderPageNumbers()}
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </nav>
    );
};
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"button">

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <button
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
