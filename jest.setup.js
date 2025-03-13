//console.log('✅ Jest setup file is running...');

process.env.EXPO_OS = 'android';

jest.spyOn(console, 'warn').mockImplementation((message) => {
    if (!message.includes('process.env.EXPO_OS')) {
      console.warn(message);
    }
  });

//console.log('✅ EXPO_OS set to:', process.env.EXPO_OS);