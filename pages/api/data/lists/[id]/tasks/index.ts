import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../../../../lib/session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default withIronSessionApiRoute(tasksRoute, sessionOptions);

async function tasksRoute(req: NextApiRequest, res: NextApiResponse) {
    const user = req.session.user;

    if (!user || !user.isLoggedIn) {
        res.status(401).end();
        return;
    }

    try {
        switch (req.method) {
            case 'GET': {
                console.log('Tasks get');
                return res.json({});
            }
            case 'PUT': {
                const listId = Number(req.query.id);
                const taskShortDesc = String(req.body.shortDesc).trim();
                console.log(`Create task listId=${listId} shortDesc=${taskShortDesc}`);
                return res.json(await addTask(user.id, listId, taskShortDesc));
            }
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}

async function addTask(userId: number, listId: number, taskShortDesc: string) {
    if (taskShortDesc.length >= 100) {
        throw new Error('shortDesc is too long');
    }

    const list = await prisma.list.findFirst({
        where: {
            id: listId,
            accessUsers: {
                some: {
                    id: userId
                }
            }
        }
    });

    if (!list) {
        throw new Error('list does not exist or user has no access to it');
    }

    return await prisma.task.create({
        data: {
            shortDesc: taskShortDesc,
            listId: listId
        }
    });
}