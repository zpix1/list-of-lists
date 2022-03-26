import { Badge, Checkbox, Grid, Group, Modal, Text } from '@mantine/core';
import { Settings, } from 'tabler-icons-react';
import React, { useState } from 'react';
import { Loader } from '../utility/Loader';
import fetchJson from '../../lib/fetchJson';
import { useSWRConfig } from 'swr';
import { TaskItemEditForm } from './TaskItemEditForm';
import { ListWithTasks } from './ListView';
import { Tag } from '@prisma/client';

interface TaskItemProps {
    task: ListWithTasks['tasks'][0];
    onTagClick: (tag: Tag) => void;
}

export const TaskItem = ({ task, onTagClick }: TaskItemProps) => {
    task.dueTo = task.dueTo && new Date(task.dueTo);

    const { mutate } = useSWRConfig();

    const [isEditDialogShown, setIsEditDialogShown] = useState(false);

    const today = new Date();
    const isRed = !task.isDone && task.dueTo && task.dueTo.getTime() < today.getTime();
    const isYellow = !task.isDone && task.dueTo && !isRed && (task.dueTo.getTime() - today.getTime()) < 60 * 60 * 24 * 1000;

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
                        <Grid.Col span={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Checkbox size="md"
                                      color={task.isDone ? 'green' : 'blue'}
                                      checked={task.isDone}
                                      indeterminate={loading}
                                      onChange={() => handleToggleCheck()}
                            />
                        </Grid.Col>
                        <Grid.Col span={10} style={{ display: 'flex', alignItems: 'center' }}>
                            <Group position="apart">
                                <Text size="md">{task.shortDesc}</Text>
                                {isRed && <Badge color="red">Overdue</Badge>}
                                {isYellow && <Badge color="yellow">Due tomorrow</Badge>}
                                {task.tags.map(tag =>
                                    <Badge key={`${tag.id}`}
                                           color={tag.color}
                                           onClick={() => onTagClick(tag)}
                                           style={{cursor: 'pointer'}}
                                    >
                                        {tag.value}
                                    </Badge>
                                )}
                            </Group>
                        </Grid.Col>
                        <Grid.Col span={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span
                            style={{ cursor: 'pointer' }}
                            onClick={handleEdit}
                        >
                            <Settings />
                        </span>
                        </Grid.Col>
                    </>
                }
            </Loader>

        </>
    );
};