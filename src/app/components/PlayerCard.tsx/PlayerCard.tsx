"use client";

import { AppRoutes } from "@/lib/utils/constants/AppRoutes";
import { Player } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deletePlayerFn } from "@/lib/utils/constants/queryFns";
import Image from "next/image";

export default function PlayerCard(props: Player) {
  const { id, name, teamName, salary, image } = props;

  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deletePlayerFn,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["players"] });

      const previousPlayers = queryClient.getQueryData<Player[]>(["players"]);

      let updatedPlayers: Player[] = [];

      if (previousPlayers) {
        updatedPlayers = [...previousPlayers].filter(
          (player) => player.id !== id
        );
      }

      queryClient.setQueriesData<Player[]>(["players"], updatedPlayers);

      return { previousPlayers };
    },
    onError: (context: { previousPlayers?: Player[] | undefined }) => {
      queryClient.setQueryData<Player[]>(["players"], context.previousPlayers);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
  });

  const handleDeletePlayer = (id: string) => {
    if (confirm("Do you really delete this player?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg p-4">
      <div className="flex items-center">
        <Image
          alt="profile picture"
          src={image}
          className="rounded-full object-cover h-10 w-10 mr-3"
          width={60}
          height={60}
        />
        <div>
          <button
            className="font-medium text-gray-700 font-bold"
            onClick={() => router.push(`${AppRoutes.Info}/${id}`)}
          >
            {name}
          </button>
          <div className="text-gray-400">Team: {teamName}</div>
          <div className="text-gray-400">Salary: ${salary}</div>
        </div>
        <div className="flex gap-1 ml-auto">
          <button
            className="btn-secondary px-4"
            onClick={() => router.push(`${AppRoutes.Update}/${id}`)}
          >
            Edit
          </button>
          <button className="btn-danger" onClick={() => handleDeletePlayer(id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
