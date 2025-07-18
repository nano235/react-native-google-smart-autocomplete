# react-native-smart-google-autocomplete

A customizable, lightweight Google Places Autocomplete input component for React Native, built using the official Google Maps Places API.

## ✨ Features

- Uses Google Maps Places REST API (not SDK) ✅
- Fully customizable UI (input, list, buttons, etc) 🎨
- Predefined places support 📍
- Optional place detail fetching 📌
- Lightweight and tree-shakable 🪶
- Exposes imperative methods (focus, blur, etc) 🧠
- Built-in debouncing 🕒

## 🚀 Installation

```bash
npm install react-native-smart-google-autocomplete
```

or

```bash
yarn add react-native-smart-google-autocomplete
```

## 📦 Usage

### Basic Example

```tsx
import React, { useRef } from 'react';
import { View } from 'react-native';
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef
} from 'react-native-smart-google-autocomplete';

export default function ExampleScreen() {
  const inputRef = useRef<GooglePlacesAutocompleteRef>(null);

  return (
    <View style={{ padding: 16 }}>
      <GooglePlacesAutocomplete
        ref={inputRef}
        apiKey="YOUR_GOOGLE_MAPS_API_KEY"
        placeholder="Where to?"
        onPress={(data, details) => {
          console.log('Selected place data:', data);
          console.log('Place details (optional):', details);
        }}
        fetchDetails={true}
        query={{
          language: 'en',
          components: 'country:us',
        }}
        predefinedPlaces={[
          {
            description: 'Home',
            place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
            id: '1',
            matched_substrings: [],
            reference: '',
            structured_formatting: {},
          },
        ]}
      />
    </View>
  );
}
```

### Custom UI & Behavior Example

```tsx
<GooglePlacesAutocomplete
  ref={inputRef}
  apiKey={GM_API_KEY}
  placeholder="Enter a location"
  debounce={400}
  fetchDetails={false}
  query={{
    language: 'en',
    components: 'country:ng',
  }}
  onPress={(data, details) => {
    console.log('Custom press handler', data, details);
  }}
  onTextChange={text => {
    console.log('Text changed:', text);
  }}
  onFocus={() => console.log('Input focused')}
  onError={err => console.error('Autocomplete error:', err)}
  renderLeftButton={() => (
    <TouchableOpacity onPress={() => console.log('Left button')}>Left</TouchableOpacity>
  )}
  renderRightButton={() => (
    <TouchableOpacity onPress={() => inputRef.current?.setAddressText('')}>Clear</TouchableOpacity>
  )}
  renderRow={data => (
    <TouchableOpacity onPress={() => handlePlaceSelect(data)}>
      <Text>{data.description}</Text>
    </TouchableOpacity>
  )}
  styles={{
    textInputContainer: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 8,
      borderRadius: 8,
    },
    textInput: {
      fontSize: 16,
      color: '#333',
    },
    listView: {
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderColor: '#eee',
    },
    row: {
      padding: 12,
      borderBottomWidth: 1,
      borderColor: '#eee',
    },
    separator: {
      height: 1,
      backgroundColor: '#f0f0f0',
    },
  }}
/>
```

## 🧠 Imperative Methods

```tsx
ref.current?.setAddressText('Lagos, Nigeria');
ref.current?.getAddressText(); // string
ref.current?.focus();
ref.current?.blur();
```

## 📘 Props Table

| Prop                       | Type                            | Description                                                              |
| -------------------------- | ------------------------------- | ------------------------------------------------------------------------ |
| `apiKey`                   | `string`                        | **Required**. Your Google Maps API Key                                   |
| `onPress`                  | `(data, details?) => void`      | Called when a place is selected                                          |
| `fetchDetails`             | `boolean`                       | If `true`, will fetch full place details on selection (default: `false`) |
| `fetchPlaceDetails`        | `(placeId) => Promise<details>` | Optional custom method to fetch place details                            |
| `query`                    | `object`                        | Extra query params (e.g., `language`, `components`)                      |
| `predefinedPlaces`         | `GooglePlaceData[]`             | Custom static entries shown before suggestions                           |
| `debounce`                 | `number`                        | Debounce duration in ms for input (default: `300`)                       |
| `placeholder`              | `string`                        | Input placeholder                                                        |
| `renderLeftButton`         | `() => ReactNode`               | Custom left icon/button                                                  |
| `renderRightButton`        | `() => ReactNode`               | Custom right icon/button                                                 |
| `renderItem`               | `(item) => ReactNode`           | Custom render function for each suggestion                               |
| `renderRow`                | `(item) => ReactNode`           | Full row customization                                                   |
| `renderEmptyComponent`     | `() => ReactNode`               | Custom empty result component                                            |
| `listEmptyComponent`       | `ReactNode`                     | JSX element to show when list is empty                                   |
| `textInputProps`           | `TextInputProps`                | Props to pass into the underlying `TextInput`                            |
| `value`                    | `string`                        | Controlled input value                                                   |
| `onFocus`                  | `() => void`                    | Called when input is focused                                             |
| `onTextChange`             | `(text: string) => void`        | Called when input text changes                                           |
| `onError`                  | `(error: any) => void`          | Called on request or component error                                     |
| `styles`                   | `Partial<Styles>`               | Override component styles                                                |
| `listViewDisplayed`        | `boolean`                       | Whether dropdown is shown                                                |
| `enablePoweredByContainer` | `boolean`                       | Show/hide "powered by Google" (default: `false`)                         |

## 🔧 Ref Methods

```ts
export interface GooglePlacesAutocompleteRef {
  setAddressText: (text: string) => void;
  getAddressText: () => string;
  getCurrentLocation: () => void;
  focus: () => void;
  blur: () => void;
}
```

---

MIT License © 2025

Crafted with 💡 for custom location inputs.
