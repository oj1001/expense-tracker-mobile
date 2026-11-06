import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ExpenseRow } from '../../components/ExpenseRow';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SyncNotice } from '../../components/SyncNotice';
import { useExpenses } from '../../context/ExpenseContext';
import { formatMoney } from '../../domain/expense';

export default function ActivityScreen() {
  const { expenses } = useExpenses();
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      style={styles.screen}
    >
      <ScreenHeader
        eyebrow="YOUR MONEY, IN MOTION"
        subtitle="Every little thing, all in one place."
        title="Activity"
      />
      <SyncNotice />
      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>ALL RECENT SPENDING</Text>
        <Text style={styles.summaryValue}>{formatMoney(total)}</Text>
        <Text style={styles.summaryFoot}>{expenses.length} thoughtful choices</Text>
      </View>
      <Text style={styles.sectionTitle}>Latest</Text>
      <View style={styles.list}>
        {expenses.map((expense) => (
          <ExpenseRow expense={expense} key={expense.id} />
        ))}
        {expenses.length === 0 ? (
          <Text style={styles.empty}>Nothing here just yet.</Text>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#F7F7F2', flex: 1 },
  content: { paddingHorizontal: 22, paddingBottom: 32, paddingTop: 58 },
  summary: {
    backgroundColor: '#E9EFE7',
    borderRadius: 21,
    marginBottom: 27,
    padding: 20,
  },
  summaryLabel: { color: '#77877B', fontSize: 10, fontWeight: '700', letterSpacing: 1.1 },
  summaryValue: { color: '#1E4438', fontSize: 30, fontWeight: '700', marginTop: 9 },
  summaryFoot: { color: '#7F8F82', fontSize: 12, marginTop: 6 },
  sectionTitle: { color: '#26362F', fontSize: 16, fontWeight: '700', marginBottom: 10 },
  list: {
    backgroundColor: '#FFFFFF',
    borderColor: '#ECEEE9',
    borderRadius: 19,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  empty: { color: '#87908B', paddingVertical: 20, textAlign: 'center' },
});
