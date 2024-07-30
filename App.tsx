import { useState } from 'react';

import { registerRootComponent } from 'expo';
import { Button, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';


export const App = () => {
    const [secureValue, setSecureValue] = useState<string | null>(null);

    const loadSecureValue = async () => {
        setSecureValue(await SecureStore.getItemAsync(
            'someKey',
            {
                authenticationPrompt: 'Load it?',
                // BUG: This is not being honored, with or without the
                //      "authenticationPrompt" being set.
                //      But if no key is present, then the user is not
                //      prompted.
                requireAuthentication: false,
            }
        ));
    };

    const onSaveButtonPress = async () => {
        await SecureStore.setItemAsync(
            'someKey',
            'some value',
            {
                authenticationPrompt: 'Save it?',
                requireAuthentication: true,
            }
        );

        await loadSecureValue();
    };

    const onClearButtonPress = async () => {
        await SecureStore.deleteItemAsync(
            'someKey',
            {
                authenticationPrompt: 'Delete it?',
                // BUG: This is not being honored as the user is not being
                //      prompted to provide their biometric data but the key
                //      is still being deleted.
                requireAuthentication: true,
            }
        );

        await loadSecureValue();
    };

    return (
        <>
            <StatusBar
                translucent={false}
            />

            <View>
                <Text>
                    {'Secure Value: "' + secureValue + '"'}
                </Text>

                <Button
                    title="Save Secure Value"
                    onPress={onSaveButtonPress}
                />

                <Button
                    title="Clear Secure Value"
                    onPress={onClearButtonPress}
                />
            </View>
        </>
    );
};

registerRootComponent(App);

export default App;
