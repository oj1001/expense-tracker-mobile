import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AddExpenseModal } from '../../components/AddExpenseModal';
import { ExpenseRow } from '../../components/ExpenseRow';
import { SyncNotice } from '../../components/SyncNotice';
import { useExpenses } from '../../context/ExpenseContext';
import {
  currentMonthLabel,
  formatMoney,
  getCurrentMonthExpenses,
} from '../../domain/expense';
import { Link } from 'expo-router';

const MONTHLY_BUDGET = 25000;

export default function HomeScreen() {
  const { expenses, addExpense } = useExpenses();
  const [formVisible, setFormVisible] = useState(false);
  const monthExpenses = useMemo(
    () => getCurrentMonthExpenses(expenses),
    [expenses],
  );
  const monthTotal = monthExpenses.reduce((total, item) => total + item.amount, 0);
  const week = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const total = expenses.reduce((sum, item) => {
        const spentAt = new Date(item.spentAt);
        return spentAt.toDateString() === date.toDateString()
          ? sum + item.amount
          : sum;
      }, 0);
      return {
        label: date.toLocaleDateString('en-IN', { weekday: 'narrow' }),
        total,
        today: index === 6,
      };
    });
  }, [expenses]);
  const maxDay = Math.max(...week.map((day) => day.total), 1);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topline}>
          <View>
            <Text style={styles.greeting}>A little more in control</Text>
            <Text style={styles.brand}>Morrow<Text style={styles.brandDot}>.</Text></Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>M</Text>
          </View>
        </View>

        <SyncNotice />

        <View style={styles.balanceCard}>
          <View style={styles.cardTop}>
            <View>
              <Text style={styles.cardLabel}>SPENT THIS MONTH</Text>
              <Text style={styles.balance}>{formatMoney(monthTotal)}</Text>
            </View>
            <View style={styles.monthPill}>
              <Text style={styles.monthText}>{currentMonthLabel().split(' ')[0]}</Text>
            </View>
          </View>
          <View style={styles.budgetMeta}>
            <Text style={styles.budgetText}>
              {formatMoney(Math.max(MONTHLY_BUDGET - monthTotal, 0))} left
            </Text>
            <Text style={styles.budgetLimit}>
              of {formatMoney(MONTHLY_BUDGET)}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min((monthTotal / MONTHLY_BUDGET) * 100, 100)}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.cardFootnote}>
            {monthTotal > MONTHLY_BUDGET
              ? 'You’re over your monthly plan.'
              : 'You’re doing great. Keep it up.'}
          </Text>
          <View pointerEvents="none" style={styles.cardOrb} />
        </View>

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionTitle}>Your week</Text>
            <Text style={styles.sectionSubtitle}>Small steps add up</Text>
          </View>
          <Link href="/insights" asChild>
            <Pressable accessibilityRole="button">
              <Text style={styles.link}>See insights ↗</Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.chartCard}>
          <View style={styles.chartTop}>
            <Text style={styles.chartCaption}>DAILY SPENDING</Text>
            <Text style={styles.chartTotal}>
              {formatMoney(week.reduce((sum, day) => sum + day.total, 0))}
            </Text>
          </View>
          <View style={styles.chart}>
            {week.map((day, index) => (
              <View key={`${day.label}-${index}`} style={styles.chartColumn}>
                <View style={styles.barSpace}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: Math.max((day.total / maxDay) * 74, day.total ? 8 : 3),
                        backgroundColor: day.today ? '#C3D76C' : '#DCE7DE',
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.dayLabel, day.today && styles.todayLabel]}>
                  {day.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionTitle}>Recent activity</Text>
            <Text style={styles.sectionSubtitle}>Your latest little things</Text>
          </View>
          <Link href="/activity" asChild>
            <Pressable accessibilityRole="button">
              <Text style={styles.link}>See all ↗</Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.recentCard}>
          {expenses.slice(0, 4).map((expense) => (
            <ExpenseRow key={expense.id} expense={expense} />
          ))}
          {expenses.length === 0 ? (
            <Text style={styles.emptyText}>Your first expense starts here.</Text>
          ) : null}
        </View>
      </ScrollView>

      <Pressable
        accessibilityLabel="Add expense"
        accessibilityRole="button"
        onPress={() => setFormVisible(true)}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>＋</Text>
      </Pressable>
      <AddExpenseModal
        onClose={() => setFormVisible(false)}
        onSave={addExpense}
        visible={formVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#F7F7F2', flex: 1 },
  content: { paddingHorizontal: 22, paddingBottom: 30, paddingTop: 58 },
  topline: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  greeting: { color: '#87908B', fontSize: 12, letterSpacing: 0.2 },
  brand: { color: '#1B302A', fontSize: 29, fontWeight: '800', letterSpacing: -1.2, marginTop: 2 },
  brandDot: { color: '#AFC567' },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#E5EDE4',
    borderColor: '#D5E1D4',
    borderRadius: 20,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  avatarText: { color: '#38624A', fontSize: 15, fontWeight: '700' },
  balanceCard: {
    backgroundColor: '#1E4438',
    borderRadius: 24,
    marginBottom: 28,
    overflow: 'hidden',
    padding: 22,
  },
  cardTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: { color: '#C6D4CA', fontSize: 10, fontWeight: '700', letterSpacing: 1.3 },
  balance: { color: '#FFFFFF', fontSize: 35, fontWeight: '700', letterSpacing: -1, marginTop: 9 },
  monthPill: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  monthText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  budgetMeta: { flexDirection: 'row', marginTop: 20 },
  budgetText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  budgetLimit: { color: '#B7C7BB', fontSize: 12, marginLeft: 5 },
  progressTrack: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 5,
    height: 7,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: { backgroundColor: '#C4D96E', borderRadius: 5, height: '100%' },
  cardFootnote: { color: '#B7C7BB', fontSize: 11, marginTop: 11 },
  cardOrb: {
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 75,
    borderWidth: 24,
    height: 150,
    position: 'absolute',
    right: -56,
    top: 26,
    width: 150,
  },
  sectionHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 13,
    marginTop: 3,
  },
  sectionTitle: { color: '#24352F', fontSize: 17, fontWeight: '700' },
  sectionSubtitle: { color: '#8B948E', fontSize: 11, marginTop: 4 },
  link: { color: '#4D765B', fontSize: 11, fontWeight: '700' },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#ECEEE9',
    borderRadius: 19,
    borderWidth: 1,
    marginBottom: 24,
    padding: 17,
  },
  chartTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  chartCaption: { color: '#929A94', fontSize: 9, fontWeight: '700', letterSpacing: 1.1 },
  chartTotal: { color: '#25372F', fontSize: 14, fontWeight: '700' },
  chart: { flexDirection: 'row', height: 108, justifyContent: 'space-between', marginTop: 11 },
  chartColumn: { alignItems: 'center', flex: 1 },
  barSpace: { alignItems: 'center', flex: 1, justifyContent: 'flex-end' },
  bar: { borderRadius: 5, maxWidth: 18, minWidth: 12, width: '54%' },
  dayLabel: { color: '#A2AAA4', fontSize: 10, marginTop: 8 },
  todayLabel: { color: '#4F715B', fontWeight: '700' },
  recentCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#ECEEE9',
    borderRadius: 19,
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 14,
  },
  emptyText: { color: '#89928C', fontSize: 13, paddingVertical: 20, textAlign: 'center' },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#C3D76C',
    borderColor: '#FBFAF7',
    borderRadius: 30,
    borderWidth: 4,
    bottom: 20,
    elevation: 5,
    height: 60,
    justifyContent: 'center',
    position: 'absolute',
    right: 22,
    shadowColor: '#1D4337',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    width: 60,
  },
  addButtonText: { color: '#1E4438', fontSize: 31, fontWeight: '400', lineHeight: 34 },
});
