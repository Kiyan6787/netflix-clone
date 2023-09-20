import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from '@prisma/client'
import serverAuth from "@/lib/serverAuth";

const client = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    await serverAuth(req);

    const { movieId } = req.query;

    if (typeof movieId !== 'string') {
      throw new Error('Invalid ID');
    }

    if (!movieId) {
      throw new Error('Invalid ID')
    }
  } catch(err) {
    console.log(err);
    return res.status(400).end();
  }
}