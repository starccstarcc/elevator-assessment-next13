"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Player } from "@prisma/client";
import { getPlayersFn } from "@/lib/utils/constants/queryFns";
import Loading from "../Loading/Loading";
import { useRouter } from "next/navigation";
import { AppRoutes } from "@/lib/utils/constants/AppRoutes";
import { useEffect } from "react";
import PlayerCard from "../PlayerCard.tsx/PlayerCard";

export default function PlayerList() {
  const router = useRouter();
  const { ref, inView } = useInView();
  const {
    data,
    isFetching,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["players"],
    queryFn: ({ pageParam = "" }) =>
      getPlayersFn({ take: 10, lastCursor: pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage?.metaData.lastCursor;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

  if (!data) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-center text-h3">No data has found.</p>
      </div>
    );
  }
  if (isFetching && !isFetchingNextPage)
    return (
      <div className="flex justify-center items-center w-full h-[calc(100vh-100px)]">
        <Loading />
      </div>
    );

  return (
    <>
      <h3 className="text-2xl mt-4">Player List</h3>
      <div className="mt-10 w-2/3">
        <button
          className="btn-primary flex ml-auto mb-4"
          onClick={() => router.push(AppRoutes.New)}
        >
          + New Player
        </button>
        {isSuccess &&
          data.pages?.map((page) =>
            page.data.map((player: Player, index: number) => {
              if (page.data.length === index + 1) {
                return (
                  <div ref={ref} key={index}>
                    <PlayerCard key={player.id} {...player} />
                  </div>
                );
              } else {
                return <PlayerCard key={player.id} {...player} />;
              }
            })
          )}

        {isFetchingNextPage && (
          <div className="flex justify-center">
            <Loading />
          </div>
        )}
      </div>
    </>
  );
}
