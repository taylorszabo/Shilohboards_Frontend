import * as React from 'react';
import { Image, TouchableOpacity } from 'react-native';

export default function SoundIcon(props: { widthPercent: number; onPress?: () => void }) {
    const { widthPercent, onPress } = props;

    return (
        <TouchableOpacity onPress={onPress} style={{width: `${widthPercent}%`, aspectRatio: 1}}>
                <Image source={require('../assets/listen.png')} style={{resizeMode: 'contain', maxHeight: '100%', maxWidth: '100%'}} />
        </TouchableOpacity>
    );
}