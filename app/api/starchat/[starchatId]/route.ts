import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function PATCH(
    req: Request,
    { params }: { params: { starchatId: string } } // Get the starchatId from the URL  
    ){
    try {
        const body = await req.json(); // Get the body of the request
        const user = await currentUser() // Get the current user from Clerk
        const { src, name, description, instructions, seed, categoryId } = body;

        if(!params.starchatId){ // Check if the starchatId is provided
            return new NextResponse("Starchat ID is required", {status: 400});
        } 
        if(!user || !user.id || !user.firstName){ // Check if the user is logged in
            return new NextResponse("Unauthorized", {status: 401});
        }

        if(!src || !name || !description || !instructions || !seed || !categoryId){ 
            return new NextResponse("Unauthorized", {status: 401});
        }

        // TODO: Check if the user has an active subscription

        
        // Create a new AIchat
        const aiChat = await prismadb.companion.update({  
            where: { 
                id: params.starchatId, // Specify the AIchat to update
                userId: user.id // Specify the user who created the AIchat
             },
            data: { // Specify the data to update
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

        // Read below for explanation ****
        return NextResponse.json(aiChat); 

    } catch (error) {
        console.log("[STARCHAT_PATCH]", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}

// DELETE function for the AIchat
export async function DELETE(
    request: Request,
    {params}: {params: {starchatId: string}}
){
    try {
        const { userId } = auth();

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401});
        }

        // Delete the AIchat from the database
        // Can only be deleted by the user who created it
        const companion = await prismadb.companion.delete({ 
            where: {
                userId,
                id: params.starchatId
            }
        })

        return NextResponse.json(companion);

    } catch (error) {
        console.log("[STARCHAT_DELETE]", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}

// EXPLANATION FOR: return NextResponse.json(aiChat);
// NextResponse.json() is a static method of the NextResponse class. Static methods are called on the class itself, rather than on an instance of the class.
// When you call NextResponse.json(aiChat), you are not creating a new instance of the NextResponse class. Instead, you are calling the json() method on the NextResponse class itself, passing in the aiChat object as a parameter.
// The json() method returns a new instance of the NextResponse class with the specified JSON object as the response body. Therefore, you do not need to use the new keyword when calling NextResponse.json(aiChat).