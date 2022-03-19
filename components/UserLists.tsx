import React, { useState } from 'react';
import useSWR from 'swr';
import { LoadingOverlay, Modal } from '@mantine/core';
import { ErrorAlert } from './ErrorAlert';
import ListList from './ListList';
import { List } from '@prisma/client';
import { ListEditForm } from './ListEditForm';
import { NewListForm } from './NewListForm';

export const UserLists = () => {
    const { data, error } = useSWR<{ lists: List[] }>('/api/data/lists');
    const [currentList, setCurrentList] = useState<List>();
    const [isEditDialogShown, setIsEditDialogShown] = useState(false);
    const [isNewDialogShown, setIsNewDialogShown] = useState(false);

    const handleEdit = (list: List) => {
        setCurrentList(list);
        setIsEditDialogShown(true);
    };

    const handleNew = () => setIsNewDialogShown(true);

    if (error) {
        return <ErrorAlert error={error} />;
    }

    if (!data) {
        return <LoadingOverlay visible />;
    }

    return <div>
        <Modal
            opened={isEditDialogShown}
            onClose={() => setIsEditDialogShown(false)}
            title={`Edit list "${currentList?.name}"`}
        >
            {currentList &&
                <ListEditForm list={currentList}
                              onSubmit={() => setIsEditDialogShown(false)}
                              showDelete={data.lists.length > 1}
                />
            }
        </Modal>
        <Modal
            opened={isNewDialogShown}
            onClose={() => setIsNewDialogShown(false)}
            title={`Create a new list`}
        >
            <NewListForm onSubmit={() => setIsNewDialogShown(false)} />
        </Modal>
        <ListList
            title="Your lists"
            lists={data.lists}
            onEdit={handleEdit}
            onAdd={handleNew}
        />
    </div>;
};