import prisma from "../../../../utils/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const take = url.searchParams.get('take');
    const lastCursor = url.searchParams.get('lastCursor');

    let result = await prisma.player.findMany({
      take: take ? parseInt(take as string) : 10,
      ...(lastCursor && {
        skip: 1,
        cursor: {
          id: lastCursor as string,
        }
      }),
      orderBy: { createdAt: 'desc' }
    });

    if (!result.length) {
      return new Response(JSON.stringify({
        data: [],
        metaData: {
          lastCursor: null,
          hasNextPage: false,
        },
      }), { status: 200 });
    }

    const lastPostInResults: any = result[result.length - 1];
    const cursor: any = lastPostInResults.id;

    const nextPage = await prisma.player.findMany({
      take: take ? parseInt(take as string) : 7,
      skip: 1,
      cursor: {
        id: cursor,
      }
    });

    const data = {
      data: result,
      metaData: {
        lastCursor: cursor,
        hasNextPage: nextPage.length > 0,
      }
    };

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    return new Response('Failed to fetch', { status: 500 });
  }
}

export async function POST(req: Request) {
  const { name, teamName, salary, image } = await req.json();

  try {
    const data = await prisma.player.create({
      data: {
        name,
        teamName,
        salary,
        image,
        createdAt: new Date(),
      }
    });

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    return new Response('Failed to create a new Player', { status: 500 });
  }
}