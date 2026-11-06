import { StyleSheet, Text, View } from 'react-native';
import { useExpenses } from '../context/ExpenseContext';

export function SyncNotice() {
  const { notice } = useExpenses();
  if (!notice) return null;

  return (
    <View accessibilityRole="alert" style={styles.notice}>
      <Text style={styles.text}>{notice}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  notice: {
    backgroundColor: '#FFF3D6',
    borderColor: '#F2D99A',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  text: { color: '#765A18', fontSize: 12, lineHeight: 18 },
});
