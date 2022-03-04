import React, { useState } from 'react';
import { List } from '@prisma/client';
import { TextInput } from '@mantine/core';

interface ListEditFormProps {
    list: List;
    setList: (list: List) => void;
}

export const ListEditForm = ({ list, setList }: ListEditFormProps) => {
    return <div>
        <TextInput label="List name"
                   value={list.name} />
    </div>;
};