// PrismaClient is a type-safe database client that can be used to interact with a database. It provides a simple and intuitive API for performing CRUD operations on a database.
import { PrismaClient } from "@prisma/client";  


declare global { // declare global is a way to extend the global scope in TypeScript
   var prisma: PrismaClient | undefined; // declare a global variable called prisma of type PrismaClient
  } 


// Prevent Next 13 hot reloading when initializing the prisma client 
    // globalThis is a new global object in JavaScript, similar to window, but for any environment (browser, Node.js, Web Workers, etc).
 const prismadb = globalThis.prisma || new PrismaClient(); 
 if (process.env.NODE_ENV === "development") globalThis.prisma = prismadb;

 export default prismadb;