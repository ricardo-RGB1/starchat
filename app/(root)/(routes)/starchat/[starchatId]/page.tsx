import prismadb from "@/lib/prismadb";

// The starchatId parameter is a string value that is passed in the URL path. The starchatId property is a string that represents the ID of a Starchat page
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
      id: params.starchatId,
    },
  });

  // If the star variable is null or undefined, then the companion with the given ID does not exist in the database. Therefore, create a "Create Star" page. If there is a star, then create an "Edit" page for the star.

  const categories = await prismadb.category.findMany(); // Query the database for all categories

  return;
  <div>
    {/* <CompanionForm initialData={star} categories={categories} /> */}
  </div>;
};

export default StarchatIdPage;
