import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request){
    try {
        const body = await req.json(); // Get the body of the request
        const user = await currentUser() // Get the current user
        const { src, name, description, instructions, seed, categoryId } = body;

        if(!user || !user.id || !user.firstName){ // Check if the user is logged in
            return new NextResponse("Unauthorized", {status: 401});
        }

        if(!src || !name || !description || !instructions || !seed || !categoryId){ 
            return new NextResponse("Unauthorized", {status: 401});
        }

        // TODO: Check if the user has an active subscription

        
        // Create a new AIchat
        const aiChat = await prismadb.companion.create({ 
            data: {
                categoryId,
                userId: user.id,
                userName: user.firstName,
                src, 
                name,
                description,
                instructions,
                seed
            }  
        }); 

        return NextResponse.json(aiChat); // Return the new AIchat

    } catch (error) {
        console.log("[STARCHAT_POST]", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}