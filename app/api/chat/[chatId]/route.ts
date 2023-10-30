import { StreamingTextResponse, LangChainStream } from "ai";
import { auth, currentUser } from "@clerk/nextjs";
import { CallbackManager } from "langchain/callbacks";
import { Replicate } from "langchain/llms/replicate";
import { NextResponse } from "next/server";

import { MemoryManager } from "@/lib/memory";
import { rateLimit } from "@/lib/rate-limit";
import prismadb from "@/lib/prismadb";

export async function POST(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const { prompt } = await request.json();
    const user = await currentUser();

    // Check if user is logged in
    if (!user || !user.firstName || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // create an identifier for the rate limit; this will be unique for each user
    const identifier = request.url + "-" + user.id;
    const { success } = await rateLimit(identifier); // check if the user is allowed to perform the action

    // return a 429 response if the user is not allowed to perform the action
    if (!success) {
      return new NextResponse("Rate limit exceeded", { status: 429 });
    }

    // Update the chat prompt
    const companion = await prismadb.companion.update({
      where: {
        id: params.chatId,
        userId: user.id,
      },
      data: { 
        messages: { // add a new message to the messages array
          create: { // create a new message based on the prompt
            content: prompt, // set the content of the message to the prompt
            role: "user", // set the role of the message to "user"
            userId: user.id, // set the userId of the message to the user's id
          },
        },
      },
    });

    // Check if the companion exists in the database
    if (!companion) {
      return new NextResponse("Not found", { status: 404 });
    }



  } catch (error) {
    console.log("[CHAT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
