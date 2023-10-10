import Link from "next/link";
import { notFound } from "next/navigation";
import PlayerCard from "@/app/components/PlayerCard.tsx/PlayerCard";
import { getPlayer } from "@/app/api";
import { AppRoutes } from "@/lib/utils/constants/AppRoutes";

export default async function PlayerInfoPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const player = await getPlayer(id);

  if (!player) throw notFound();

  return (
    <div className="w-full h-full flex flex-col items-center mt-10">
      <h3 className="text-2xl mb-4">Player Information</h3>
      <PlayerCard {...player} />
      <Link
        className="btn-primary flex ml-auto mb-4"
        href={`${AppRoutes.Home}`}
      >
        Back to List page
      </Link>
    </div>
  );
}
