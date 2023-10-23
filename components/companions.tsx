import { Category, Companion } from "@prisma/client";
import Image from "next/image";
import { Card, CardFooter, CardHeader } from "./ui/card";
import Link from "next/link";
import { MessagesSquare } from "lucide-react";



// use an intersection type to combine the Companion type with an object that has a _count property
 interface CompanionsProps {
   data: (Companion & { 
     _count: {
       messages: number;
     };
   })[]; 
 }





const Companions = ({ data }: CompanionsProps) => {

  if (data.length === 0) {
    return (
      <div className="pt-10 flex flex-col items-center justify-center space-y-3">
        <div className="relative w-60 h-60">
          <Image
            fill
            className="grayscale-1"
            alt="Empty"
            src="/happy-star.svg"
          />
        </div>
        <p className="text-sm text-muted-foreground">No results found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 pb-10">
      {data.map((item) => (
        <Card key={item.id} className="bg-primary/10 rounded-xl cursor-pointer  transition border-0 opacity-75 hover:opacity-100">
          <Link href={`/chat/${item.id}`}>
            <CardHeader className="flex items-center justify-center text-center text-muted-foreground">
              <div className="relative w-32 h-32">
                <Image
                  src={item.src}
                  alt={item.name}
                  fill
                  className="rounded-xl object-cover"
                /> 
              </div>
              <p className="font-bold">
                {item.name}
              </p>
              <p className="text-xs" >
                {item.description}
              </p>
            </CardHeader>
            <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
              <p>
              <span className="font-semibold">Creator</span>: {item.userName}
              </p>
              <div className="flex items-center">
                <MessagesSquare className="w-3 h-3 mr-1" />
                {item._count.messages}
              </div>
            </CardFooter>
          </Link>
        </Card>
      ))}
    </div>
  );
};

export default Companions;

// EXPLANATION for CompanionProps:
// This code defines an interface called CompanionsProps in TypeScript. The interface has a single property called data, which is an array of objects. Each object in the array is of type Companion and has an additional _count property that is an object with a single property called messages, which is a number.

// The & symbol is used to combine two types into a single type. In this case, it combines the Companion type with an object that has a _count property. This allows us to add the _count property to the Companion type without modifying the original type.

// The square brackets [] after the closing parenthesis of the object type indicate that this is an array of objects. The parentheses around the object type are necessary because we are adding an additional property to the Companion type.

// Overall, this interface is used to define the shape of the props object passed to a component that displays a list of companions, along with the number of messages associated with each companion.
