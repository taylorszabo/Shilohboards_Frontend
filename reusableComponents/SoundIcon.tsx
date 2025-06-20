import * as React from 'react';
import { Image, TouchableOpacity } from 'react-native';

export default function SoundIcon(props: { widthPercent: number; onPress?: () => void }) {
    const { widthPercent, onPress } = props;

    return (
        <TouchableOpacity 
            onPress={onPress} 
            style={{
                width: `${widthPercent}%`, 
                aspectRatio: 1, 
                backgroundColor: '#FFF8F0', 
                padding: 12, 
                borderRadius: 10,
                borderRightWidth: 1,
                borderBottomWidth: 1,
                borderRightColor: '#A9A9A9',
                borderBottomColor: '#A9A9A9'
            }}
        >
            <Image source={require('../assets/Icons/listenEar.png')} style={{resizeMode: 'contain', maxHeight: '100%', maxWidth: '100%'}} />
        </TouchableOpacity>
    );
}