import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { COLORS } from "../constants/colors";
import { TYPOGRAPHY } from "../constants/typography";
import { AppPagination } from "./ui/pagination";

export function PaginationShowcase() {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={[TYPOGRAPHY.sectionTitle, styles.sectionTitle]}>
          Standard Pagination
        </Text>
        <Text style={styles.description}>{`<AppPagination
          currentPage={1}
          totalPages={10}
          variant="standard"
          style={styles.pagination}
        />`}</Text>
        <AppPagination
          currentPage={1}
          totalPages={10}
          variant="standard"
          style={styles.pagination}
        />
      </View>

      <View style={styles.section}>
        <Text style={[TYPOGRAPHY.sectionTitle, styles.sectionTitle]}>
          Minimal Pagination
        </Text>
        <Text style={styles.description}>{`<AppPagination
          currentPage={1}
          totalPages={10}
          variant="minimal"
          style={styles.pagination}
        />`}</Text>
        <AppPagination
          currentPage={1}
          totalPages={10}
          variant="minimal"
          style={styles.pagination}
        />
      </View>

      <View style={styles.section}>
        <Text style={[TYPOGRAPHY.sectionTitle, styles.sectionTitle]}>
          Arrow Pagination
        </Text>
        <Text style={styles.description}>{`<AppPagination
          currentPage={5}
          totalPages={10}
          variant="arrows"
          style={styles.pagination}
        />`}</Text>
        <AppPagination
          currentPage={5}
          totalPages={10}
          variant="arrows"
          style={styles.pagination}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  description: {
    color: COLORS.text.muted,
    fontSize: 12,
    marginBottom: 12,
  },
  pagination: {
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.base.gray300,
    borderRadius: 8,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    color: COLORS.text.primary,
  },
});
