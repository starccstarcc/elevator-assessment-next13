'use client';

import { FormEvent, useEffect, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Player } from "@prisma/client";
import { getPlayerFn, updatePlayerFn } from "@/lib/utils/constants/queryFns";
import { AppRoutes } from "@/lib/utils/constants/AppRoutes";
import Loading from "@/app/components/Loading/Loading";
import { containerVariant } from "@/lib/framer-motion/variants";
import Link from "next/link";

export default function UpdatePlayerPage() {
  const [name, setName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [salary, setSalary] = useState('');
  const [image, setImage] = useState('');

  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useParams();

  const { data, isLoading: valuesLoading } = useQuery<Player>({
    queryKey: ['getPlayer', id],
    queryFn: () => getPlayerFn(id as string)
  });

  const updatePlayerMutation = useMutation({
    // @ts-ignore
    mutationFn: updatePlayerFn,
    onMutate: async (newPlayer) => {
      await queryClient.cancelQueries({ queryKey: ['players'] });

      const previousPlayers = queryClient.getQueryData<Player[]>(['players']);

      if (previousPlayers) {
        const updatedPlayers: Player[] = [...previousPlayers].map(player =>
          player.id === newPlayer.id ? { ...player, ...newPlayer } : player
        );
        queryClient.setQueryData<Player[]>(['players'], updatedPlayers);
      }

      return { previousPlayers };
    },
    onError: (
      err,
      variables,
      context: { previousPlayers?: Player[] | undefined; }
    ) => {
      queryClient.setQueryData<Player[]>(['players'], context.previousPlayers);
    },
    onSuccess: () => {
      router.push(AppRoutes.Home);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
    }
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    updatePlayerMutation.mutate({
      id: id as string,
      name,
      teamName,
      salary,
      image
    });
  }

  useEffect(() => {
    if (data) {
      setName(data.name);
      setTeamName(data.teamName);
      setSalary(data.salary);
      setImage(data.image);
    }
  }, [data]);

  if (valuesLoading) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!data) throw notFound();

  return (
    <motion.section
      variants={containerVariant}
      initial="hidden"
      animate="visible"
      className="w-full h-full flex flex-col items-center mt-10"
    >
      <h3 className="text-2xl mb-4">Update Player</h3>
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 flex-col sm:w-2/3 md:w-1/3"
      >
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          type="text"
          className="input-primary"
          required
        />
        <input
          value={teamName}
          onChange={e => setTeamName(e.target.value)}
          type="text"
          className="input-primary"
          required
        />
        <input
          value={salary}
          onChange={e => setSalary(e.target.value)}
          type="text"
          className="input-primary"
          required
        />
        <input
          value={image}
          onChange={e => setImage(e.target.value)}
          type="text"
          className="input-primary"
          required
        />
        <div className="flex gap-1 justify-end">
          <Link href=".." className="btn-secondary">
            Cancel
          </Link>
          <button
            disabled={updatePlayerMutation.isLoading}
            type="submit"
            className="btn-primary"
          >
            Update
          </button>
        </div>
      </form>
    </motion.section>
  );
}