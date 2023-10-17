import { Companion } from "@prisma/client";
import Image from "next/image";

interface CompanionsProps {
  data: (Companion & {
    _count: {
      messages: number;
    };
  })[];
}

const Companions = ({ data }: CompanionsProps) => {
    if(data.length === 0) {
        return (
        <div className="pt-10 flex flex-col items-center justify-center space-y-3">
            <div className="relative w-60 h-60">
                <Image fill className="grayscale" alt="Empty" src="/placeholder.svg"    />
            </div>
        </div>
        )
    }

  return <div>AI chats!</div>;
};

export default Companions;

// EXPLANATION for CompanionProps:
// This code defines an interface called CompanionsProps in TypeScript. The interface has a single property called data, which is an array of objects. Each object in the array is of type Companion and has an additional _count property that is an object with a single property called messages, which is a number.

// The & symbol is used to combine two types into a single type. In this case, it combines the Companion type with an object that has a _count property. This allows us to add the _count property to the Companion type without modifying the original type.

// The square brackets [] after the closing parenthesis of the object type indicate that this is an array of objects. The parentheses around the object type are necessary because we are adding an additional property to the Companion type.

// Overall, this interface is used to define the shape of the props object passed to a component that displays a list of companions, along with the number of messages associated with each companion.
