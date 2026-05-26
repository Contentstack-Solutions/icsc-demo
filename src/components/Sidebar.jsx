"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  CalendarDaysIcon,
  UsersIcon,
  BuildingOfficeIcon,
  Squares2X2Icon,
  ChatBubbleLeftEllipsisIcon,
  ShoppingBagIcon,
  ShieldCheckIcon,
  BookOpenIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  CalendarDaysIcon as CalendarSolid,
  UsersIcon as UsersSolid,
  BuildingOfficeIcon as BuildingSolid,
  Squares2X2Icon as SquaresSolid,
  ChatBubbleLeftEllipsisIcon as ChatSolid,
  ShoppingBagIcon as ShoppingSolid,
  ShieldCheckIcon as ShieldSolid,
  BookOpenIcon as BookSolid,
  UserCircleIcon as UserCircleSolid,
} from "@heroicons/react/24/solid";

const NAV_ITEMS = [
  { label: "Dashboard",        href: "/",                  Icon: HomeIcon,                       IconActive: HomeIconSolid },
  { label: "Events",           href: "/page/events",            Icon: CalendarDaysIcon,               IconActive: CalendarSolid },
  { label: "Connections",      href: "/page/connections",       Icon: UsersIcon,                      IconActive: UsersSolid },
  { label: "Properties",       href: "/page/properties",        Icon: BuildingOfficeIcon,             IconActive: BuildingSolid },
  { label: "Marketplaces IQ",  href: "/page/marketplaces-iq",  Icon: Squares2X2Icon,                 IconActive: SquaresSolid },
  { label: "Messages",         href: "/page/messages",          Icon: ChatBubbleLeftEllipsisIcon,     IconActive: ChatSolid,    badge: 1 },
  { label: "Retailers",        href: "/page/retailers",         Icon: ShoppingBagIcon,                IconActive: ShoppingSolid },
  { label: "Trustee Center",   href: "/page/trustee-center",   Icon: ShieldCheckIcon,                IconActive: ShieldSolid },
  { label: "Member Directory", href: "/page/member-directory", Icon: BookOpenIcon,                   IconActive: BookSolid },
  { label: "My Account",       href: "/page/my-account",       Icon: UserCircleIcon,                 IconActive: UserCircleSolid },
];

export default function Sidebar({ locale }) {
  const pathname = usePathname();

  const isActive = (href) => {
    const localePath = `/${locale}${href === "/" ? "" : href}`;
    return href === "/" ? pathname === `/${locale}` || pathname === `/${locale}/` : pathname.startsWith(localePath);
  };

  return (
    <aside className="w-[200px] xl:w-[370px]  shrink-0 bg-gray-50 border-r border-gray-200 min-h-screen flex flex-col py-4 px-2">
      {NAV_ITEMS.map(({ label, href, Icon, IconActive, badge }) => {
        const active = isActive(href);
        const ActiveIcon = active ? IconActive : Icon;
        return (
          <Link
            key={label}
            href={`/${locale}${href === "/" ? "" : href}`}
            className={`flex items-center gap-3 px-4 py-2.5 group transition-colors ${
              active ? "bg-[#246eff42] text-white border-l-4 border-[#246EFF]" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 transition-colors ${
                active ? "bg-[#246EFF]" : "bg-gray-200 group-hover:bg-gray-200"
              }`}
            >
              <ActiveIcon className={`w-4 h-4 ${active ? "text-white" : "text-gray-500 group-hover:text-gray-700"}`} />
            </div>
            <span className={`text-sm font-medium ${active ? "text-[#246EFF]" : ""}`}>{label}</span>
            {badge ? (
              <span className="ml-auto flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                {badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </aside>
  );
}
