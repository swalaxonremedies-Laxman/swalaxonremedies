import { AiContentToolClient } from "./ai-content-tool-client";

export default function AdminDashboardPage() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
      >
        <div className="p-4 md:p-8 w-full">
            <AiContentToolClient />
        </div>
      </div>
    </>
  );
}
