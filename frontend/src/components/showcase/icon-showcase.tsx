import { StyleSheet, Text, View } from "react-native";

import AddRoundLightIcon from "@/assets/icons/add_round_light.svg";
import CloseRoundLightIcon from "@/assets/icons/close_round_light.svg";
import CopyLightIcon from "@/assets/icons/copy_light.svg";
import CouponLightIcon from "@/assets/icons/coupon_light.svg";
import DateRangeFillIcon from "@/assets/icons/Date_range_fill.svg";
import DateTodayLightIcon from "@/assets/icons/date_today_light.svg";
import DoneRoundLightIcon from "@/assets/icons/done_round_light.svg";
import EditLightIcon from "@/assets/icons/edit_light.svg";
import ExpandDownLightIcon from "@/assets/icons/expand_down_light.svg";
import ExpandLeftLightIcon from "@/assets/icons/expand_left_light.svg";
import ExpandRightLightIcon from "@/assets/icons/expand_right_light.svg";
import ExpandUpLightIcon from "@/assets/icons/expand_up_light.svg";
import HamburgerIcon from "@/assets/icons/hamburger.svg";
import NotebookLightIcon from "@/assets/icons/notebook_light.svg";
import OutLightIcon from "@/assets/icons/out_light.svg";
import PinFillIcon from "@/assets/icons/pin_fill.svg";
import RefreshLightIcon from "@/assets/icons/refresh_light.svg";
import SearchLightIcon from "@/assets/icons/search_light.svg";
import ShopIcon from "@/assets/icons/Shop.svg";
import SignOutSqureLightIcon from "@/assets/icons/sign_out_squre_light.svg";
import StarFillIcon from "@/assets/icons/Star_fill.svg";
import StarLightIcon from "@/assets/icons/star_light.svg";
import TimeFillIcon from "@/assets/icons/Time_fill.svg";
import TimeLightIcon from "@/assets/icons/time_light.svg";
import UserDuotoneIcon from "@/assets/icons/user_duotone.svg";
import { COLORS } from "../../constants/colors";
import { TYPOGRAPHY } from "../../constants/typography";
import { AppIcon, type AppSvgIconSource } from "../ui/icon";

interface IconItem {
  icon: AppSvgIconSource;
  id: string;
  label: string;
}

const ICON_USAGE = `import SearchLightIcon from "@/assets/icons/search_light.svg";
import { AppIcon } from "@/components/ui/icon";

<AppIcon icon={SearchLightIcon} size={24} />`;

const ICON_ITEMS: IconItem[] = [
  { icon: ExpandLeftLightIcon, id: "expand-left", label: "expand_left_light" },
  { icon: CloseRoundLightIcon, id: "close-round", label: "close_round_light" },
  { icon: EditLightIcon, id: "edit-light", label: "edit_light" },
  { icon: RefreshLightIcon, id: "refresh-light", label: "refresh_light" },
  { icon: CopyLightIcon, id: "copy-light", label: "copy_light" },
  { icon: PinFillIcon, id: "pin-fill", label: "pin_fill" },
  { icon: ExpandRightLightIcon, id: "expand-right", label: "expand_right_light" },
  { icon: DoneRoundLightIcon, id: "done-round", label: "done_round_light" },
  { icon: UserDuotoneIcon, id: "user-duotone", label: "user_duotone" },
  { icon: NotebookLightIcon, id: "notebook-light", label: "notebook_light" },
  { icon: StarLightIcon, id: "star-light", label: "star_light" },
  { icon: DateRangeFillIcon, id: "date-range-fill", label: "Date_range_fill" },
  { icon: ExpandUpLightIcon, id: "expand-up", label: "expand_up_light" },
  { icon: AddRoundLightIcon, id: "add-round", label: "add_round_light" },
  { icon: DateTodayLightIcon, id: "date-today", label: "date_today_light" },
  { icon: SignOutSqureLightIcon, id: "sign-out-square", label: "sign_out_squre_light" },
  { icon: HamburgerIcon, id: "hamburger", label: "hamburger" },
  { icon: TimeFillIcon, id: "time-fill", label: "Time_fill" },
  { icon: ExpandDownLightIcon, id: "expand-down", label: "expand_down_light" },
  { icon: SearchLightIcon, id: "search-light", label: "search_light" },
  { icon: TimeLightIcon, id: "time-light", label: "time_light" },
  { icon: OutLightIcon, id: "out-light", label: "out_light" },
  { icon: CouponLightIcon, id: "coupon-light", label: "coupon_light" },
  { icon: ShopIcon, id: "shop", label: "Shop" },
  { icon: StarFillIcon, id: "star-fill", label: "Star_fill" },
];

export function IconShowcase() {
  return (
    <View style={styles.section}>
      <Text className="text-gray-400">{ICON_USAGE}</Text>

      <View style={styles.grid}>
        {ICON_ITEMS.map((item) => (
          <View key={item.id} style={styles.item}>
            <View style={styles.iconFrame}>
              <AppIcon icon={item.icon} size={24} />
            </View>
            <Text style={[TYPOGRAPHY.body3, styles.label]}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    columnGap: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 20,
  },
  iconFrame: {
    alignItems: "center",
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  item: {
    alignItems: "center",
    gap: 8,
    width: 92,
  },
  label: {
    color: COLORS.text.muted,
    textAlign: "center",
  },
  section: {
    borderColor: COLORS.base.gray300,
    borderRadius: 20,
    borderWidth: 2,
    gap: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: 500,
  },
});
