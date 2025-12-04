"use client";

import { useRouter } from "next/navigation";

// Icons
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { LiaUserSolid } from "react-icons/lia";
import {
  LuCalendarCheck2,
  LuChartColumnBig,
  LuHandHelping,
} from "react-icons/lu";
import { FaRegBell, FaStore } from "react-icons/fa";
import { BsCartCheck } from "react-icons/bs";
import { TbDrone, TbReportAnalytics } from "react-icons/tb";
import { GiReceiveMoney } from "react-icons/gi";
import { GrDocumentUser } from "react-icons/gr";
import { PiGear } from "react-icons/pi";

const routes = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: <LuChartColumnBig className="text-[1.35rem]" />,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: <LiaUserSolid className="text-[1.35rem]" />,
  },
  {
    name: "Providers",
    href: "/admin/providers",
    icon: <FaStore className="text-[1.35rem]" />,
  },
  {
    name: "Services",
    href: "/admin/services",
    icon: <LuHandHelping className="text-[1.35rem]" />,
  },
  {
    name: "Appointments",
    href: "/admin/appointments",
    icon: <LuCalendarCheck2 className="text-[1.35rem]" />,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: <BsCartCheck className="text-[1.35rem]" />,
  },
  {
    name: "Drones",
    href: "/admin/drones",
    icon: <TbDrone className="text-[1.35rem]" />,
  },
  {
    name: "Payments",
    href: "/admin/payments",
    icon: <GiReceiveMoney className="text-[1.35rem]" />,
  },
  {
    name: "Reports",
    href: "/admin/reports",
    icon: <TbReportAnalytics className="text-[1.35rem]" />,
  },
  {
    name: "Logs",
    href: "/admin/logs",
    icon: <GrDocumentUser className="text-[1.35rem]" />,
  },
  {
    name: "Notifications",
    href: "/admin/notifications",
    icon: <FaRegBell className="text-[1.35rem]" />,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: <PiGear className="text-[1.35rem]" />,
  },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Navbar */}

        <nav className="navbar w-full bg-base-300">
          <label
            htmlFor="my-drawer-4"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost"
          >
            {/* Sidebar toggle icon */}
            <MdOutlineArrowForwardIos className="font-semibold" />
          </label>
          <div className="px-4 font-semibold">Uni Service</div>
        </nav>

        {/* Page content here */}
        <div className="p-4">{children}</div>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
          {/* Sidebar content here */}
          <ul className="menu w-full grow">
            {/* List item */}
            {routes.map((route) => {
              return (
                <li className="mb-2" key={route.name}>
                  <button
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip={route.name}
                    onClick={() => router.push(route.href)}
                  >
                    {/* Dashboard Icon */}
                    {route.icon}
                    <span className="is-drawer-close:hidden">{route.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
