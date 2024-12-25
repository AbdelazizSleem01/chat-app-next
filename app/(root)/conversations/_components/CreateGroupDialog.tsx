"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { api } from "@/convex/_generated/api";
import { useMutationState } from "@/hooks/UseMutationState";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { CirclePlus, X } from "lucide-react";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createGroupFormSchema = z.object({
  name: z.string().min(1, { message: "Write something" }).max(50),
  members: z.string().array().min(1, { message: "You should select at least one friend" }).max(1000),
});

const CreateGroupDialog = () => {
  const friends = useQuery(api.friends.get);
  const { mutate: createGroup, pending } = useMutationState(api.conversation.createGroup);

  const form = useForm<z.infer<typeof createGroupFormSchema>>({
    resolver: zodResolver(createGroupFormSchema),
    defaultValues: { name: "", members: [] },
  });

  const members = form.watch("members", []);

  const unSelectedFriends = useMemo(() => {
    return friends ? friends.filter((friend) => !members.includes(friend._id)) : [];
  }, [members, friends]); // Include `members` and `friends` in the dependency array

  const handleSubmit = async (value: z.infer<typeof createGroupFormSchema>) => {
    try {
      await createGroup(value);
      form.reset();
      toast.success("Group Created Successfully!");
    } catch (error) {
      toast.error(error instanceof ConvexError ? error.data : "Failed to create group, please try again!");
    }
  };

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger>
          <DialogTrigger asChild>
            <Button size="icon" variant="outline">
              <CirclePlus />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Create New Group</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="block bg-white">
        <DialogHeader>
          <DialogTitle>
            <p className="text-center">Create a New Group</p>
          </DialogTitle>
          <DialogDescription>
            <p className="text-center">Create a new group with your friends to share messages, files, and more.</p>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 mt-4">
            {/* Group Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the group name..." {...field} className="border-orange-600" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Friends */}
            <FormField
              control={form.control}
              name="members"
              render={() => (
                <FormItem>
                  <FormLabel>Friends</FormLabel>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild disabled={unSelectedFriends.length === 0}>
                        <Button className="w-full border-orange-600" variant="outline">
                          Select
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        {unSelectedFriends.map((friend) => (
                          <DropdownMenuCheckboxItem
                            key={friend._id}
                            className="flex p-2 items-center gap-4 w-full"
                            onCheckedChange={(checked) => {
                              if (checked) form.setValue("members", [...members, friend._id]);
                            }}
                          >
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={friend.imageUrl} />
                              <AvatarFallback>
                                {friend.username[0]}
                                {friend.username.length > 1 ? friend.username[1] : ""}
                              </AvatarFallback>
                            </Avatar>
                            <h4 className="truncate">{friend.username}</h4>
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {members && members.length ? (
              <Card className="flex items-center gap-3 overflow-auto w-full h-24 no-scrollbar p-2">
                {friends
                  ?.filter((friend) => members.includes(friend._id))
                  .map((friend) => (
                    <div key={friend._id} className="flex flex-col items-center gap-1">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={friend.imageUrl} />
                          <AvatarFallback>
                            {friend.username[0]}
                            {friend.username.length > 1 ? friend.username[1] : ""}
                          </AvatarFallback>
                        </Avatar>
                        <X
                          className="text-muted-foreground w-4 h-4 absolute bottom-8 left-7 bg-muted rounded-full cursor-pointer"
                          onClick={() => form.setValue("members", members.filter((id) => id !== friend._id))}
                        />
                      </div>
                      <p className="truncate text-sm"> {friend.username.split(" ")[0]}</p>
                    </div>
                  ))}
              </Card>
            ) : null}
            <DialogFooter>
              <Button variant="default" type="submit" disabled={pending} className="w-full">
                Create Group
              </Button>
              <Button variant="outline" disabled={pending} className="w-full">
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;