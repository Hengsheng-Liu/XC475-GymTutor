import React from 'react';
import { Badge } from 'native-base';

interface TagsProps {
    title: string;
}

export default function Tags({ title }: TagsProps) { // Destructure the props directly
    return (
        <Badge mt = {2} colorScheme={"blue"}>
            {title}
        </Badge>
    );
}
