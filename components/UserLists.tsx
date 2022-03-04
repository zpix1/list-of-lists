import React, { useState } from 'react';
import useSWR from 'swr';
import { ListsResponse } from '../pages/api/data/lists';
import { LoadingOverlay, Modal } from '@mantine/core';
import { ErrorAlert } from './ErrorAlert';
import ListList from './ListList';
import { List } from '@prisma/client';
import { ListEditForm } from './ListEditForm';

export const UserLists = () => {
    const { data, error } = useSWR<ListsResponse>('/api/data/lists');
    const [currentList, setCurrentList] = useState<List>();

    const handleEdit = (list: List) => {
        setCurrentList(list);
    }

    if (error) {
        return <ErrorAlert error={error} />;
    }

    if (!data) {
        return <LoadingOverlay visible />;
    }

    return <div>
        <Modal
            opened={Boolean(currentList)}
            onClose={() => setCurrentList(undefined)}
            title={`Edit list "${currentList?.name}"`}
        >
            {currentList && <ListEditForm list={currentList} setList={() => {}} />}
        </Modal>
        <ListList
            title="Your lists"
            lists={data.ownedLists}
            onEdit={handleEdit}
        />
        {data.accessLists.length !== 0 && <ListList
            title="Lists shared with you"
            lists={data.ownedLists}
        />}
    </div>;
};