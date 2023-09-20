import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import serverAuth from '@/lib/serverAuth'

const client = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  try {
    
    const { currentUser } = await serverAuth(req)
    
    const favoriteMovie = await client.movie.findMany({
      where: {
        id: {
          in: currentUser?.favoriteIds
        }
      }
    });

    return res.status(200).json(favoriteMovie)
  } catch (err) {
    console.log(err);
    return res.status(400).end();
  }
}