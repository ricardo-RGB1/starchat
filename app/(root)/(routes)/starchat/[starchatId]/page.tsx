import prismadb from "@/lib/prismadb";
import { StarchatForm } from "./components/starchat-form";

// The starchatId parameter is a string value that is passed in the URL path. 
// The starchatId property is a string that represents the ID of a Starchat page
// The StarchatIdPageProps interface defines the type of the props object that is passed to the StarchatIdPage component.
interface StarchatIdPageProps { 
  params: {
    starchatId: string;
  };
}

const StarchatIdPage = async ({ params }: StarchatIdPageProps) => {
  // TODO: Check subscription

  // Query the database for the companion with the given ID
  // The findUnique method is called on the prismadb.companion object to retrieve a single record from the database.
  // The where object specifies the condition for the query, which is to find a record with an id field that matches the params.starchatId value.
  const star = await prismadb.companion.findUnique({ 
    where: {
      id: params.starchatId, // The id field is a unique identifier for the companion record.
    },
  });

  // If the star variable is null or undefined, then the companion with the given ID does not exist in the database. Therefore, create a "Create Star" page. If there is a star, then create an "Edit" page for the star.

  const categories = await prismadb.category.findMany(); // Query the database for all categories

  return (
    <div>
      <StarchatForm initialData={star} categories={categories} />
    </div>
  );
};

export default StarchatIdPage;
