import { Pressable, Text, View } from "react-native";
import clsx from "clsx";

import ExpandLeftIcon from "@/assets/icons/expand_left_light.svg";
import ExpandRightIcon from "@/assets/icons/expand_right_light.svg";
import { AppIcon } from "./icon";

const noop = () => {};

interface PaginationProps {
  currentPage: number;
  disabled?: boolean;
  maxPages?: number;
  onPageChange?: (page: number) => void;
  totalPages: number;
  variant?: "standard" | "minimal" | "arrows" | "noarrow";
  className?: string;
}

export function AppPagination({
  currentPage,
  disabled = false,
  maxPages = 5,
  onPageChange = noop,
  totalPages,
  variant = "standard",
  className,
}: PaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1 && !disabled) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !disabled) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageSelect = (page: number) => {
    if (!disabled) {
      onPageChange(page);
    }
  };

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPages <= maxPages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  const pageButtonBase =
    "w-8 h-8 rounded items-center justify-center bg-base-gray";

  const activePage = "bg-base-gray100";
  const disabledBtn = "opacity-50";

  if (variant === "arrows") {
    return (
      <View className={clsx("flex-row items-center gap-2", className)}>
        <Pressable
          disabled={currentPage === 1 || disabled}
          onPress={handlePrevious}
          className={clsx(
            "w-8 h-8 rounded items-center justify-center",
            (currentPage === 1 || disabled) && disabledBtn
          )}
        >
          <AppIcon
            icon={ExpandLeftIcon}
            size={24}
            color={
              currentPage === 1 || disabled ? "#8B93B0" : "#C8CEDD"
            }
          />
        </Pressable>

        <Pressable
          disabled={currentPage === totalPages || disabled}
          onPress={handleNext}
          className={clsx(
            "w-8 h-8 rounded items-center justify-center",
            (currentPage === totalPages || disabled) && disabledBtn
          )}
        >
          <AppIcon
            icon={ExpandRightIcon}
            size={24}
            color={
              currentPage === totalPages || disabled
                ? "#8B93B0"
                : "#C8CEDD"
            }
          />
        </Pressable>
      </View>
    );
  }

  return (
    <View className={clsx("flex-row items-center gap-2", className)}>
      {variant !== "noarrow" && (
        <Pressable
          disabled={currentPage === 1 || disabled}
          onPress={handlePrevious}
          className={clsx(
            pageButtonBase,
            (currentPage === 1 || disabled) && disabledBtn
          )}
        >
          <AppIcon
            icon={ExpandLeftIcon}
            size={24}
            color={
              currentPage === 1 || disabled ? "#8B93B0" : "#C8CEDD"
            }
          />
        </Pressable>
      )}

      {variant === "standard" &&
        pages.map((page, index) => (
          <Pressable
            key={`${page}-${index}`}
            disabled={page === "..." || disabled}
            onPress={() =>
              typeof page === "number" && handlePageSelect(page)
            }
            className={clsx(
              pageButtonBase,
              page === currentPage && activePage,
              (page === "..." || disabled) && disabledBtn
            )}
          >
            <Text
              className={clsx(
                "font-condensedMedium text-body2",
                page === currentPage
                  ? "text-text-primary"
                  : "text-text-muted",
                page === "..." && "text-text-muted"
              )}
            >
              {page}
            </Text>
          </Pressable>
        ))}

      {variant === "minimal" && (
        <Pressable className={clsx(pageButtonBase, activePage)}>
          <Text className="font-condensedMedium text-body2 text-text-primary">
            {currentPage}
          </Text>
        </Pressable>
      )}

      {variant !== "noarrow" && (
        <Pressable
          disabled={currentPage === totalPages || disabled}
          onPress={handleNext}
          className={clsx(
            pageButtonBase,
            (currentPage === totalPages || disabled) && disabledBtn
          )}
        >
          <AppIcon
            icon={ExpandRightIcon}
            size={24}
            color={
              currentPage === totalPages || disabled
                ? "#8B93B0"
                : "#C8CEDD"
            }
          />
        </Pressable>
      )}
    </View>
  );
}