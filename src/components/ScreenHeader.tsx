import { StyleSheet, Text, View } from 'react-native';

export function ScreenHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 22, marginTop: 8 },
  eyebrow: {
    color: '#7D8982',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.6,
  },
  title: { color: '#1B302A', fontSize: 29, fontWeight: '700', marginTop: 5 },
  subtitle: { color: '#818B85', fontSize: 13, marginTop: 5 },
});
