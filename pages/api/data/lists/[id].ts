import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../../lib/session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default withIronSessionApiRoute(listsRoute, sessionOptions);

async function listsRoute(req: NextApiRequest, res: NextApiResponse) {
    const user = req.session.user;

    if (!user || !user.isLoggedIn) {
        res.status(401).end();
        return;
    }

    try {
        switch (req.method) {
            case 'GET': {
                const listId = Number(req.query.id);
                return res.json(await getList(user.id, listId));
            }
            case 'POST': {
                const listId = Number(req.query.id);
                const listName = String(req.body.name).trim();
                console.log(`List edit: listName=${listName}, listId=${listId}`);
                return res.json(await updateList(user.id, listId, listName));
            }
            case 'DELETE': {
                const listId = Number(req.query.id);
                return res.json(await deleteList(user.id, listId));
            }
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}

async function getList(userId: number, listId: number) {
    const response = await prisma.list.findFirst({
        where: {
            id: listId,
            accessUsers: {
                some: {
                    id: userId
                }
            }
        }
    });

    if (!response) {
        throw new Error('list does not exist or user has no access to it');
    }

    return response;
}

async function updateList(userId: number, listId: number, listName: string) {
    if (listName.length < 3) {
        throw new Error('name length should be at least 2');
    }

    const response = await prisma.list.updateMany({
        data: {
            name: listName
        },
        where: {
            id: listId,
            ownerId: userId
        }
    });

    if (response.count !== 1) {
        throw new Error('list does not exist or user has no access to it');
    }

    return {
        id: listId,
        name: listName
    };
}

async function deleteList(userId: number, listId: number) {
    const amount = await prisma.list.count({
        where: {
            ownerId: userId
        }
    });

    if (amount == 1) {
        throw new Error('user list can\'t be deleted if it the last one');
    }

    const response = await prisma.list.deleteMany({
        where: {
            id: listId,
            ownerId: userId
        }
    });

    if (response.count !== 1) {
        throw new Error('list does not exist or user has no access to it');
    }

    return {
        id: listId
    };
}