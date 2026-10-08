import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, EmptyState } from '../../components/ui';
import { colors, spacing, typography } from '../../theme/tokens';
import type { BankInstitution } from './banking-api';

type Props = Readonly<{
  institutions: readonly BankInstitution[];
  disabled: boolean;
  onConnect: (institution: BankInstitution) => void;
}>;

export function BankInstitutionList({ institutions, disabled, onConnect }: Props) {
  if (institutions.length === 0)
    return <EmptyState title="Nenhuma instituição disponível agora." />;

  return (
    <View style={styles.list}>
      {institutions.map((institution) => (
        <Pressable
          accessibilityLabel={`Conectar ${institution.name}`}
          disabled={disabled || institution.status === 'OFFLINE'}
          key={institution.id}
          onPress={() => onConnect(institution)}
        >
          <Card style={styles.card}>
            <Image source={{ uri: institution.imageUrl }} style={styles.logo} />
            <View style={styles.copy}>
              <Text style={styles.name}>{institution.name}</Text>
              <Text style={styles.detail}>
                {institution.isSandbox
                  ? 'Sandbox'
                  : institution.status === 'ONLINE'
                    ? 'Disponível'
                    : 'Indisponível'}
              </Text>
            </View>
            <Text style={styles.action}>Conectar</Text>
          </Card>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm },
  card: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  logo: { backgroundColor: colors.muted, borderRadius: 20, height: 40, width: 40 },
  copy: { flex: 1, gap: spacing.xs },
  name: { ...typography.bodySemiBold, color: colors.foreground },
  detail: { ...typography.caption, color: colors.mutedForeground },
  action: { ...typography.caption, color: colors.primary },
});
