import React from 'react';
import { List } from '@prisma/client';

interface ListEditFormProps {
    list: List;
    setList: (list: List) => void;
}

export const ListEditForm = ({ list, setList }: ListEditFormProps) => {
    return <div>List Edit Form</div>;
};