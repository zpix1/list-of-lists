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
                const tagValue = String(req.body.value);
                const color = String(req.body.color);
                console.log(`Tags put value=${tagValue}`);
                return res.json(await addTag(user.id, tagValue, color));
            }
            case 'DELETE': {
                const tagId = Number(req.body.id);
                console.log(`Tags delete id=${tagId}`);
                return res.json(await deleteTag(user.id, tagId));
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
            value: true,
            color: true
        }
    });
}

async function addTag(userId: number, value: string, color: string) {
    return prisma.tag.create({
        data: {
            value: value,
            ownerId: userId,
            color: color
        },
        select: {
            id: true,
            value: true
        }
    });
}

async function deleteTag(userId: number, tagId: number) {
    const result = await prisma.tag.deleteMany({
        where: {
            ownerId: userId,
            id: tagId
        }
    });

    if (result.count !== 1) {
        throw new Error('tag was not deleted');
    }

    return {
        tagId
    };
}