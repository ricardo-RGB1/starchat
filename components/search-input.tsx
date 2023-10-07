"use client";

import qs from "query-string";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, ChangeEventHandler, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";

const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // get the category from the search params
  const categoryId = searchParams.get("category"); // get the category from the search params
  const name = searchParams.get("name"); // get the name from the search params

  const [value, setValue] = useState(name || ""); // set the value to the name or an empty string

  // the search value that will query the databse will only trigger every 500ms, instead of every time the user types
  const debounceValue = useDebounce<string>(value, 500);

  // when the value changes, update the search params
  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };


  // update the URL query parameters whenever the debounceValue or categoryId state changes.
  useEffect(() => {
    // 1. create the query parameters
    const query = {
      name: debounceValue,
      category: categoryId,
    };

    // 2. stringify the URL query parameters
    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query, // query: query
      },
      { skipNull: true, skipEmptyString: true }
    );

    // 3. push the new URL to the router
    router.push(url);
  }, [debounceValue, categoryId, router]);

  
  return (
    <div className="relative">
      <Search className="absolute h-4 w-4 top-3 left-4 text-muted-foreground" />
      <Input
        onChange={onChange}
        value={value}
        placeholder="Search..."
        className="pl-10 bg-primary/10"
      />
    </div>
  );
};

export default SearchInput;

// 2. The qs.stringifyUrl(): **************************************************************
// This code is using the qs library to create a URL string with query parameters based on the current window location and the query object.

// The qs.stringifyUrl function takes two arguments: an object that contains the URL and query parameters, and an options object.

// The first argument is an object with two properties: url and query. The url property is set to window.location.href, which is the current URL of the window. The query property is set to the query object

// The second argument is an options object that specifies how to handle null and empty string values in the query parameters. The skipNull and skipEmptyString options are set to true, which means that any query parameters with null or empty string values will be skipped and not included in the resulting URL string.

// The qs.stringifyUrl function returns a new URL string with the query parameters included. This URL string is then assigned to the url constant.
