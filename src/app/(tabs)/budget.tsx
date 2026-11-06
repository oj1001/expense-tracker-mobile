import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SyncNotice } from '../../components/SyncNotice';
import { useExpenses } from '../../context/ExpenseContext';
import {
  CATEGORIES,
  CATEGORY_META,
  formatMoney,
  getCurrentMonthExpenses,
} from '../../domain/expense';

const MONTHLY_BUDGET = 25000;
const CATEGORY_BUDGETS: Record<(typeof CATEGORIES)[number], number> = {
  Food: 9000,
  Transport: 3500,
  Shopping: 5000,
  Bills: 4000,
  Health: 2000,
  Other: 1500,
};

export default function BudgetScreen() {
  const { expenses } = useExpenses();
  const monthExpenses = getCurrentMonthExpenses(expenses);
  const spent = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = Math.max(MONTHLY_BUDGET - spent, 0);

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      style={styles.screen}
    >
      <ScreenHeader
        eyebrow="GIVE YOUR GOALS SOME ROOM"
        subtitle="A gentle guide, never a hard rule."
        title="Your budget"
      />
      <SyncNotice />
      <View style={styles.card}>
        <Text style={styles.cardLabel}>MONTHLY SPENDING PLAN</Text>
        <Text style={styles.amount}>{formatMoney(MONTHLY_BUDGET)}</Text>
        <Text style={styles.remaining}>{formatMoney(remaining)} left to spend</Text>
        <View style={styles.track}>
          <View
            style={[
              styles.progress,
              { width: `${Math.min((spent / MONTHLY_BUDGET) * 100, 100)}%` },
            ]}
          />
        </View>
        <Text style={styles.spent}>{formatMoney(spent)} spent so far</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Category plans</Text>
        <Text style={styles.sectionCaption}>THIS MONTH</Text>
      </View>
      <View style={styles.list}>
        {CATEGORIES.map((category) => {
          const meta = CATEGORY_META[category];
          const categorySpent = monthExpenses
            .filter((expense) => expense.category === category)
            .reduce((sum, expense) => sum + expense.amount, 0);
          const categoryBudget = CATEGORY_BUDGETS[category];
          const overBudget = categorySpent > categoryBudget;
          return (
            <View key={category} style={styles.row}>
              <View style={[styles.icon, { backgroundColor: meta.tint }]}>
                <Text style={styles.emoji}>{meta.icon}</Text>
              </View>
              <View style={styles.info}>
                <View style={styles.rowTop}>
                  <Text style={styles.name}>{category}</Text>
                  <Text style={[styles.value, overBudget && styles.overBudget]}>
                    {formatMoney(categorySpent)}
                    <Text style={styles.cap}> / {formatMoney(categoryBudget)}</Text>
                  </Text>
                </View>
                <View style={styles.track}>
                  <View
                    style={[
                      styles.categoryProgress,
                      {
                        backgroundColor: overBudget ? '#D58A71' : meta.color,
                        width: `${Math.min((categorySpent / categoryBudget) * 100, 100)}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          );
        })}
      </View>
      <Text style={styles.note}>
        Budgets are here to help you notice, not to make you feel bad.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#F7F7F2', flex: 1 },
  content: { paddingHorizontal: 22, paddingBottom: 32, paddingTop: 58 },
  card: { backgroundColor: '#1E4438', borderRadius: 22, marginBottom: 27, padding: 21 },
  cardLabel: { color: '#C1D0C5', fontSize: 10, fontWeight: '700', letterSpacing: 1.2 },
  amount: { color: '#FFFFFF', fontSize: 32, fontWeight: '700', marginTop: 9 },
  remaining: { color: '#D4E58B', fontSize: 12, fontWeight: '600', marginTop: 5 },
  track: { backgroundColor: '#EFF1EC', borderRadius: 4, height: 5, marginTop: 12, overflow: 'hidden' },
  progress: { backgroundColor: '#C4D96E', borderRadius: 4, height: '100%' },
  spent: { color: '#C1D0C5', fontSize: 11, marginTop: 10 },
  sectionHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 13 },
  sectionTitle: { color: '#26362F', fontSize: 17, fontWeight: '700' },
  sectionCaption: { color: '#8C9690', fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  list: { backgroundColor: '#FFFFFF', borderColor: '#ECEEE9', borderRadius: 19, borderWidth: 1, paddingHorizontal: 14 },
  row: { alignItems: 'center', flexDirection: 'row', paddingVertical: 13 },
  icon: { alignItems: 'center', borderRadius: 13, height: 42, justifyContent: 'center', marginRight: 12, width: 42 },
  emoji: { fontSize: 17 },
  info: { flex: 1 },
  rowTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  name: { color: '#46524C', fontSize: 12, fontWeight: '600' },
  value: { color: '#26362F', fontSize: 11, fontWeight: '700' },
  overBudget: { color: '#B65F48' },
  cap: { color: '#9AA29C', fontWeight: '400' },
  categoryProgress: { borderRadius: 4, height: '100%' },
  note: { color: '#8C9690', fontSize: 11, lineHeight: 17, marginTop: 16, textAlign: 'center' },
});
