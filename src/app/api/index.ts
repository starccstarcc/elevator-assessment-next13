import { Player } from "@prisma/client";
import prisma from "../../../utils/prisma";

export async function getPlayer(id: string) {
  try {
    const data = await prisma.player.findFirst({
      where: { id },
    });
    if (!data) throw new Error("Not Found");
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function deletePlayer(id: string) {
  try {
    await prisma.player.delete({
      where: { id },
    });
    return "success";
  } catch (error) {
    return error;
  }
}
