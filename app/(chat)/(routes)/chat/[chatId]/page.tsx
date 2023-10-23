// A dynamic route to display a specific chat
// The dynamic route is stored inside a params instead of a searchParams
// This page will be rendered on the server side and will have access to the database
// This is the main page for the "messages" feature



import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";

import { auth, redirectToSignIn } from "@clerk/nextjs";
import ChatClient from "./components/client";

interface ChatIdPageProps {
  params: {
    chatId: string;
  };
}

const ChatIdPage = async ({ params }: ChatIdPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirectToSignIn();
  }

  // fetch the AI chat (companion) from the database
  const companion = await prismadb.companion.findFirst({
    where: {
      id: params.chatId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
        where: {
          userId,
        },
      },
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });

  if (!companion) {
    return redirect("/");
  }

  return (
    <div >
      <ChatClient companion={companion} />
    </div>
  );
};

export default ChatIdPage;

// const companion: Here's a breakdown of what's happening in the code:

// The prismadb.companion.findFirst() method is called to fetch the companion from the database. The findFirst() method returns the first record that matches the specified criteria.

// The where parameter is used to specify the criteria for the query. In this case, the id field of the companion record is matched with the chatId parameter.

// The include parameter is used to specify which related records to fetch along with the companion record. In this case, the messages field is included, which is a relation to the Message model.

// The orderBy parameter is used to sort the messages array by the createdAt field in ascending order.

// The where parameter is used to filter the messages array to only include messages that were sent by the user. The userId variable is used to match the userId field of the Message model.

// The _count field is included to fetch the count of messages sent by the user. The select parameter is used to specify which fields to include in the count. In this case, only the messages field is included.

// After executing this code, the companion variable will contain the companion record along with the related messages array and the count of messages sent by the user.
