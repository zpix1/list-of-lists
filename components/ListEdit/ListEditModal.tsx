import React from 'react';
import { List } from '@prisma/client';

interface ListEditModalProps {
    list: List;
    setList: (list: List) => void;
    isOpened: boolean;
}

export const ListEditForm = ({ list, setList, isOpened }: ListEditModalProps) => {
    return <div>List Edit Form</div>;
};