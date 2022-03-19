import React from 'react';
import classNames from 'classnames';

import { List } from '@prisma/client';

interface ListListProps {
    title: string;
    lists: List[];
    onSelect: (list: List) => void;
    onEdit?: (list: List) => void;
    onAdd?: () => void;
}

export const ListList = ({ title, lists, onSelect, onEdit, onAdd }: ListListProps) => {
    return <>
        <div className="container">
            {lists.map((list, i) =>
                <div
                    key={list.id.toString()}
                    className={classNames('item', {
                        'head': i == 0
                    })}>
                    <span className="item-section first-section" onClick={() => onSelect(list)}>
                        {list.name}
                    </span>
                    {onEdit && <span className="item-section option-section" onClick={() => onEdit(list)}>
                        edit
                    </span>}
                </div>)}
            {onAdd && <div className="item end">
                <span className="item-section first-section" onClick={() => onAdd()}>
                    Add a list
                </span>
            </div>}
        </div>
        <style jsx>{`
          .title {
            margin-bottom: 5px;
          }

          .container {
            margin-top: 10px;
            width: 100%;
          }

          .title {
            font-size: 20px;
          }

          .item {
            width: clamp(100px, 50%, 400px);
            border: 1px solid black;
            margin: 0 auto;
            cursor: pointer;

            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .item.head {
            border-radius: 5px 5px 0 0;
          }

          .item.end {
            border-radius: 0 0 5px 5px;
          }

          .item.head.end {
            border-radius: 5px;
          }

          .item:not(.head) {
            border-top: none;
          }

          .first-section {
            flex-grow: 1;
          }

          .item-section {
            padding: 5px;
          }

          .item-section:hover {
            background-color: rgba(217, 217, 217, 0.5);
          }

          .item-section.option-section {
            border-left: 1px solid black;
          }
        `}</style>
    </>;
};