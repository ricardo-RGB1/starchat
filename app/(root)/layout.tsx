import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full ">
      <Navbar />
      <div className="flex justify-between items-center m-auto xl:w-[1200px]">
        <div className="hidden md:flex mt-16 w-20 flex-col fixed inset-y-0">
          <Sidebar />
        </div>
        <main className="md:pl-20 pt-16 h-full w-full">
            {children}
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
