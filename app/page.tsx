"use client";
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, addUser, deleteAllUsers } from "@/actions/User";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  //Queries

  const queryClient = useQueryClient();
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  //Mutations
  const newUserMutation = useMutation({
    mutationFn: (name: string) => addUser(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
  const deleteAllUsersMutation = useMutation({
    mutationFn: () => deleteAllUsers(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  //Event Handlers
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const name = (form.elements[0] as HTMLInputElement).value;

    newUserMutation.mutate(name);
  };
  const handleDeleteAllUsers = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    deleteAllUsersMutation.mutate();
  };

  const { data, isError, error, isLoading } = usersQuery;
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (!data) return null;

  // Split the data into four columns with a maximum of 10 users per column
  const columns = Array.from({ length: 4 }, (_, i) =>
    data.slice(i * 10, (i + 1) * 10)
  );

  return (
    <div className="h-screen items-center justify-center flex flex-col gap-8">
      <div className="grid grid-cols-4 gap-4">
        {columns.map((column, columnIndex) => (
          <ul key={columnIndex} className="list-disc space-y-2">
            {column.map((user) => (
              <li className="list-item" key={user.id}>
                {user.name}
              </li>
            ))}
          </ul>
        ))}
      </div>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="name"
          className="mr-2 p-2 bg-transparent border rounded-lg"
          disabled={newUserMutation.isPending}
        />
        <Button type="submit" disabled={newUserMutation.isPending}>
          Add
        </Button>
      </form>
      <form onSubmit={handleDeleteAllUsers}>
        <Button
          variant={"destructive"}
          disabled={deleteAllUsersMutation.isPending}
        >
          Delete All Users
        </Button>
      </form>
    </div>
  );
};

export default HomePage;
