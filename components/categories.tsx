"use client";

import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import { useSearchParams, useRouter } from "next/navigation";
import qs from "query-string";

interface CategoriesProps {
  data: Category[];
}

const Categories = ({ data }: CategoriesProps) => {
  const router = useRouter();
  const searchParams = useSearchParams(); // This is a hook that returns the search params of the current URL.

  const categoryId = searchParams.get("categoryId"); // This is a hook that returns the search params of the current URL and will be used inside the cn function to determine if the category is active or not and will be used inside the onClick function to update the URL query parameters.

  // This function will update the URL query parameters whenever the user clicks on a category. The function will also update the URL query parameters whenever the user clicks on the "Newest" button.
  const onClick = (id: string | undefined) => {
    const query = { categoryId: id }; // not the same as categoryId above, which is a value returned from the search params hook. This is a query object that will be used to update the URL query parameters.
    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true }
    );

    router.push(url);
  }; 

  return (
    <div className="w-full flex p-1 flex-wrap space-x-2">
      <button
        onClick={() => onClick(undefined)}
        className={cn(
          "flex items-center text-center text-xs md:text-sm px-2 mb-3 md:px-4 py-3 md:py-2 rounded-md bg-primary/10 hover:opacity-75 transition",
          !categoryId ? "bg-primary/25" : "bg-primary/10"
        )}
      >
        Newest
      </button>
      {/* // This is a loop that will iterate over the categories stored in the seed.ts file and render a button for each category. */}
      {data.map((category) => (
        <button
          onClick={() => onClick(category.id)}
          key={category.id}
          className={cn(
            "flex items-center text-center text-xs md:text-sm px-2 mb-3 md:px-4 py-3 md:py-2 rounded-md bg-primary/10 hover:opacity-75 transition",
            category.id === categoryId ? "bg-primary/25" : "bg-primary/10"
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default Categories;

// overflow-x-auto 