"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import { IGenre } from "@/interfaces/IMovies";
import {
  ScreeningsTransitionProvider,
  useScreeningsTransition,
} from "@/contexts/screenings-transition-context";
import { cn } from "@/lib/utils";
import FilterBar from "../../(home)/_components/screenings/filter-bar";
import ScreeningsGrid from "../../(home)/_components/screenings/screenings-grid";
import PaginatedNav from "@/components/common/paginated-nav";
import { MY_CINEMAS_PARAM } from "../../(home)/_components/screenings/my-cinemas-field";
import MyCinemasGrid from "./my-cinemas-grid";

interface ScreeningsPageSectionProps {
  screenings: IScreeningGroup[];
  genres: IGenre[];
  selectedGenreIds: number[];
  dateFrom: string | null;
  dateTo: string | null;
  search: string | null;
  currentPage: number;
  totalPages: number;
}

const Inner: React.FC<ScreeningsPageSectionProps> = ({
  screenings,
  genres,
  selectedGenreIds,
  dateFrom,
  dateTo,
  search,
  currentPage,
  totalPages,
}) => {
  const { isPending } = useScreeningsTransition();
  const searchParams = useSearchParams();
  // Starred cinemas replace the location filter, so the city field and the
  // server-paginated listing step aside in this view.
  const showMyCinemas = searchParams.get(MY_CINEMAS_PARAM) === "1";

  const buildPageHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    const qs = params.toString();
    return qs ? `/seanse?${qs}` : "/seanse";
  };

  return (
    <>
      <div>
        <div className="px-6 md:px-12 lg:px-16 py-4 md:py-5">
          <FilterBar genres={genres} showMyCinemas hideCity={showMyCinemas} />
        </div>
        <div className="h-px w-full bg-white/10" aria-hidden="true" />
      </div>

      <div
        className={cn(
          "px-6 md:px-12 lg:px-16 py-12 md:py-20 transition-opacity duration-200",
          isPending && "opacity-50 pointer-events-none"
        )}
      >
        {showMyCinemas ? (
          <MyCinemasGrid
            genres={genres}
            selectedGenreIds={selectedGenreIds}
            dateFrom={dateFrom}
            dateTo={dateTo}
            search={search}
          />
        ) : (
          <>
            <ScreeningsGrid
              screenings={screenings}
              genres={genres}
              selectedGenreIds={selectedGenreIds}
              dateFrom={dateFrom}
              dateTo={dateTo}
              search={search}
            />

            {totalPages > 1 && screenings.length > 0 && (
              <div className="mt-16 md:mt-20">
                <PaginatedNav
                  currentPage={currentPage}
                  totalPages={totalPages}
                  buildHref={buildPageHref}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

const ScreeningsPageSection: React.FC<ScreeningsPageSectionProps> = (props) => (
  <ScreeningsTransitionProvider>
    <Inner {...props} />
  </ScreeningsTransitionProvider>
);

export default ScreeningsPageSection;
