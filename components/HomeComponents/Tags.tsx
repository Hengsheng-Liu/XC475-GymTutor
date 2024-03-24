import React from 'react';
import { Badge } from 'native-base';

interface TagsProps {
    title: string;
}

export default function Tags({ title }: TagsProps) { 
    return (
        <Badge mt = {1} colorScheme={"blue"}>
            {title}
        </Badge>
    );
}
