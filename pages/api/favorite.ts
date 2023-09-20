import { NextApiRequest, NextApiResponse } from 'next'
import { without } from 'lodash'
import { PrismaClient } from '@prisma/client'
import serverAuth from '@/lib/serverAuth'

const client = new PrismaClient();

export default async function handler(req:NextApiRequest, res: NextApiResponse) {
  try {
    
    if (req.method === 'POST') {
      const { currentUser } = await serverAuth(req);

      const { movieId } = req.body;

      const existingMovie = await client.movie.findUnique({
        where: {
          id: movieId,
        }
      });

      if (!existingMovie) {
        throw new Error('Invalid ID');
      }

      const user = await client.user.update({
        where: {
          email: currentUser.email || ''
        },
        data: {
          favoriteIds: {
            push: movieId,
          }
        }
      });

      return res.status(200).json(user);
    }

    if (req.method === 'DELETE') {
      const { currentUser } = await serverAuth(req);

      const { movieId } = req.body;

      const existingMovie = await client.movie.findUnique({
        where: {
          id: movieId
        }
      });

      if (!existingMovie) {
        throw new Error('Invalid ID');
      }

      const updateFavouriteId = without(currentUser.favoriteIds, movieId);

      const updatedUser = await client.user.update({
        where: {
          email: currentUser.email || ''
        },
        data: {
          favoriteIds: updateFavouriteId
        }
      });

      return res.status(200).json(updatedUser)
    }

    return res.status(405).end()
  } catch (err) {
    console.log(err);
    return res.status(400).end();
  }
}
