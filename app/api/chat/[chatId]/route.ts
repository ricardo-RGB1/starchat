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
        messages: {
          // add a new message to the messages array
          create: {
            // create a new message based on the prompt
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

    // generate some filenames for the memory manager
    const name = companion.id;
    const companion_file_name = name + ".txt";

    // Companion key object
    const companionKey = {
      companionName: name,
      userId: user.id,
      modelName: "llama2-13b",
    };

    // Create a new memory manager, if it doesn't already exist
    const memoryManager = await MemoryManager.getInstance();
    const records = await memoryManager.readFromHistory(companionKey); // read from hx
    // If there are no records, seed the chat history with an example prompt
    // "Instructions" & "Example Conversation" are the two prompts that are seeded to the initial chat history or memory to create the behavior of the AI.
    // Use the memoryManager.seedChatHistory function to get the seed content from the companion object and seed the chat history.
    if (records.length === 0) {
      await memoryManager.seedChatHistory(companion.seed, "\n\n", companionKey);
    }

    // Next, write to hx with the new prompt the user has entered to the vector database.
    await memoryManager.writeToHistory("User: " + prompt + "\n", companionKey); // write to hx

    // Query the recent chat history from the vector database
    const recentChats = await memoryManager.readFromHistory(companionKey); // read from hx

    // Get similar docs from the vector database
    const similarDocs = await memoryManager.vectorSearch(
      recentChats, // an array of recent chat messages used to search for similar documents.
      companion_file_name // the name of the companion file to search for similar documents.
    );

    // Find the relevant hx records from the vector database
    let relevantHxRecords = "";

    // Loop through the similar docs and find the relevant hx records
    // check if not null and not empty
    //use map method to create a new array of strings by extracting the pageContent property from each object in the similarDocs array.
    if (!!similarDocs && similarDocs.length !== 0) {
      relevantHxRecords = similarDocs.map((doc) => doc.pageContent).join("\n");
    }

    // CREATE A NEW MODEL *******
    const { handlers } = LangChainStream();

    const model = new Replicate({
      model:
        "meta/llama-2-13b-chat:f4e2de70d66816a838a89eeeb621910adffb0dd0baba3976c96980970978018d",
      input: {
        max_length: 2048,
      },
      apiKey: process.env.REPLICATE_API_TOKEN,
      callbackManager: CallbackManager.fromHandlers(handlers),
    });

    model.verbose = true;

    // Generate a response from the model
    const response = String(
      // convert the response to a string
      await model
        .call(
          `
        ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${companion.name}: prefix. 

        ${companion.instructions}

        Below are relevant details about ${companion.name}'s past and the conversation you are in.
        ${relevantHxRecords}

        ${recentChats}\n${companion.name}:`
        )
        .catch(console.error)
    );

 



  } catch (error) {
    console.log("[CHAT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// ***** NOTES *****

// similarDocs using the vectorSearch method of the memoryManager object to search for similar documents based on a set of recent chats and a companion file name. Overall, this code is using a vector search algorithm to find similar documents based on a set of recent chat messages and a companion file name.
