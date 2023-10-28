import { Redis } from "@upstash/redis";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { delimiter } from "path";

export type CompanionKey = {
  companionName: string;
  modelName: string;
  userId: string;
};

export class MemoryManager {
  private static instance: MemoryManager; // singleton instance of MemoryManager
  private history: Redis; // redis client for chat history
  private pinecone: Pinecone; // pinecone client for vector search

  public constructor() {
    this.history = Redis.fromEnv(); // create redis client
    this.pinecone = new Pinecone({ // create pinecone client
      apiKey: process.env.PINECONE_API_KEY!,
      environment: process.env.PINECONE_ENVIRONMENT!,
    }); // These properties are used to authenticate and connect to the Pinecone database.
   
  }

  public async vectorSearch(
    recentChatHistory: string,
    companionFileName: string
  ) {
    const pineconeClient = <Pinecone>this.pinecone; // cast to Pinecone

    const pineconeIndex = pineconeClient.Index( // get index from pinecone
      process.env.PINECONE_INDEX! || "" // pass in index name from env var
    );

    const vectorStore = await PineconeStore.fromExistingIndex( // get vector store
      new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY! }),
      { pineconeIndex } // pass in index
    );

     const similarDocs = await vectorStore // get similar docs
        .similaritySearch(recentChatHistory, 3, {fileName: companionFileName})
        .catch((err) => {
            console.log("Failed to get vector search results", err); 
        });
        
        return similarDocs;
  }

     // function to get the instance of MemoryManager (returns a promise that resolves to a MemoryManager instance)
     public static async getInstance(): Promise<MemoryManager> {
        if (!MemoryManager.instance) { // if instance does not exist
          MemoryManager.instance = new MemoryManager(); // create new instance
        }
        return MemoryManager.instance; 
      }



      // A function to generate Redis companion key
      // companionKey is an object with the companion name, model name, and user ID
      private generateRedisCompanionKey(companionKey: CompanionKey): string { 
        return `${companionKey.companionName}:${companionKey.modelName}:${companionKey.userId}`
      }


        // A function to write to Redis chat history (returns a promise that resolves to a string). The function will adapt to user information from the companionKey parameter.
      public async writeToHistory(text: string, companionKey: CompanionKey) {
        if(!companionKey || typeof companionKey.userId == 'undefined') {
            console.log("Companion key set incorrectly");
            return ''; 
        }

        const key = this.generateRedisCompanionKey(companionKey); // generate redis key
        const result = await this.history.zadd(key, { // add to redis
            score: Date.now(), // add timestamp to redis
            member: text, // add text to redis
        }); 
        return result;
      }
   


      // Function to read from hx
      public async readFromHistory(companionKey: CompanionKey): Promise<string> {
        if(!companionKey || typeof companionKey.userId == 'undefined') {
            console.log("Companion key set incorrectly");
            return ''; 
        }
        // generate redis key
        const key = this.generateRedisCompanionKey(companionKey);
        let result = await this.history.zrange(key, 0, Date.now(), { 
            byScore: true,
        });
        // get last 30 messages and reverse
        result = result.slice(-30).reverse();
        const recentChats = result.reverse().join('\n'); // join messages with new line
        return recentChats;
      }


        // Function to get chat history ****
      public async seedChatHistory(
        seedContent: string,
        delimiter: string = '\n',
        companionKey: CompanionKey
        ) {
            const key = this.generateRedisCompanionKey(companionKey); // generate redis key

            if(await this.history.exists(key)) { // check if key exists
                return; 
            }

            const content = seedContent.split(delimiter); // split content by delimiter
            let counter = 0; 


            for (const line of content) { // loop through content
                await this.history.zadd(key, {score: counter, member: line}); // add to redis
                counter++;
            }
        }


}


// ***** vectorSearch method in the MemoryManager class: *****
// This method performs a similarity search on a Pinecone index using the PineconeStore class to find the most similar documents to the recentChatHistory parameter.

// Here is a breakdown of what the code does:

// It first casts the pinecone property of the MemoryManager class to a Pinecone instance and creates a Pinecone index using the Index method of the Pinecone instance.

// It then creates a PineconeStore instance using the fromExistingIndex method, passing in an instance of the OpenAIEmbeddings class and the pineconeIndex object.

// Finally, it calls the similaritySearch method on the vectorStore object to perform the similarity search. The method returns a Promise that resolves to an array of the most similar documents to the recentChatHistory parameter, with a maximum of 3 results. The fileName option is used to filter the search results to only include documents with the specified file name. If an error occurs during the search, it is caught and logged to the console.

// The method returns the search results as an array of documents.


 // (The ! operator is used to assert that the process.env.PINECONE_API_KEY and process.env.PINECONE_ENVIRONMENT environment variables are defined. If they are not defined, the application will throw an error and exit. This is done to ensure that the Pinecone client is properly configured before it is used.)





 // ***** writeToHistory method in the MemoryManager class: *****
//  Purpose: to write a chat message to the chat history in Redis.

// Here is a breakdown of what the code does:
// The function takes two parameters: text and companionKey. The text parameter is the chat message that will be written to the chat history. The companionKey parameter is an object that contains the userId of the user who sent the message and the companionId of the chatbot.

// The function first checks if the companionKey parameter is defined and if the userId property is defined. If either of these conditions is not met, the function logs an error message to the console and returns an empty string.

// The function then generates a Redis key using the generateRedisCompanionKey method of the MemoryManager class. This method takes the companionKey object as a parameter and returns a string that is used as the Redis key.

// The function then uses the zadd method of the Redis client to add the chat message to the Redis sorted set. The zadd method takes two parameters: the Redis key and an object that contains the score and member properties. The score property is set to the current timestamp using Date.now(), and the member property is set to the text parameter.

// The function returns the result of the zadd method, which is the number of elements added to the Redis sorted set.



// ***** seedChatHistory method in the MemoryManager class: *****
// This method is used to seed the chat history in Redis with a given string of chat messages.

// Here is a breakdown of what the code does:

// The function takes three parameters: seedContent, delimiter, and companionKey. The seedContent parameter is the string of chat messages that will be used to seed the chat history. The delimiter parameter is the character that will be used to split the seedContent string into individual chat messages. The companionKey parameter is an object that contains the userId of the user who sent the message and the companionId of the chatbot.

// The function first generates a Redis key using the generateRedisCompanionKey method of the MemoryManager class. This method takes the companionKey object as a parameter and returns a string that is used as the Redis key.

// The function then checks if the Redis key already exists in the chat history using the exists method of the Redis client. If the key already exists, the function returns without doing anything.

// If the Redis key does not exist, the function splits the seedContent string into individual chat messages using the split method and the delimiter parameter.

// The function then loops through each chat message and adds it to the Redis sorted set using the zadd method of the Redis client. The zadd method takes two parameters: the Redis key and an object that contains the score and member properties. The score property is set to the current index of the chat message in the content array, and the member property is set to the chat message itself.

// The function returns nothing, as it is an asynchronous function.