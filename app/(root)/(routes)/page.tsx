// page.tsx is the root page of the app and is the first page that is loaded when the app is loaded. It is also a server component that is rendered on the server side and has access to the database. 

import SearchInput from "@/components/search-input";
import prismadb from "@/lib/prismadb";
import Categories from "@/components/categories";


const RootPage = async () => {
    // Query the database for all categories
    const categories = await prismadb.category.findMany();

    return ( 
        <div className="h-full p-4 space-y-2">
            <SearchInput />
            <Categories data={categories} />
        </div>
        
     );
}
 
export default RootPage;   