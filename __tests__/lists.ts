import { PrismaClient } from '@prisma/client';

import { addList, getAllLists } from '../pages/api/data/lists';
import { deleteList, getList, updateList } from '../pages/api/data/lists/[id]';

const prisma = new PrismaClient();

beforeAll(async () => {
    const tablenames = await prisma.$queryRaw<Array<{ tablename: string }>>`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

    for (const { tablename } of tablenames) {
        if (tablename !== '_prisma_migrations') {
            try {
                await prisma.$executeRawUnsafe(
                    `TRUNCATE TABLE "public"."${tablename}" CASCADE;`
                );
            } catch (error) {
                console.log({ error });
            }
        }
    }

    await prisma.user.create({
        data: {
            firstName: 'test',
            lastName: 'test',
            email: 'test@test.test',
            passwordHash: 'never'
        }
    });

    await addList(1, 'A list');
    await addList(1, 'Another list');
});

it('should get lists', async () => {
    const lists = await getAllLists(1);
    expect(lists).toHaveLength(2);
    expect(lists.some(l => l.name == 'A list')).toBeTruthy();
    expect(lists.some(l => l.name == 'Another list')).toBeTruthy();


    await expect(getList(123, 1))
        .rejects
        .toThrow();

    const list = await getList(1, 1);
    expect(list.name).toEqual('A list');
});

it('should delete list', async () => {
    const someRandomList = await addList(1, 'To be removed');
    await deleteList(1, someRandomList.id);
    await expect(getList(1, someRandomList.id))
        .rejects
        .toThrow();
});

it('should update list', async () => {
    const someRandomList = await addList(1, 'To be updated');
    await updateList(1, someRandomList.id, 'New Name', []);
    const list = await getList(1, someRandomList.id);
    await expect(list.name).toBe('New Name');
});