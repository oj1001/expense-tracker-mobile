import { Platform } from 'react-native';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const PHONEPE_CSV_EXAMPLE = [
  'Date,Details,Type,Amount,Transaction ID,Status',
  '06/11/2026,Example grocery purchase,DEBIT,250.50,EXAMPLE-001,SUCCESS',
  '',
].join('\r\n');

export async function downloadPhonePeCsvExample(): Promise<void> {
  const filename = 'phonepe-expense-import-example.csv';

  if (Platform.OS === 'web') {
    const blob = new Blob([PHONEPE_CSV_EXAMPLE], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return;
  }

  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('File sharing is not available on this device.');
  }

  const file = new File(Paths.cache, filename);
  file.create({ overwrite: true });
  await file.write(PHONEPE_CSV_EXAMPLE);
  await Sharing.shareAsync(file.uri, {
    dialogTitle: 'Save the PhonePe CSV example',
    mimeType: 'text/csv',
  });
}
