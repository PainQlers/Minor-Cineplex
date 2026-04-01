Store downloaded SVG icons in this folder.

Recommended naming:
- use lowercase kebab-case
- examples: `search.svg`, `calendar.svg`, `seat.svg`

Recommended usage:

```tsx
import SearchIcon from "@/assets/icons/search.svg";
import { AppIcon } from "@/components/ui/icon";

<AppIcon icon={SearchIcon} size={24} />
```

If you want the icon color to be controlled from React Native props, normalize the
SVG file so its paths use `currentColor` instead of a hardcoded `fill` or `stroke`.
