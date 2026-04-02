import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import ExpandLeftIcon from "@/assets/icons/expand_left_light.svg";
import ExpandRightIcon from "@/assets/icons/expand_right_light.svg";
import { COLORS } from "../../constants/colors";
import { TYPOGRAPHY } from "../../constants/typography";
import { AppIcon } from "./icon";

const noop = () => {};

interface PaginationProps {
  currentPage: number;
  disabled?: boolean;
  maxPages?: number;
  onPageChange?: (page: number) => void;
  style?: StyleProp<ViewStyle>;
  totalPages: number;
  variant?: "standard" | "minimal" | "arrows";
}

export function AppPagination({
  currentPage,
  disabled = false,
  maxPages = 5,
  onPageChange = noop,
  style,
  totalPages,
  variant = "standard",
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
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  if (variant === "arrows") {
    return (
      <View style={[styles.container, style]}>
        <Pressable
          disabled={currentPage === 1 || disabled}
          onPress={handlePrevious}
          style={[
            styles.arrowButton,
            (currentPage === 1 || disabled) && styles.disabledButton,
          ]}
        >
          <AppIcon
            icon={ExpandLeftIcon}
            size={24}
            color={
              currentPage === 1 || disabled
                ? COLORS.text.muted
                : COLORS.text.secondary
            }
          />
        </Pressable>

        <Pressable
          disabled={currentPage === totalPages || disabled}
          onPress={handleNext}
          style={[
            styles.arrowButton,
            (currentPage === totalPages || disabled) && styles.disabledButton,
          ]}
        >
          <AppIcon
            icon={ExpandRightIcon}
            size={24}
            color={
              currentPage === totalPages || disabled
                ? COLORS.text.muted
                : COLORS.text.secondary
            }
          />
        </Pressable>
      </View>
    );
  }

  const pages = getPageNumbers();

  return (
    <View style={[styles.container, style]}>
      {variant !== "minimal" && (
        <Pressable
          disabled={currentPage === 1 || disabled}
          onPress={handlePrevious}
          style={[
            styles.pageButton,
            (currentPage === 1 || disabled) && styles.disabledButton,
          ]}
        >
          <AppIcon
            icon={ExpandLeftIcon}
            size={24}
            color={
              currentPage === 1 || disabled
                ? COLORS.text.muted
                : COLORS.text.secondary
            }
          />
        </Pressable>
      )}

      {variant === "standard" &&
        pages.map((page, index) => (
          <Pressable
            key={`${page}-${index}`}
            disabled={page === "..." || disabled}
            onPress={() => typeof page === "number" && handlePageSelect(page)}
            style={[
              styles.pageButton,
              page === currentPage && styles.activePage,
              (page === "..." || disabled) && styles.disabledButton,
            ]}
          >
            <Text
              style={[
              TYPOGRAPHY.body2Medium,
                page === currentPage
                  ? styles.activePageText
                  : styles.pageText,
                page === "..." && styles.ellipsisText,
              ]}
            >
              {page}
            </Text>
          </Pressable>
        ))}

      {variant === "minimal" && (
        <Pressable
          disabled={disabled}
          onPress={() => {}}
          style={[styles.pageButton, styles.activePage]}
        >
          <Text style={[TYPOGRAPHY.body2Medium, styles.activePageText]}>
            {currentPage}
          </Text>
        </Pressable>
      )}

      {variant !== "minimal" && (
        <Pressable
          disabled={currentPage === totalPages || disabled}
          onPress={handleNext}
          style={[
            styles.pageButton,
            (currentPage === totalPages || disabled) && styles.disabledButton,
          ]}
        >
          <AppIcon
            icon={ExpandRightIcon}
            size={24}
            color={
              currentPage === totalPages || disabled
                ? COLORS.text.muted
                : COLORS.text.secondary
            }
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  activePage: {
    backgroundColor: COLORS.base.gray100,
  },
  activePageText: {
    color: COLORS.text.primary,
    fontWeight: "500",
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  ellipsisText: {
    color: COLORS.text.muted,
    fontWeight: "500",
  },
  pageButton: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: COLORS.base.gray0,
    alignItems: "center",
    justifyContent: "center",
  },
  pageText: {
    color: COLORS.text.muted,
    fontWeight: "500",
  },
});
