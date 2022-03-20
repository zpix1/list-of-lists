import React, { useState } from 'react';
import useSWR from 'swr';
import { LoadingOverlay, Modal, Title } from '@mantine/core';
import { ErrorAlert } from './ErrorAlert';
import ListList from './ListList';
import { List } from '@prisma/client';
import { ListEditForm } from './list-forms/ListEditForm';
import { NewListForm } from './list-forms/NewListForm';
import { useRouter } from 'next/router';
import { ListsWithDetails } from './ListList/ListList';

export const UserLists = () => {
    const router = useRouter();
    const { data, error } = useSWR<ListsWithDetails>('/api/data/lists');

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
                              showDelete={data.length > 1}
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
        <Title>My lists</Title>
        <ListList
            title="Your lists"
            lists={data}
            onEdit={handleEdit}
            onAdd={handleNew}
            onSelect={list => router.push(`/list/${list.id}`)}
        />
    </div>;
};