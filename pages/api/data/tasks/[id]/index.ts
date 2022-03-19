import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../../../lib/session';
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
            case 'POST': {
                const taskId = Number(req.query.id);
                console.log(`List edit: taskId=${taskId}`);
                // await updateTask(user.id, taskId, String(req.body.shortDesc))
                return res.json({});
            }
            case 'DELETE': {
                const taskId = Number(req.query.id);
                console.log(`Delete task: taskId=${taskId}`);
                return res.json(await deleteTask(user.id, taskId));
            }
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}

export async function deleteTask(userId: number, taskId: number) {
    const task = await prisma.task.findUnique({
        where: {
            id: taskId
        },
        include: {
            list: {
                include: {
                    accessUsers: { select: { id: true } }
                }
            }
        }
    });

    if (!task || !task.list.accessUsers.some(x => x.id === userId)) {
        throw new Error('task not found');
    }

    return await prisma.task.delete({
        where: {
            id: taskId
        }
    });
}