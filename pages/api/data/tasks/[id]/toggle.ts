import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../../../lib/session';
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
            case 'POST': {
                const taskId = Number(req.query.id);
                return res.json(await toggleTask(user.id, taskId));
            }
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}

async function toggleTask(userId: number, taskId: number) {
    const task = await prisma.task.findUnique({
        where: {
            id: taskId
        }
    });

    if (!task) {
        throw new Error('task not found');
    }

    const list = await prisma.list.findFirst({
        where: {
            id: task.listId,
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

    return await prisma.task.update({
        where: {
            id: taskId
        },
        data: {
            isDone: !task.isDone
        }
    });
}