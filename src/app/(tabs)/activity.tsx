import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { ExpenseRow } from '../../components/ExpenseRow';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SyncNotice } from '../../components/SyncNotice';
import { useExpenses } from '../../context/ExpenseContext';
import { formatMoney } from '../../domain/expense';
import { downloadPhonePeCsvExample } from '../../domain/phonePeCsvTemplate';

export default function ActivityScreen() {
  const { expenses, importStatement } = useExpenses();
  const [importing, setImporting] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const chooseStatement = async () => {
    setImporting(true);
    setImportNotice(null);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'text/csv',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ],
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;

      const imported = await importStatement(result.assets[0]);
      const rowErrors = imported.errors.slice(0, 2).join(' ');
      setImportNotice(
        `${imported.importedCount} imported, ${imported.skippedCount} skipped.${
          rowErrors ? ` ${rowErrors}` : ''
        }`,
      );
    } catch (error) {
      setImportNotice(
        error instanceof Error ? error.message : 'Could not import the statement.',
      );
    } finally {
      setImporting(false);
    }
  };

  const downloadExample = async () => {
    setImportNotice(null);
    try {
      await downloadPhonePeCsvExample();
      setImportNotice(
        'CSV example ready. Replace its sample row with your PhonePe transactions before importing.',
      );
    } catch (error) {
      setImportNotice(
        error instanceof Error ? error.message : 'Could not download the CSV example.',
      );
    }
  };

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
      <View style={styles.importCard}>
        <View style={styles.importCopy}>
          <Text style={styles.importTitle}>Bring in PhonePe activity</Text>
          <Text style={styles.importSubtitle}>Upload an exported CSV or Excel statement</Text>
          <Pressable
            accessibilityRole="button"
            onPress={downloadExample}
            style={({ pressed }) => pressed && styles.exampleLinkPressed}
          >
            <Text style={styles.exampleLink}>Download CSV example</Text>
          </Pressable>
        </View>
        <Pressable
          accessibilityRole="button"
          disabled={importing}
          onPress={chooseStatement}
          style={({ pressed }) => [
            styles.importButton,
            pressed && styles.importButtonPressed,
            importing && styles.importButtonDisabled,
          ]}
        >
          {importing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.importButtonText}>Choose file</Text>
          )}
        </Pressable>
        {importNotice ? <Text style={styles.importNotice}>{importNotice}</Text> : null}
      </View>
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
  importCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#ECEEE9',
    borderRadius: 19,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 18,
    padding: 16,
  },
  importCopy: { flex: 1, marginRight: 10 },
  importTitle: { color: '#26362F', fontSize: 14, fontWeight: '700' },
  importSubtitle: { color: '#87908B', fontSize: 11, lineHeight: 16, marginTop: 4 },
  exampleLink: { color: '#214D3D', fontSize: 11, fontWeight: '700', marginTop: 8 },
  exampleLinkPressed: { opacity: 0.65 },
  importButton: {
    alignItems: 'center',
    backgroundColor: '#214D3D',
    borderRadius: 11,
    justifyContent: 'center',
    minHeight: 40,
    minWidth: 92,
    paddingHorizontal: 12,
  },
  importButtonPressed: { opacity: 0.8 },
  importButtonDisabled: { opacity: 0.6 },
  importButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  importNotice: { color: '#765A18', flexBasis: '100%', fontSize: 11, lineHeight: 16, marginTop: 10 },
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
