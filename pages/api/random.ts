import { NextApiRequest, NextApiResponse } from 'next';
import serverAuth from '@/lib/serverAuth'
import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();


export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    await serverAuth(req);

    const movieCount = await client.movie.count();
    const randomIndex = Math.floor(Math.random() * movieCount);

    const randomMovies = await client.movie.findMany({
      take: 1,
      skip: randomIndex,
    });

    return res.status(200).json(randomMovies[0]);
  } catch (err) {
    console.log(err);
    return res.status(400).end();
  }
}