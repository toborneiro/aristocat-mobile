import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BootstrapScreen } from '../../features/bootstrap/BootstrapScreen';
import { TechnicalFormScreen } from '../../features/technical-form/TechnicalFormScreen';

export type RootStackParamList = { Bootstrap: undefined; TechnicalForm: undefined };

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return <NavigationContainer><Stack.Navigator initialRouteName="Bootstrap"><Stack.Screen name="Bootstrap" component={BootstrapScreen} options={{ title: 'Aristocat' }} /><Stack.Screen name="TechnicalForm" component={TechnicalFormScreen} options={{ title: 'Validação técnica' }} /></Stack.Navigator></NavigationContainer>;
}
