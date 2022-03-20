import React, { useMemo } from 'react';
import useSWR from 'swr';
import { Prisma } from '@prisma/client';
import { Container, Grid, Skeleton, Text, Title } from '@mantine/core';
import { ErrorAlert } from '../ErrorAlert';
import { getList } from '../../pages/api/data/lists/[id]';
import 'react-datetime/css/react-datetime.css';
import { TaskItem } from './TaskItem';
import { TaskAddForm } from './TaskAddForm';

interface ListViewProps {
    id: number;
}

type ListWithTasks = Prisma.PromiseReturnType<typeof getList>;

export const ListView = ({ id }: ListViewProps) => {
    const { data, error } = useSWR<ListWithTasks>(`/api/data/lists/${id}`);

    const doneTasks = useMemo(() => data?.tasks.filter(t => t.isDone), [data]);
    const undoneTasks = useMemo(() => data?.tasks.filter(t => !t.isDone), [data]);

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
                {data ?
                    <Grid mt={20}>
                        <Grid.Col>
                            <Text size="xl">
                                {undoneTasks?.length} task{doneTasks?.length !== 1 && 's'} not done yet
                            </Text>
                        </Grid.Col>
                        {undoneTasks?.map(task => <TaskItem
                            task={task} key={`${task.id}`} />)}
                        <Grid.Col>
                            <Text size="xl">
                                {doneTasks?.length} task{doneTasks?.length !== 1 && 's'} already done
                            </Text>
                        </Grid.Col>
                        {doneTasks?.map(task => <TaskItem
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