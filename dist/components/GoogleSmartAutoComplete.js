var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/components/GoogleSmartAutocomplete.tsx
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet, } from 'react-native';
import useDebounce from '../hooks/useDebounce';
function GoogleSmartAutocompleteInner(props, ref) {
    const { predefinedPlaces = [], onPress, fetchPlaceDetails, GooglePlacesDetailsQuery, apiKey, query = {}, fetchDetails = false, enablePoweredByContainer = false, placeholder = 'Search...', debounce = 300, listViewDisplayed = true, renderItem, renderRow, renderLeftButton, renderRightButton, renderEmptyComponent, listEmptyComponent, textInputProps, value, onFocus, onTextChange, onError, styles: customStyles = {}, } = props;
    const [inputText, setInputText] = useState(value || '');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    useImperativeHandle(ref, () => ({
        setAddressText: (text) => setInputText(text),
        getAddressText: () => inputText,
        getCurrentLocation: () => { },
        focus: () => { var _a; return (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus(); },
        blur: () => { var _a; return (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.blur(); },
    }));
    useEffect(() => {
        setInputText(value !== null && value !== void 0 ? value : '');
    }, [value]);
    const debouncedValue = useDebounce(inputText, debounce);
    useEffect(() => {
        if (!debouncedValue || !apiKey) {
            setSuggestions([]);
            return;
        }
        const fetchSuggestions = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json');
                url.searchParams.set('input', debouncedValue);
                url.searchParams.set('key', apiKey);
                Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, String(v)));
                const response = yield fetch(url.toString());
                const json = yield response.json();
                setSuggestions(json.predictions || []);
            }
            catch (e) {
                console.error('Error fetching suggestions:', e);
                onError === null || onError === void 0 ? void 0 : onError(e);
            }
            finally {
                setLoading(false);
            }
        });
        setLoading(true);
        fetchSuggestions();
    }, [debouncedValue, apiKey]);
    const handleInputChange = (data) => __awaiter(this, void 0, void 0, function* () {
        let details;
        if (fetchDetails && fetchPlaceDetails) {
            details = yield fetchPlaceDetails(data.place_id);
        }
        setInputText(data.description);
        onPress(data, details);
    });
    return (<View style={[styles.container, customStyles.container]}>
      <View style={[styles.inputWrapper, customStyles.textInputContainer]}>
        {renderLeftButton === null || renderLeftButton === void 0 ? void 0 : renderLeftButton()}

        <TextInput ref={inputRef} style={[styles.input, customStyles.textInput, textInputProps === null || textInputProps === void 0 ? void 0 : textInputProps.style]} placeholder={placeholder} value={typeof value === 'string' ? value : inputText} onChangeText={text => {
            var _a;
            if (typeof value !== 'string')
                setInputText(text);
            (_a = textInputProps === null || textInputProps === void 0 ? void 0 : textInputProps.onChangeText) === null || _a === void 0 ? void 0 : _a.call(textInputProps, text);
            onTextChange === null || onTextChange === void 0 ? void 0 : onTextChange(text);
        }} onFocus={e => {
            var _a;
            (_a = textInputProps === null || textInputProps === void 0 ? void 0 : textInputProps.onFocus) === null || _a === void 0 ? void 0 : _a.call(textInputProps, e);
            onFocus === null || onFocus === void 0 ? void 0 : onFocus();
        }} onBlur={e => {
            var _a;
            (_a = textInputProps === null || textInputProps === void 0 ? void 0 : textInputProps.onBlur) === null || _a === void 0 ? void 0 : _a.call(textInputProps, e);
        }} {...textInputProps}/>

        {renderRightButton === null || renderRightButton === void 0 ? void 0 : renderRightButton()}
      </View>

      {listViewDisplayed && (<FlatList style={[styles.list, customStyles.listView]} data={[...predefinedPlaces, ...suggestions]} keyExtractor={(item, index) => item.place_id || index.toString()} renderItem={({ item }) => {
                if (renderRow) {
                    const node = renderRow(item);
                    return React.isValidElement(node) ? node : null;
                }
                if (renderItem) {
                    const node = renderItem(item);
                    return React.isValidElement(node) ? node : <Text>{String(node)}</Text>;
                }
                // Default fallback
                return (<TouchableOpacity style={customStyles.row || styles.row} onPress={() => handleInputChange(item)}>
                <Text>{item.description}</Text>
              </TouchableOpacity>);
            }} ListEmptyComponent={!loading
                ? renderEmptyComponent
                    ? renderEmptyComponent
                    : listEmptyComponent
                        ? () => <>{listEmptyComponent}</>
                        : null
                : null} keyboardShouldPersistTaps="handled"/>)}
    </View>);
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
