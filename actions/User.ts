"use server";

import prisma from "@/lib/db";

async function getUsers() {
  const users = await prisma.users.findMany();

  return users;
}

async function addUser(name: string) {
  await prisma.users.create({
    data: {
      name,
    },
  });

  return true;
}

async function deleteAllUsers() {
  await prisma.users.deleteMany();

  return true;
}

export { getUsers, addUser, deleteAllUsers };
