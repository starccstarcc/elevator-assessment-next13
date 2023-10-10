import { Player } from "@prisma/client";

type PlayerQueryParams = {
  take?: number;
  lastCursor?: string;
};

export async function getPlayersFn({ take, lastCursor }: PlayerQueryParams) {
  const res = await fetch(`/api/players?take=${take}&lastCursor=${lastCursor}`);

  if (!res.ok) {
    console.error(res);
  } else {
    return await res.json();
  }
};

export async function getPlayerFn(id: string) {
  const res = await fetch(`/api/players/${id}`);

  if (!res.ok) {
    throw new Error('Failed to get the player');
  }

  return await res.json();
}

export async function createPlayerFn(newPlayer: Omit<Player, 'id' | 'createdAt' | 'updatedAt'>) {
  const { name, teamName, salary, image } = newPlayer;

  try {
    const res = await fetch('/api/players', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, teamName, salary, image })
    });

    if (!res.ok) {
      throw new Error('Failed to create a new Player');
    }
  } catch (error) {
    console.error(error);
  }
}

export async function updatePlayerFn(playerToUpdate: Omit<Player, 'createdAt' | 'updatedAt'>) {
  const { id, name, teamName, salary, image } = playerToUpdate;

  try {
    const res = await fetch(`/api/players/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        teamName,
        salary,
        image
      })
    });

    if (!res.ok) {
      throw new Error('Failed to update the player');
    }
  } catch (error) {
    console.error(error);
  }
}

export async function deletePlayerFn(id: string) {
  try {
    const res = await fetch(`api/players/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (!res.ok) {
      throw new Error('Failed to delete the player');
    }
  } catch (error) {
    console.error(error);
  }
}
