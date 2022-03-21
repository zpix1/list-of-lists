import React from 'react';

import { Prisma } from '@prisma/client';
import { Badge, Box, Card, Grid, Group, Text } from '@mantine/core';
import { Plus, Settings } from 'tabler-icons-react';
import { User } from '../../pages/api/auth/user';
import useUser from '../../lib/useUser';
import { getAllLists } from '../../pages/api/data/lists';

export type ListsWithDetails = Prisma.PromiseReturnType<typeof getAllLists>;

interface ListListProps {
    title: string;
    lists: ListsWithDetails;
    onSelect: (list: ListsWithDetails[0]) => void;
    onEdit: (list: ListsWithDetails[0]) => void;
    onAdd: () => void;
}

const TasksBadge = ({ amountOfTasks }: { amountOfTasks: number }) => {
    const color = (() => {
        if (amountOfTasks === 0) {
            return 'gray';
        }
        if (amountOfTasks < 5) {
            return 'cyan';
        }
        return 'grape';
    })();

    return (
        <Badge color={color}>
            {amountOfTasks} task{amountOfTasks !== 1 && 's'}
        </Badge>
    );
};

const ListListItem = ({ list, user, onEdit, onSelect }: {
    list: ListsWithDetails[0],
    user?: User,
    onSelect: ListListProps['onSelect'],
    onEdit: ListListProps['onEdit']
}) => {
    return (
        <Card shadow="md">
            <Group position="apart">
                <Text size="xl"
                      weight="bold"
                      sx={{ cursor: 'pointer', ':hover': { textDecoration: 'underline' } }}
                      onClick={() => onSelect(list)}
                >
                    {list.name}
                </Text>
                {list.ownerId === user?.id && <Box sx={{ cursor: 'pointer' }}
                                                   onClick={() => onEdit(list)}>
                    <Settings />
                </Box>}
            </Group>
            <Group mt="sm">
                {list.ownerId === user?.id && <>
                    <Badge>Yours</Badge>
                    {list.accessUsers.length > 0 && <Badge color="indigo">
                        Shared to {list.accessUsers.length} user{list.accessUsers.length !== 1 && 's'}
                    </Badge>}
                </>}
                {list.ownerId !== user?.id &&
                    <Badge color="red">Shared to you by {list.owner.firstName} {list.owner.lastName}</Badge>}
                {<TasksBadge amountOfTasks={list._count.tasks} />}
            </Group>
        </Card>
    );
};

export const ListList = ({ lists, onSelect, onEdit, onAdd }: ListListProps) => {
    const { user } = useUser();

    return <>
        <Grid gutter="xs" mt="md">
            {lists.map(list =>
                <Grid.Col md={4} xs={6} key={`${list.id}`}>
                    <ListListItem
                        onEdit={onEdit}
                        onSelect={onSelect}
                        list={list}
                        user={user}
                    />
                </Grid.Col>
            )}

            {onAdd && <Grid.Col md={4} xs={6}>
                <Card shadow="md" onClick={() => onAdd()} sx={{ cursor: 'pointer' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Plus />
                    </Box>
                </Card>
            </Grid.Col>}
        </Grid>
    </>;
};