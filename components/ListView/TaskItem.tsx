import { Task } from '@prisma/client';
import { Grid, ThemeIcon } from '@mantine/core';
import { CheckCircledIcon, CircleIcon } from '@modulz/radix-icons';
import React from 'react';

export const TaskItem = ({ task }: { task: Task }) => {
    const icon = task.isDone ?
        <ThemeIcon color="green" size={20} radius="xl">
            <CheckCircledIcon />
        </ThemeIcon>
        :
        <ThemeIcon color="blue" size={20} radius="xl">
            <CircleIcon />
        </ThemeIcon>;

    return (
        <>
            <Grid.Col span={1} style={{ textAlign: 'center' }}>
                {icon}
            </Grid.Col>
            <Grid.Col span={11}>
                {task.shortDesc}
            </Grid.Col>
        </>
    );
};