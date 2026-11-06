import { StyleSheet, Text, View } from 'react-native';
import {
  CATEGORY_META,
  formatMoney,
  formatShortDate,
  type Expense,
} from '../domain/expense';

export function ExpenseRow({ expense }: { expense: Expense }) {
  const meta = CATEGORY_META[expense.category];

  return (
    <View style={styles.row}>
      <View style={[styles.icon, { backgroundColor: meta.tint }]}>
        <Text style={styles.emoji}>{meta.icon}</Text>
      </View>
      <View style={styles.details}>
        <Text numberOfLines={1} style={styles.name}>
          {expense.description}
        </Text>
        <Text style={styles.meta}>
          {expense.category} · {formatShortDate(expense.spentAt)}
        </Text>
      </View>
      <Text style={styles.amount}>−{formatMoney(expense.amount)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 13,
  },
  icon: {
    alignItems: 'center',
    borderRadius: 15,
    height: 48,
    justifyContent: 'center',
    marginRight: 13,
    width: 48,
  },
  emoji: { fontSize: 20 },
  details: { flex: 1, marginRight: 8 },
  name: { color: '#1C2C28', fontSize: 15, fontWeight: '600' },
  meta: { color: '#87908B', fontSize: 12, marginTop: 5 },
  amount: { color: '#26332F', fontSize: 14, fontWeight: '700' },
});
