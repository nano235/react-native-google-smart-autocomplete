import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import useDebounce from '../hooks/useDebounce';
import {
  GooglePlaceData,
  GoogleSmartAutocompleteProps,
  GooglePlacesAutocompleteRef,
} from '../types';

function GoogleSmartAutocompleteInner(
  props: GoogleSmartAutocompleteProps,
  ref: React.Ref<GooglePlacesAutocompleteRef>
) {
  const {
    predefinedPlaces = [],
    onPress,
    fetchPlaceDetails,
    GooglePlacesDetailsQuery,
    apiKey,
    query = {},
    fetchDetails = false,
    enablePoweredByContainer = false,
    placeholder = 'Search...',
    debounce = 300,
    listViewDisplayed = true,
    renderItem,
    renderRow,
    renderLeftButton,
    renderRightButton,
    renderEmptyComponent,
    listEmptyComponent,
    textInputProps,
    value,
    onFocus,
    onTextChange,
    onError,
    styles: customStyles = {},
  } = props;

  const [inputText, setInputText] = useState(value || '');
  const [suggestions, setSuggestions] = useState<GooglePlaceData[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useImperativeHandle(ref, () => ({
    setAddressText: (text: string) => setInputText(text),
    getAddressText: () => inputText,
    getCurrentLocation: () => {},
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
  }));

  useEffect(() => {
    setInputText(value ?? '');
  }, [value]);

  const debouncedValue = useDebounce(inputText, debounce);

  useEffect(() => {
    if (!debouncedValue || !apiKey) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json');
        url.searchParams.set('input', debouncedValue);
        url.searchParams.set('key', apiKey);
        Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, String(v)));

        const response = await fetch(url.toString());
        const json = await response.json();
        setSuggestions(json.predictions || []);
      } catch (e) {
        console.error('Error fetching suggestions:', e);
        onError?.(e);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchSuggestions();
  }, [debouncedValue, apiKey]);

  const handleInputChange = async (data: GooglePlaceData) => {
    let details;
    if (fetchDetails && fetchPlaceDetails) {
      details = await fetchPlaceDetails(data.place_id);
    }
    setInputText(data.description);
    onPress(data, details);
  };


  return (
    <View style={[styles.container, customStyles.container]}>
      <View style={[styles.inputWrapper, customStyles.textInputContainer]}>
        {renderLeftButton?.()}

        <TextInput
          ref={inputRef}
          style={[styles.input, customStyles.textInput, textInputProps?.style]}
          placeholder={placeholder}
          value={typeof value === 'string' ? value : inputText}
          onChangeText={text => {
            if (typeof value !== 'string') setInputText(text);
            textInputProps?.onChangeText?.(text);
            onTextChange?.(text)
          }}
          onFocus={e => {
            textInputProps?.onFocus?.(e);
            onFocus?.();
          }}
          onBlur={e => {
            textInputProps?.onBlur?.(e);
          }}
          {...textInputProps}
        />

        {renderRightButton?.()}
      </View>

      {listViewDisplayed && (
        <FlatList
          style={[styles.list, customStyles.listView]}
          data={[...predefinedPlaces, ...suggestions]}
          keyExtractor={(item, index) => item.place_id || index.toString()}
          renderItem={({ item }) => {
            if (renderRow) {
              const node = renderRow(item);
              return React.isValidElement(node) ? node : null;
            }
            if (renderItem) {
              const node = renderItem(item);
              return React.isValidElement(node) ? node : <Text>{String(node)}</Text>;
            }
            // Default fallback
            return (
              <TouchableOpacity
                style={customStyles.row || styles.row}
                onPress={() => handleInputChange(item)}
              >
                <Text>{item.description}</Text>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            !loading
              ? renderEmptyComponent
                ? renderEmptyComponent
                : listEmptyComponent
                  ? () => <>{listEmptyComponent}</>
                  : null
              : null
          }
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

export const GoogleSmartAutoComplete = forwardRef(GoogleSmartAutocompleteInner);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  list: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    maxHeight: 200,
  },
  row: {
    padding: 10,
  },
});
