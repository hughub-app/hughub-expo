import { Angry, Frown, Laugh, Meh, Smile } from "lucide-react-native";
import React from "react";

interface EmojiProps {
    type: 'laugh' | 'smile' | 'meh' | 'frown' | 'angry';
    className?: string;
    size?: number;
}

const emojiComponents = {
    laugh: Laugh,
    smile: Smile,
    meh: Meh,
    frown: Frown,
    angry: Angry,
};

const defaultClasses = {
    laugh: "text-green-400",
    smile: "text-blue-400",
    meh: "text-orange-300",
    frown: "text-orange-600",
    angry: "text-red-600",
};

export default function Emoji({ type, className, size = 32 }: EmojiProps) {
    const EmojiComponent = emojiComponents[type];
    const combinedClassName = `${defaultClasses[type]} ${className || ''}`.trim();

    return <EmojiComponent className={combinedClassName} size={size} />;
}