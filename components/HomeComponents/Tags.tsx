import React from 'react';
import { Badge, Text } from 'native-base';

interface TagsProps {
    title: string;
}

export default function Tags({ title }: TagsProps) { 
    return (
        <Badge m = {2} ml={0} colorScheme={"muted"} shadow={1} borderRadius={4}>
            {title}
        </Badge>
    );
}
