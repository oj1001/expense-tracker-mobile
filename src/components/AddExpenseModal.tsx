import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  CATEGORIES,
  CATEGORY_META,
  type ExpenseCategory,
} from '../domain/expense';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (expense: {
    description: string;
    amount: number;
    category: ExpenseCategory;
    spentAt: string;
  }) => Promise<void>;
};

export function AddExpenseModal({ visible, onClose, onSave }: Props) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const numericAmount = Number(amount.replace(',', '.'));
    if (!description.trim() || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      Alert.alert(
        'Check your expense',
        'Add a description and an amount greater than zero.',
      );
      return;
    }

    setSaving(true);
    try {
      await onSave({
        description: description.trim(),
        amount: numericAmount,
        category,
        spentAt: new Date().toISOString(),
      });
      setDescription('');
      setAmount('');
      setCategory('Food');
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
      visible={visible}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.sheet}
      >
        <View style={styles.handle} />
        <View style={styles.heading}>
          <View>
            <Text style={styles.eyebrow}>A LITTLE CLARITY</Text>
            <Text style={styles.title}>Add expense</Text>
          </View>
          <Pressable
            accessibilityLabel="Close"
            accessibilityRole="button"
            onPress={onClose}
            style={styles.closeButton}
          >
            <Text style={styles.closeText}>×</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>WHAT DID YOU SPEND ON?</Text>
          <TextInput
            autoCapitalize="sentences"
            autoFocus
            onChangeText={setDescription}
            placeholder="e.g. Coffee with Maya"
            placeholderTextColor="#A6ADA8"
            returnKeyType="next"
            style={styles.input}
            value={description}
          />

          <Text style={[styles.label, styles.amountLabel]}>HOW MUCH?</Text>
          <View style={styles.amountInputWrap}>
            <Text style={styles.currency}>₹</Text>
            <TextInput
              keyboardType="decimal-pad"
              onChangeText={setAmount}
              placeholder="0"
              placeholderTextColor="#A6ADA8"
              style={styles.amountInput}
              value={amount}
            />
          </View>

          <Text style={[styles.label, styles.categoryLabel]}>CATEGORY</Text>
          <View style={styles.categories}>
            {CATEGORIES.map((item) => {
              const meta = CATEGORY_META[item];
              const selected = category === item;
              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  key={item}
                  onPress={() => setCategory(item)}
                  style={[
                    styles.category,
                    selected && styles.categorySelected,
                  ]}
                >
                  <Text style={styles.categoryIcon}>{meta.icon}</Text>
                  <Text
                    style={[
                      styles.categoryText,
                      selected && styles.categoryTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            accessibilityRole="button"
            disabled={saving}
            onPress={save}
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          >
            <Text style={styles.saveText}>
              {saving ? 'Saving…' : 'Save expense'}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: { backgroundColor: '#FBFAF7', flex: 1, paddingTop: 10 },
  handle: {
    alignSelf: 'center',
    backgroundColor: '#DADDD8',
    borderRadius: 3,
    height: 5,
    marginBottom: 22,
    width: 38,
  },
  heading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  eyebrow: {
    color: '#87908B',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  title: { color: '#1A302A', fontSize: 27, fontWeight: '700', marginTop: 5 },
  closeButton: {
    alignItems: 'center',
    backgroundColor: '#F0F0EB',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  closeText: { color: '#53615B', fontSize: 24, lineHeight: 26 },
  content: { padding: 24, paddingBottom: 40 },
  label: { color: '#7D8881', fontSize: 10, fontWeight: '700', letterSpacing: 1.1 },
  input: {
    borderBottomColor: '#DDE1DA',
    borderBottomWidth: 1,
    color: '#1A302A',
    fontSize: 17,
    paddingBottom: 13,
    paddingTop: 15,
  },
  amountLabel: { marginTop: 27 },
  amountInputWrap: {
    alignItems: 'center',
    borderBottomColor: '#DDE1DA',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingBottom: 4,
  },
  currency: { color: '#1A302A', fontSize: 30, fontWeight: '500', marginRight: 9 },
  amountInput: { color: '#1A302A', flex: 1, fontSize: 38, fontWeight: '600', paddingVertical: 8 },
  categoryLabel: { marginTop: 27 },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 14 },
  category: {
    alignItems: 'center',
    backgroundColor: '#F1F1EC',
    borderColor: 'transparent',
    borderRadius: 13,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  categorySelected: { backgroundColor: '#E6EFE8', borderColor: '#7AA58A' },
  categoryIcon: { fontSize: 15 },
  categoryText: { color: '#68736D', fontSize: 12, fontWeight: '500' },
  categoryTextSelected: { color: '#284D3A', fontWeight: '700' },
  saveButton: {
    alignItems: 'center',
    backgroundColor: '#1C4338',
    borderRadius: 16,
    marginTop: 34,
    paddingVertical: 17,
  },
  saveButtonDisabled: { opacity: 0.6 },
  saveText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
