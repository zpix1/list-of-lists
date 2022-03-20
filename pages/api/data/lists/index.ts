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
                const t = await getAllLists(user.id);
                return res.json(t);
            }
            case 'PUT': {
                const listName = String(req.body.name).trim();
                console.log(`List create listName=${listName}`);
                return res.json(await addList(user.id, listName));
            }
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}

export async function getAllLists(userId: number) {
    return await prisma.list.findMany({
        where: {
            accessUsers: {
                some: {
                    id: userId
                }
            }
        },
        include: {
            _count: {
                select: {
                    tasks: true
                }
            },
            owner: {
                select: {
                    firstName: true,
                    lastName: true
                }
            },
            accessUsers: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true
                },
                where: {
                    NOT: {
                        id: userId
                    }
                }
            }
        }
    });
}


async function addList(userId: number, listName: string) {
    if (listName.length < 3) {
        throw new Error('name length should be at least 2');
    }

    const response = await prisma.list.create({
        data: {
            ownerId: userId,
            name: listName,
            accessUsers: {
                connect: [{ id: userId }]
            }
        }
    });

    if (!response) {
        throw new Error('failed to create a list');
    }

    return {
        id: response.id,
        name: response.name
    };
}
