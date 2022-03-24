import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../../lib/session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default withIronSessionApiRoute(tagsRoute, sessionOptions);

async function tagsRoute(req: NextApiRequest, res: NextApiResponse) {
    const user = req.session.user;

    if (!user || !user.isLoggedIn) {
        res.status(401).end();
        return;
    }

    try {
        switch (req.method) {
            case 'GET': {
                console.log('Tags get');
                return res.json(await getTags(user.id));
            }
            case 'PUT': {
                console.log(req.body.value);
                const tagValue = String(req.body.value);
                console.log(`Tags put value=${tagValue}`);
                return res.json(await addTag(user.id, tagValue));
            }
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}

export async function getTags(userId: number) {
    return prisma.tag.findMany({
        where: {
            ownerId: userId
        },
        select: {
            id: true,
            value: true
        }
    });
}

async function addTag(userId: number, value: string) {
    return prisma.tag.create({
        data: {
            value: value,
            ownerId: userId
        },
        select: {
            id: true,
            value: true
        }
    });
}