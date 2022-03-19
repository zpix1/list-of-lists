import { Task } from '@prisma/client';
import { Grid, Modal, ThemeIcon } from '@mantine/core';
import { CheckCircledIcon, CircleIcon, GearIcon } from '@modulz/radix-icons';
import React, { useState } from 'react';
import { Loader } from '../utility/Loader';
import fetchJson from '../../lib/fetchJson';
import { useSWRConfig } from 'swr';
import { TaskItemEditForm } from './TaskItemEditForm';

const Icon = ({ loading, isDone }: {
    loading?: boolean,
    isDone: boolean
}) => {
    return isDone ?
        <ThemeIcon style={{ transition: '' }} color={loading ? 'gray' : 'green'} size={24} radius="xl">
            <CheckCircledIcon />
        </ThemeIcon>
        :
        <ThemeIcon color={loading ? 'gray' : 'blue'} size={24} radius="xl">
            <CircleIcon />
        </ThemeIcon>;
};

export const TaskItem = ({ task }: { task: Task }) => {
    const { mutate } = useSWRConfig();

    const [isEditDialogShown, setIsEditDialogShown] = useState(false);

    const handleToggleCheck = async () => {
        await fetchJson(`/api/data/tasks/${task.id}/toggle`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        await mutate(`/api/data/lists/${task.listId}`);
    };

    const handleEdit = () => {
        setIsEditDialogShown(true);
    };

    return (
        <>
            <Modal
                opened={isEditDialogShown}
                onClose={() => setIsEditDialogShown(false)}
                title={`Edit task`}
            >
                {task &&
                    <TaskItemEditForm
                        task={task}
                        onSubmit={() => setIsEditDialogShown(false)}
                    />
                }
            </Modal>
            <Loader action={handleToggleCheck}>
                {(apply, loading) =>
                    <>
                        <Grid.Col span={1} style={{ textAlign: 'center' }}>
                        <span
                            style={{ cursor: 'pointer' }}
                            onClick={handleToggleCheck}
                        >
                            <Icon loading={loading} isDone={task.isDone} />
                        </span>
                        </Grid.Col>
                        <Grid.Col span={10} style={{ display: 'flex', alignItems: 'center' }}>
                            {task.shortDesc}
                        </Grid.Col>
                        <Grid.Col span={1} style={{ textAlign: 'center' }}>
                        <span
                            style={{ cursor: 'pointer' }}
                            onClick={handleEdit}
                        >
                            <ThemeIcon color={'red'} size={24} radius="xl">
                                <GearIcon />
                            </ThemeIcon>
                        </span>
                        </Grid.Col>
                    </>
                }
            </Loader>

        </>
    );
};