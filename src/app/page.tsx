import getQueryClient from "@/lib/tanstack-query/getQueryClient";
import { dehydrate } from "@tanstack/query-core";
import prisma from "../../utils/prisma";
import Hydrate from "@/lib/tanstack-query/HydrateClient";
import PlayerList from "./components/PlayerList/PlayerList";

async function getPlayersServerFn() {
  const players = await prisma.player.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
  });

  return players;
}

export default async function Home() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(["players"], getPlayersServerFn);

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <PlayerList />
    </Hydrate>
  );
}
