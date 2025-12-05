// Icons
import { GiDeliveryDrone } from "react-icons/gi";
import { HiUsers } from "react-icons/hi";
import { LuCalendarCheck2 } from "react-icons/lu";
import { MdOutlineDesignServices } from "react-icons/md";
import { RiStoreLine } from "react-icons/ri";

export default function StatCards() {
  return (
    <div className="stats mt-2 w-full overflow-x-auto">
      <div className="stat w-[14.2rem]">
        <div className="stat-figure text-secondary">
          <HiUsers className="text-[2.5rem]" />
        </div>
        <div className="stat-title">Users</div>
        <div className="stat-value">1,234</div>
        <div className="stat-desc">total active users</div>
      </div>

      <div className="stat w-[14.2rem]">
        <div className="stat-figure text-secondary">
          <RiStoreLine className="text-[2.5rem]" />
        </div>
        <div className="stat-title">Service Providers</div>
        <div className="stat-value">323</div>
        <div className="stat-desc">total active providers</div>
      </div>

      <div className="stat w-[14.2rem]">
        <div className="stat-figure text-secondary">
          <MdOutlineDesignServices className="text-[2.5rem]" />
        </div>
        <div className="stat-title">Services</div>
        <div className="stat-value">1,023</div>
        <div className="stat-desc">total available services</div>
      </div>

      <div className="stat w-[14.2rem]">
        <div className="stat-figure text-secondary">
          <LuCalendarCheck2 className="text-[2.5rem]" />
        </div>
        <div className="stat-title">Appointments</div>
        <div className="stat-value">423</div>
        <div className="stat-desc">pending appointments</div>
      </div>

      <div className="stat w-[14.2rem]">
        <div className="stat-figure text-secondary">
          <GiDeliveryDrone className="text-[2.5rem]" />
        </div>
        <div className="stat-title">Drones</div>
        <div className="stat-value">98</div>
        <div className="stat-desc">drone deliveries</div>
      </div>
    </div>
  );
}
