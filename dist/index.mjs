// src/components/GoogleSmartAutoComplete.tsx
import React, { useState as useState2, useEffect as useEffect2, useRef, forwardRef, useImperativeHandle } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet
} from "react-native";

// src/hooks/useDebounce.ts
import { useEffect, useState } from "react";
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// src/components/GoogleSmartAutoComplete.tsx
function GoogleSmartAutocompleteInner(props, ref) {
  const {
    predefinedPlaces = [],
    fetchSuggestions,
    onPress,
    GooglePlacesDetailsQuery,
    apiKey,
    query,
    fetchDetails = false,
    enablePoweredByContainer = false,
    placeholder = "Search...",
    debounce = 300,
    listViewDisplayed = true,
    renderItem,
    renderLeftButton,
    renderRightButton,
    renderEmptyComponent,
    listEmptyComponent,
    textInputProps,
    styles: customStyles = {}
  } = props;
  const [inputText, setInputText] = useState2("");
  const [suggestions, setSuggestions] = useState2([]);
  const [loading, setLoading] = useState2(false);
  const [isFocused, setIsFocused] = useState2(false);
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    setAddressText: (text) => setInputText(text),
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur()
  }));
  const debouncedValue = useDebounce(inputText, debounce);
  useEffect2(() => {
    if (!debouncedValue) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    fetchSuggestions(debouncedValue, apiKey).then(setSuggestions).finally(() => setLoading(false));
  }, [debouncedValue, apiKey]);
  return /* @__PURE__ */ React.createElement(View, { style: [styles.container, customStyles.container] }, /* @__PURE__ */ React.createElement(View, { style: [styles.inputWrapper, customStyles.textInputContainer] }, renderLeftButton?.(), /* @__PURE__ */ React.createElement(
    TextInput,
    {
      ref: inputRef,
      style: [styles.input, customStyles.textInput, textInputProps?.style],
      placeholder,
      value: inputText,
      onChangeText: setInputText,
      onFocus: () => setIsFocused(true),
      onBlur: () => setIsFocused(false),
      ...textInputProps
    }
  ), renderRightButton?.()), listViewDisplayed && isFocused && /* @__PURE__ */ React.createElement(
    FlatList,
    {
      style: [styles.list, customStyles.listView],
      data: [...predefinedPlaces, ...suggestions],
      keyExtractor: (item, index) => index.toString(),
      renderItem: ({ item }) => /* @__PURE__ */ React.createElement(
        TouchableOpacity,
        {
          style: customStyles.row || styles.row,
          onPress: () => onPress(item, null)
        },
        renderItem ? renderItem(item) : /* @__PURE__ */ React.createElement(Text, null, String(item))
      ),
      ListEmptyComponent: !loading ? renderEmptyComponent ? renderEmptyComponent : listEmptyComponent ? () => /* @__PURE__ */ React.createElement(React.Fragment, null, listEmptyComponent) : void 0 : void 0,
      keyboardShouldPersistTaps: "handled"
    }
  ));
}
var GoogleSmartAutocomplete = forwardRef(GoogleSmartAutocompleteInner);
var GoogleSmartAutoComplete_default = GoogleSmartAutocomplete;
var styles = StyleSheet.create({
  container: {
    width: "100%"
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16
  },
  list: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    maxHeight: 200
  },
  row: {
    padding: 10
  }
});

// src/index.tsx
var index_default = GoogleSmartAutoComplete_default;
export {
  index_default as default
};
