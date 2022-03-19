import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../../../lib/session';
import { PrismaClient, Task } from '@prisma/client';

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
                const body = req.body;
                console.log(`List edit: taskId=${body}`);

                return res.json(await updateTask(user.id, taskId, body));
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

export async function updateTask(userId: number, taskId: number, body: Partial<Task>) {
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

    return await prisma.task.update({
        where: {
            id: taskId
        },
        data: {
            isDone: Boolean(body.isDone),
            shortDesc: String(body.shortDesc),
            dueTo: body.dueTo
        }
    })
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