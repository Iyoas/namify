"use client";

import { useMemo, useState } from "react";
import GeneratorCardsGrid from "@/app/[lang]/tools/domain-generator/components/GeneratorCardsGrid";
import filterStyles from "@/app/[lang]/tools/domain-generator/components/stepper/DomainSelect.module.css";
import pageStyles from "./GeneratorsOverviewPage.module.css";
import type { GeneratorCategoryKey, GeneratorsOverviewCategoryGroup } from "@/data/generators";

type GeneratorsOverviewClientProps = {
  groups: GeneratorsOverviewCategoryGroup[];
  cardCta: string;
  allFilterLabel: string;
  filterCategoryLabels: Record<GeneratorCategoryKey, string>;
  categoryLabels: Record<GeneratorCategoryKey, string>;
};

type FilterId = "all" | GeneratorCategoryKey;

export default function GeneratorsOverviewClient({
  groups,
  cardCta,
  allFilterLabel,
  filterCategoryLabels,
  categoryLabels,
}: GeneratorsOverviewClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");

  const filterOptions = useMemo(
    () => [
      { id: "all" as const, label: allFilterLabel },
      ...groups.map((group) => ({
        id: group.category,
        label: filterCategoryLabels[group.category],
      })),
    ],
    [allFilterLabel, filterCategoryLabels, groups]
  );

  const visibleGroups = useMemo(
    () =>
      activeFilter === "all"
        ? groups
        : groups.filter((group) => group.category === activeFilter),
    [activeFilter, groups]
  );

  return (
    <>
      <div className={filterStyles.filtersSection}>
        <div className={filterStyles.categoriesRow}>
          <div className={filterStyles.categories}>
            {filterOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setActiveFilter(option.id)}
                className={[
                  filterStyles.categoryPill,
                  pageStyles.filterPill,
                  option.id === activeFilter ? filterStyles.categoryPillActive : "",
                  option.id === activeFilter ? pageStyles.filterPillActive : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-pressed={option.id === activeFilter}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {visibleGroups.map((group) => (
        <section key={group.category} className={pageStyles.categorySection}>
          <h2 className={pageStyles.categoryTitle}>
            {filterCategoryLabels[group.category]}
          </h2>
          <GeneratorCardsGrid items={group.items} ctaLabel={cardCta} showIcons={false} />
        </section>
      ))}
    </>
  );
}
