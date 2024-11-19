import { auth } from "@/auth";

const Dashboard = async () => {
  const session = await auth();

  return (
    <div className="max-w-screen-xl mx-auto py-6 p-2">
      <h1 className="text-2xl">Dashboard</h1>
      <h2 className="text-xl">
        Welcome Back :{" "}
        <span className="font-bold">{session?.user?.name || "Guest"}</span>
      </h2>
    </div>
  );
};

export default Dashboard;
