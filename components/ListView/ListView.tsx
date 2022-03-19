import React from 'react';
import useSWR from 'swr';
import { Prisma } from '@prisma/client';
import { Container, Grid, Skeleton, Title } from '@mantine/core';
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

    if (error) {
        return <ErrorAlert error={error} />;
    }

    return (
        <>
            <Title mb={20}>
                <Skeleton visible={!data} width={'10ch'}>
                    {data?.name ?? 'Nothing'}
                </Skeleton>
            </Title>
            {data && <TaskAddForm listId={data.id} />}
            <Container size="md">
                {data ?
                    <Grid mt={20}>
                        {data.tasks.sort((a, b) => Number(a.isDone) - Number(b.isDone)).map(task => <TaskItem
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