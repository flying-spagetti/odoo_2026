import type { IconType } from "react-icons";
import {
  LuBus,
  LuFuel,
  LuLayoutDashboard,
  LuRoute,
  LuUser,
  LuWrench,
} from "react-icons/lu";

export interface NavItem {
  label: string;
  href: string;
  icon: IconType;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LuLayoutDashboard },
  { label: "Vehicles", href: "/vehicles", icon: LuBus },
  { label: "Drivers", href: "/drivers", icon: LuUser },
  { label: "Trips", href: "/trips", icon: LuRoute },
  { label: "Maintenance", href: "/maintenance", icon: LuWrench },
  { label: "Fuel & Expenses", href: "/expenses", icon: LuFuel },
];
