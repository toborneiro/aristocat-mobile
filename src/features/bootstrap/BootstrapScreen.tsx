import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ActivityIndicator, Button, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { RootStackParamList } from '../../app/navigation/AppNavigator';
import { useAppStore } from '../../stores/useAppStore';
import type { BootstrapState } from './bootstrap-state';

type Props = NativeStackScreenProps<RootStackParamList, 'Bootstrap'>;

export function BootstrapScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const markBootstrapSeen = useAppStore((state) => state.markBootstrapSeen);
  const [state, setState] = useState<BootstrapState>('ready');

  if (state === 'loading') return <View><ActivityIndicator accessibilityLabel={t('bootstrap.loading')} /><Text>{t('bootstrap.loading')}</Text></View>;
  if (state === 'error') return <View><Text>{t('bootstrap.error')}</Text><Button title={t('bootstrap.retry')} onPress={() => setState('ready')} /></View>;

  return <View><Text>{t('bootstrap.ready')}</Text><Button title={t('bootstrap.continue')} onPress={() => { markBootstrapSeen(); navigation.navigate('TechnicalForm'); }} /></View>;
}
