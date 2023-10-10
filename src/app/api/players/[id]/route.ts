import prisma from "../../../../../utils/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string; }; }
) {
  const { id } = params;

  try {
    const data = await prisma.player.findFirst({
      where: { id }
    });

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; }; }
) {
  const { name, teamName, salary, image } = await req.json();
  const { id } = params;

  try {
    const data = await prisma.player.update({
      where: { id },
      data: {
        name,
        teamName,
        salary,
        image,
        updatedAt: new Date()
      }
    });

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    return new Response('Failed to update the Player', { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; }; }
) {
  const { id } = params;

  try {
    const data = await prisma.player.delete({
      where: { id }
    });

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    return new Response('Failed to delete the Player', { status: 500 });
  }
}
