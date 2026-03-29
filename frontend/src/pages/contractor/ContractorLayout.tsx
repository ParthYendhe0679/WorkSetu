import { Outlet } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";

const ContractorLayout = () => {
  return (
    <DashboardLayout role="contractor">
      <Outlet />
    </DashboardLayout>
  );
};

export default ContractorLayout;
