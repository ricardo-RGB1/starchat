"use client";
import axios from "axios";
import * as z from "zod"; // imported when installing "form" component from shadcn/ui
import { zodResolver } from "@hookform/resolvers/zod";
import { Wand2 } from "lucide-react";
import { Category, Companion } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import ImageUpload from "@/components/image-upload";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// The preamble is a string that is displayed to the user when they create a new companion.
// -- The preamble is displayed in the form's instructions field.
// -- The preamble is a good place to provide the user with information about the companion that they are creating.
const PREAMBLE =
  "You are Steve Jobs. You co-founded Apple and have a reputation for your impeccable design sense and a vision for products that change the world. You're charismatic and known for your signature black turtleneck. You are characterized by intense passion and unwavering focus. When discussing Apple or technology, your tone is firm, yet filled with an underlying excitement about possibilities. You are a perfectionist and a visionary. You want the world to be a better place and you believe that technology can help us get there.";

// The seedChat is a string that is displayed to the user when they create a new companion.
// -- The seedChat is displayed in the form's seed field.
// -- The seedChat is a good place to provide the user with an example of the companion's chat history.
const SEED_CHAT =
  "Human: Hi Steve, what's the next big thing for Apple?\nSteve: *intensely* We don't just create products. We craft experiences, ways to change the world.\nHuman: Your dedication is undeniable .\nSteve: *with fervor* Remember, those who are crazy enough to think they can change the world are the ones who do.";

interface StarchatFormProps {
  initialData: Companion | null;
  categories: Category[];
}

// The formSchema object defines the shape of the data that is submitted by the form.
const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  description: z.string().min(1, {
    message: "Description is required.",
  }),
  instructions: z.string().min(200, {
    message: "Instructions require at least 200 characters.",
  }),
  seed: z.string().min(200, {
    message: "Seed requires at least 200 characters.",
  }),
  src: z.string().min(1, {
    message: "Image is required",
  }),
  categoryId: z.string().min(1, {
    message: "Category  is required",
  })
});

// The StarchatForm component is a form that is used to create or edit a companion.
export const StarchatForm = ({
  initialData,
  categories,
}: StarchatFormProps) => {
  const router = useRouter();
  const {toast} = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      instructions: "",
      seed: "",
      src: "",
      categoryId: undefined,
    },
  });

  const isLoading = form.formState.isSubmitting; // The isLoading variable is set to true when the form is submitting.



  // The onSubmit function is called when the form is submitted.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if(initialData) {
         // The axios.patch() function is used to update the AIchat data in the database.
        await axios.patch(`/api/starchat/${initialData.id}`, data);
      } else{
        // The axios.post() function is used to create a new AIchat in the database.
        await axios.post("/api/starchat", data);
      }  
      toast({
        variant: "default",
        description: initialData ? "AI Chat updated!" : "AI Chat created!"
      })

      router.refresh(); // refresh all server components so that the new AIchat is displayed in the list of AIchats.
      router.push('/'); // navigate to the home page.

    } catch (error) { 
        toast({ 
          variant: "destructive",
          description: "Something went wrong"
        })
    }
  };

  return (    
    <div className="h-full p-4 space-y-2 ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 pb-10"
        >
          <div className="space-y-2">
            <div>
              <h3 className="text-lg font-medium">General Information</h3>
              <p className="text-sm text-muted-foreground">
                Basic info about your AI.
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <FormField
            name="src"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center space-y-4">
                <FormControl>
                  <ImageUpload
                    disabled={isLoading}
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="name"
              control={form.control} // The control property is set to form.control, which is a function that returns the form's control object. The control object contains the form's state and methods for updating the form's state.
              render={({ field }) => (
                <FormItem className="md:col-span-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="e.g. Steve Jobs"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem className="md:col-span-1">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="e.g. Co-founder of Apple"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="categoryId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Please select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                          className="hover:bg-primary/10"
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2 w-full ">
            <div>
              <h3 className="text-lg font-medium">Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Detailed Instructions for AI behavior
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>

          <FormField
            name="instructions"
            control={form.control}
            render={({ field }) => (
              <FormItem className="md:w-1/2">
                <FormLabel>
                  Instructions:{" "}
                  <span className="text-muted-foreground">
                    Describe in detail your AI's backstory
                  </span>{" "}
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-background resize-none"
                    rows={10}
                    disabled={isLoading}
                    placeholder={PREAMBLE}
                    {...field}
                  />
                </FormControl>
                <FormDescription>Minimum 200 characters</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="seed"
            control={form.control}
            render={({ field }) => (
              <FormItem className="md:w-1/2">
                <FormLabel>Example Conversation</FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-background resize-none"
                    rows={10}
                    disabled={isLoading}
                    placeholder={SEED_CHAT}
                    {...field}
                  />
                </FormControl>
                <FormDescription>Minimum 200 characters</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex justify-center">
            <Button size="lg" disabled={isLoading}>
              {initialData ? "Update AI Chat" : "Create AI"}
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};


// The form constant:
  // The useForm hook is used to create a form object that is used to manage the state of the form.
  // -- The resolver property is set to zodResolver(formSchema), which is a function that validates the form data using the zod library's schema.
  // -- The defaultValues property is set to an object that contains the initial values for the form fields.