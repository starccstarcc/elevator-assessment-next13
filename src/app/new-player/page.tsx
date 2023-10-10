"use client";

import { AppRoutes } from "@/lib/utils/constants/AppRoutes";
import { createPlayerFn } from "@/lib/utils/constants/queryFns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { containerVariant } from "@/lib/framer-motion/variants";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NewPlayerPage() {
  const [name, setName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [salary, setSalary] = useState("");
  const [image, setImage] = useState("");

  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutateAsync: createPlayer } = useMutation({
    mutationFn: createPlayerFn,
    onSuccess: () => {
      router.push(AppRoutes.Home);
      queryClient.invalidateQueries(["players"]);
    },
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      createPlayer({ name, teamName, salary, image });

      router.push(AppRoutes.Home);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <motion.section
      variants={containerVariant}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center w-full h-full mt-10"
    >
      <h3 className="text-2xl mb-4">Create a New Player</h3>
      <form
        onSubmit={handleSubmit}
        className="flex gap-4 flex-col sm:w-2/3 md:w-1/3"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Player Name"
          className="input-primary"
          required
        />
        <input
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          type="text"
          placeholder="Team Name"
          className="input-primary"
          required
        />
        <input
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          type="text"
          placeholder="Salary"
          className="input-primary"
          required
        />
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          type="text"
          placeholder="Image Url"
          className="input-primary"
          required
        />
        <div className="flex gap-1 justify-end">
          <Link href=".." className="btn-secondary">
            Cancel
          </Link>
          <button type="submit" className="btn-primary">
            Create
          </button>
        </div>
      </form>
    </motion.section>
  );
}
