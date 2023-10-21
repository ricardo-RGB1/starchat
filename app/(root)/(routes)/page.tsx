// page.tsx is the root page of the app and is the first page the user sees when the app is loaded. It is also a server component that is rendered on the server side and has access to the database.

import SearchInput from "@/components/search-input";
import prismadb from "@/lib/prismadb";
import Categories from "@/components/categories";
import AIchats from "@/components/companions";
import Companions from "@/components/companions";

interface RootPageProps {
  searchParams: {
    categoryId: string;
    name: string;
  };
}

const RootPage = async ({ searchParams }: RootPageProps) => {
    
  const data = await prismadb.companion.findMany({
    where: {
      categoryId: searchParams.categoryId,
      name: {
        search: searchParams.name,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });

  // Query the database for all categories
  const categories = await prismadb.category.findMany();

  return (
    <div className="h-full p-4 space-y-2">
      <SearchInput />
      <Categories data={categories} />
       <Companions data={data} />
    </div>
  );
};

export default RootPage;

// Explanation for RootPageProps:
// searchParams is a convention in Next 13 server components - every server component has them. searchParams will be used to
// pass data from the server to the client. In this case, it will be used to pass the search parameters from the client to the server.
// RootPageProps is an interface in TypeScript that defines the shape of the props object passed to the RootPage component. It has a single property called searchParams which is an object with two properties: category and name. The category property is a string and the name property is also a string. This interface is used to ensure that the props passed to the RootPage component are of the correct type and shape.

// Explanation for data variable:
// The data variable is a Promise that resolves to an array of objects returned by the prismadb.companion.findMany() method. This method is used to query the database for all the records that match the specified search criteria. The search criteria are defined by the where object, which has two properties: categoryId and name. The categoryId property is set to the value of searchParams.categoryId, which is likely coming from the URL query parameters. The name property is an object with a search property, which is set to the value of searchParams.name. This allows for a partial match search on the name field. The orderBy property is used to sort the results by the createdAt field in descending order. The include property is used to include the _count field in the returned objects, which is an object with a messages property that represents the number of messages associated with each record.
