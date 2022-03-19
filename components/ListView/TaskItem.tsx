import { Task } from '@prisma/client';
import { Checkbox, Grid, Modal, ThemeIcon, Text } from '@mantine/core';
import { Settings, } from 'tabler-icons-react';
import React, { useState } from 'react';
import { Loader } from '../utility/Loader';
import fetchJson from '../../lib/fetchJson';
import { useSWRConfig } from 'swr';
import { TaskItemEditForm } from './TaskItemEditForm';

// const Icon = ({ loading, isDone }: {
//     loading?: boolean,
//     isDone: boolean,
//     onChange: React.ChangeEventHandler
// }) => {
//     return ;
//     // return isDone ?
//     //     <ThemeIcon style={{ transition: '' }} color={loading ? 'gray' : 'green'} size={24} >
//     //         <Checkbox />
//     //     </ThemeIcon>
//     //     :
//     //     <ThemeIcon color={loading ? 'gray' : 'blue'} size={24}>
//     //         <Square />
//     //     </ThemeIcon>;
// };

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
                        <Grid.Col span={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span
                            // style={{ cursor: 'pointer' }}
                            // onClick={handleToggleCheck}
                        >
                            <Checkbox size="md"
                                      color={task.isDone ? 'green' : 'blue'}
                                      checked={task.isDone}
                                      indeterminate={loading}
                                      onChange={() => handleToggleCheck()}
                            />
                        </span>
                        </Grid.Col>
                        <Grid.Col span={10} style={{ display: 'flex', alignItems: 'center' }}>
                            <Text size="md">{task.shortDesc}</Text>
                        </Grid.Col>
                        <Grid.Col span={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span
                            style={{ cursor: 'pointer' }}
                            onClick={handleEdit}
                        >
                            <ThemeIcon color={'red'} size={24} radius="xl">
                                <Settings />
                            </ThemeIcon>
                        </span>
                        </Grid.Col>
                    </>
                }
            </Loader>

        </>
    );
};