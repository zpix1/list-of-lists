import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../lib/session';
import { List, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ListsResponse {
    ownedLists: List[];
    accessLists: List[];
}

export default withIronSessionApiRoute(listsRoute, sessionOptions);

async function listsRoute(req: NextApiRequest, res: NextApiResponse) {
    const user = req.session.user;

    if (!user || !user.isLoggedIn) {
        res.status(401).end();
        return;
    }

    try {
        const response = await prisma.user.findUnique({
            where: {
                id: req.session.user?.id
            },
            include: {
                ownedLists: true,
                accessLists: true
            }
        });

        if (!response) {
            throw new Error('user not found');
        }

        const { ownedLists, accessLists } = response;

        res.json({
            accessLists: accessLists,
            ownedLists: ownedLists
        });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}
