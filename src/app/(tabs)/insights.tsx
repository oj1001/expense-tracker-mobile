import { useMemo } from 'react';
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

export default function InsightsScreen() {
  const { expenses } = useExpenses();
  const monthExpenses = useMemo(() => getCurrentMonthExpenses(expenses), [expenses]);
  const totals = useMemo(
    () =>
      CATEGORIES.map((category) => ({
        category,
        total: monthExpenses
          .filter((expense) => expense.category === category)
          .reduce((sum, expense) => sum + expense.amount, 0),
      })),
    [monthExpenses],
  );
  const grandTotal = totals.reduce((sum, item) => sum + item.total, 0);
  const largestCategory = [...totals].sort((a, b) => b.total - a.total)[0];
  const highestAmount = Math.max(...totals.map((item) => item.total), 1);

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      style={styles.screen}
    >
      <ScreenHeader
        eyebrow="PATTERNS, NOT PRESSURE"
        subtitle="A clearer picture of your month."
        title="Your insights"
      />
      <SyncNotice />
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>TOTAL TRACKED</Text>
        <Text style={styles.heroTotal}>{formatMoney(grandTotal)}</Text>
        <View style={styles.heroDivider} />
        <Text style={styles.heroNote}>
          Your biggest category is{' '}
          <Text style={styles.heroEmphasis}>{largestCategory?.category ?? '—'}</Text>.
          {'\n'}Awareness is a good first step.
        </Text>
        <Text style={styles.heroSparkle}>✳</Text>
      </View>

      <Text style={styles.sectionTitle}>Where it goes</Text>
      <View style={styles.breakdown}>
        {totals.map(({ category, total }) => {
          const meta = CATEGORY_META[category];
          return (
            <View key={category} style={styles.categoryRow}>
              <View style={[styles.categoryIcon, { backgroundColor: meta.tint }]}>
                <Text style={styles.emoji}>{meta.icon}</Text>
              </View>
              <View style={styles.categoryInfo}>
                <View style={styles.categoryTop}>
                  <Text style={styles.categoryName}>{category}</Text>
                  <Text style={styles.categoryAmount}>{formatMoney(total)}</Text>
                </View>
                <View style={styles.track}>
                  <View
                    style={[
                      styles.fill,
                      {
                        backgroundColor: meta.color,
                        width: `${Math.max((total / highestAmount) * 100, total ? 4 : 0)}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#F7F7F2', flex: 1 },
  content: { paddingHorizontal: 22, paddingBottom: 32, paddingTop: 58 },
  hero: {
    backgroundColor: '#1E4438',
    borderRadius: 22,
    marginBottom: 28,
    overflow: 'hidden',
    padding: 21,
  },
  heroLabel: { color: '#C1D0C5', fontSize: 10, fontWeight: '700', letterSpacing: 1.2 },
  heroTotal: { color: '#FFFFFF', fontSize: 32, fontWeight: '700', marginTop: 8 },
  heroDivider: { backgroundColor: 'rgba(255,255,255,0.18)', height: 1, marginVertical: 17 },
  heroNote: { color: '#D4DFD6', fontSize: 12, lineHeight: 19 },
  heroEmphasis: { color: '#D4E58B', fontWeight: '700' },
  heroSparkle: { color: 'rgba(255,255,255,0.14)', fontSize: 92, position: 'absolute', right: 4, top: 6 },
  sectionTitle: { color: '#26362F', fontSize: 17, fontWeight: '700', marginBottom: 13 },
  breakdown: {
    backgroundColor: '#FFFFFF',
    borderColor: '#ECEEE9',
    borderRadius: 19,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 4,
  },
  categoryRow: { alignItems: 'center', flexDirection: 'row', paddingVertical: 14 },
  categoryIcon: { alignItems: 'center', borderRadius: 13, height: 42, justifyContent: 'center', marginRight: 12, width: 42 },
  emoji: { fontSize: 17 },
  categoryInfo: { flex: 1 },
  categoryTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 9 },
  categoryName: { color: '#46524C', fontSize: 13, fontWeight: '600' },
  categoryAmount: { color: '#26362F', fontSize: 13, fontWeight: '700' },
  track: { backgroundColor: '#F0F1ED', borderRadius: 4, height: 5, overflow: 'hidden' },
  fill: { borderRadius: 4, height: '100%' },
});
