import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../../lib/session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default withIronSessionApiRoute(userCheckRoute, sessionOptions);

async function userCheckRoute(req: NextApiRequest, res: NextApiResponse) {
    const user = req.session.user;

    if (!user || !user.isLoggedIn) {
        res.status(401).end();
        return;
    }

    try {
        switch (req.method) {
            case 'GET': {
                const email = req.query.email;
                console.log(`User check email=${email}`);
                if (!email || email instanceof Array) {
                    throw new Error('no email found in query');
                }
                const user = await prisma.user.findUnique({
                    where: {
                        email
                    },
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                });
                if (!user) {
                    throw new Error('user not found');
                }

                return res.json(user);
            }
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}