import { placeAutocomplete } from '@/lib/api/care2home';
import type { AddressSuggestion } from '@/lib/types/address';
import { colors } from '@/lib/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Input } from '@/components/ui/Input';

type AddressAutocompleteProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onSelect: (suggestion: AddressSuggestion) => void;
  placeholder?: string;
  headerAction?: React.ReactNode;
};

export function AddressAutocomplete({
  label,
  value,
  onChangeText,
  onSelect,
  placeholder,
  headerAction,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const skipFetch = useRef(false);

  useEffect(() => {
    if (skipFetch.current) {
      skipFetch.current = false;
      return;
    }

    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await placeAutocomplete(trimmed);
        setSuggestions(results);
        setIsOpen(results.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  const handleSelect = (item: AddressSuggestion) => {
    skipFetch.current = true;
    onChangeText(item.address);
    onSelect(item);
    setIsOpen(false);
    setSuggestions([]);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {headerAction}
      </View>
      <Input
        value={value}
        onChangeText={(text) => {
          onChangeText(text);
          setIsOpen(true);
        }}
        placeholder={placeholder}
        onFocus={() => setIsOpen(suggestions.length > 0)}
      />
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.primaryBlue} style={styles.loader} />
      ) : null}
      {isOpen && suggestions.length > 0 ? (
        <View style={styles.dropdown}>
          {suggestions.map((item) => (
            <Pressable
              key={item.placeId}
              style={styles.suggestion}
              onPress={() => handleSelect(item)}
            >
              <Ionicons name="location-outline" size={18} color={colors.primaryBlue} />
              <View style={styles.suggestionText}>
                <Text style={styles.mainText}>{item.mainText}</Text>
                {item.secondaryText ? (
                  <Text style={styles.secondaryText}>{item.secondaryText}</Text>
                ) : null}
              </View>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 8, zIndex: 1 },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: { fontSize: 14, fontWeight: '500', color: colors.gray700 },
  loader: { marginTop: 4 },
  dropdown: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 12,
    maxHeight: 200,
    marginTop: 4,
    elevation: 4,
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  suggestionText: { flex: 1 },
  mainText: { fontSize: 14, fontWeight: '600', color: colors.gray900 },
  secondaryText: { fontSize: 12, color: colors.gray500, marginTop: 2 },
});
