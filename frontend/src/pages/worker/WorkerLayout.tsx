import { Outlet } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import VoiceAssistant from "@/components/worker/VoiceAssistant";

const WorkerLayout = () => {
  return (
    <DashboardLayout role="worker">
      <Outlet />
      {/* AI Voice Assistant — worker-only floating button */}
      <VoiceAssistant />
    </DashboardLayout>
  );
};

export default WorkerLayout;
