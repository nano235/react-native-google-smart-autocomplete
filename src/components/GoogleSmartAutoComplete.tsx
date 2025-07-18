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
  GoogleSmartPlaceData,
  GoogleSmartAutocompleteProps,
  GoogleSmartAutocompleteRef,
} from '../types';

function GoogleSmartAutocompleteInner(
  props: GoogleSmartAutocompleteProps,
  ref: React.Ref<GoogleSmartAutocompleteRef>
) {
  const {
    predefinedPlaces = [],
    onPress,
    fetchPlaceDetails,
    apiKey,
    query = {},
    fetchDetails = false,
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
  const [suggestions, setSuggestions] = useState<GoogleSmartPlaceData[]>([]);
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
  }, [debouncedValue, apiKey, query]);

  const handleInputChange = async (data: GoogleSmartPlaceData) => {
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
            // Use DefaultRow as fallback
            return (
              <DefaultRow
                data={item}
                onPress={() => handleInputChange(item)}
              />
            );
          }}
          ListEmptyComponent={
            !loading
              ? renderEmptyComponent
                ? renderEmptyComponent
                : listEmptyComponent
                  ? () => <>{listEmptyComponent}</>
                  : <View style={styles.listEmptyView}>
                  <Text>No results were found</Text>
                </View>
              : null
          }
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

export const GoogleSmartAutoComplete = forwardRef(GoogleSmartAutocompleteInner);

interface DefaultRowProps {
	data: GoogleSmartPlaceData;
	onPress: () => void;
}

const DefaultRow: React.FC<DefaultRowProps> = ({ data, onPress }) => {
	if (!data.structured_formatting) {
		return (
			<TouchableOpacity style={styles.defaultRow} onPress={onPress}>
				<Text
					style={styles.placeText}
					numberOfLines={1}
					ellipsizeMode="tail"
				>
					{data.description || (data as any).name}
				</Text>
			</TouchableOpacity>
		);
	}

	const { main_text, secondary_text } = data.structured_formatting;
	const { matched_substrings } = data;

	const highlightMainText = () => {
		if (!matched_substrings?.length) {
			return (
				<Text
					style={styles.placeText}
					numberOfLines={1}
					ellipsizeMode="tail"
				>
					{main_text}
				</Text>
			);
		}

		let parts = [];
		let lastIndex = 0;

		matched_substrings.forEach(match => {
			const { offset, length } = match;

			if (offset > lastIndex) {
				parts.push(main_text.slice(lastIndex, offset));
			}

			parts.push(main_text.slice(offset, offset + length));
			lastIndex = offset + length;
		});

		if (lastIndex < main_text.length) {
			parts.push(main_text.slice(lastIndex));
		}

		return (
			<Text style={styles.placeText} numberOfLines={1} ellipsizeMode="tail">
				{parts.map((part, index) =>
					matched_substrings.some(
						match => match.offset === main_text.indexOf(part)
					) ? (
						<Text
							key={index}
							style={[styles.placeText, styles.highlight]}
						>
							{part}
						</Text>
					) : (
						<Text key={index} style={styles.placeText}>
							{part}
						</Text>
					)
				)}
			</Text>
		);
	};

	return (
		<TouchableOpacity
			style={styles.defaultRow}
			onPress={() => {
				console.log("caalled......to");

				onPress();
			}}
		>
			{/* {highlightMatchText(data.description, query)} */}
			{highlightMainText()}
			<Text>{secondary_text}</Text>
		</TouchableOpacity>
	);
};

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
  listEmptyView: {
		flex: 1,
		padding: 16,
		minWidth: "100%",
		maxWidth: "100%",
	},
  defaultRow: {
		padding: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
		backgroundColor: "#ffffff",
	},
	placeText: {
		fontSize: 14,
		color: "#555",
		fontWeight: "400",
	},
  highlight: {
		color: "#564CD8",
		fontWeight: "600",
	},
});
