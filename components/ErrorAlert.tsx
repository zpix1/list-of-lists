import { Alert } from '@mantine/core';
import { Cross1Icon } from '@modulz/radix-icons';

export const ErrorAlert = ({ error }: { error: Error }) => {
    return <Alert icon={<Cross1Icon />} title={error.name} color="red">
        {error.message}
    </Alert>;
};