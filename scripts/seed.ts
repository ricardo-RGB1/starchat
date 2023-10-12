// Node file system module
const { PrismaClient } = require('@prisma/client') 

const db = new PrismaClient() // Create a new PrismaClient instance

 async function main() { // Define an asynchronous function called "main"
    try {
        await db.category.createMany({ // Create some default categories using the "category.createMany" method of the PrismaClient
            data: [
                {name: "Famous People"},
                {name: "Movies & TV"},
                {name: "Musicians"},
                {name: "Philosophy"},
                {name: "Scientists"},
                {name: "Sports"},
                {name: "Politics"},
                {name: "History"},
                {name: "Art"},
                {name: "Literature"},
            ]
        })
    } catch (error) {
        console.error("Error seeding default categories", error); 
    } finally {
        await db.$disconnect()
    }
 }; 


 main(); 

//  This code is a TypeScript file that uses PrismaClient to seed the database with some default categories.

// First, it imports the PrismaClient from the "@prisma/client" package and creates a new instance of it.

// Then, it defines an asynchronous function called "main" that creates some default categories using the "category.createMany" method of the PrismaClient. The "createMany" method is used to create multiple records in a single query.

// The categories are defined as an array of objects with a "name" property.

// If an error occurs during the seeding process, it is logged to the console.

// Finally, the PrismaClient is disconnected using the "$disconnect" method.

// This code can be executed by running the "main" function. It is a common practice to run this type of seeding code once during the application startup to populate the database with some default data.