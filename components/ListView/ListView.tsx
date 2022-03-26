import React, { useMemo, useState } from 'react';
import useSWR from 'swr';
import { Prisma, Tag } from '@prisma/client';
import { Badge, Container, Grid, Group, Skeleton, Text, Title } from '@mantine/core';
import { ErrorAlert } from '../ErrorAlert';
import { getList } from '../../pages/api/data/lists/[id]';
import 'react-datetime/css/react-datetime.css';
import { TaskItem } from './TaskItem';
import { TaskAddForm } from './TaskAddForm';
import { Filter } from 'tabler-icons-react';

interface ListViewProps {
    id: number;
}

export type ListWithTasks = Prisma.PromiseReturnType<typeof getList>;

export const ListView = ({ id }: ListViewProps) => {
    const { data, error } = useSWR<ListWithTasks>(`/api/data/lists/${id}`);

    const [filterTag, setFilterTag] = useState<Tag>();
    const filteredTasks = useMemo(() =>
            filterTag ?
                data?.tasks.filter(t => t.tags.some(t => t.id === filterTag?.id))
                :
                data?.tasks,
        [filterTag, data]
    );
    const doneTasks = useMemo(() => filteredTasks?.filter(t => t.isDone), [filteredTasks]);
    const undoneTasks = useMemo(() => filteredTasks?.filter(t => !t.isDone), [filteredTasks]);

    if (error) {
        return <ErrorAlert error={error} />;
    }

    return (
        <>
            <Title mb={20}>
                <Skeleton visible={!data}>
                    {data?.name ?? 'Nothing'}
                </Skeleton>
            </Title>
            {data && <TaskAddForm listId={data.id} />}
            <Container size="md">
                {filterTag && <Text size="xl" mt={20}>
                    <Group align="center">
                        <Filter />
                        <Badge
                            style={{ cursor: 'pointer' }}
                            color={filterTag.color}
                            onClick={() => setFilterTag(undefined)}
                        >
                            {filterTag.value}
                        </Badge>
                    </Group>
                </Text>}
                {data ?
                    <Grid mt={20}>
                        <Grid.Col>
                            <Text size="xl">
                                {undoneTasks?.length} task{doneTasks?.length !== 1 && 's'} not done yet
                            </Text>
                        </Grid.Col>
                        {undoneTasks?.map(task => <TaskItem
                            onTagClick={setFilterTag}
                            task={task} key={`${task.id}`} />)}
                        <Grid.Col>
                            <Text size="xl">
                                {doneTasks?.length} task{doneTasks?.length !== 1 && 's'} already done
                            </Text>
                        </Grid.Col>
                        {doneTasks?.map(task => <TaskItem
                            onTagClick={setFilterTag}
                            task={task} key={`${task.id}`} />)}
                    </Grid>
                    :
                    <>
                        <Skeleton height={'2ch'} mt={20} />
                        <Skeleton height={'2ch'} mt={20} />
                        <Skeleton height={'2ch'} mt={20} />
                    </>
                }
            </Container>
        </>
    );
};