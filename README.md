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

# or

yarn add react-native-smart-google-autocomplete
```

## Usage

```bash

import React, { useRef } from 'react';
import { View } from 'react-native';
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from 'react-native-smart-google-autocomplete';

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

## 📘 Props


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
| `textInputProps`           | `TextInputProps`                | Pass additional props to the TextInput                                   |
| `styles`                   | `object`                        | Override styles: container, listView, input, etc.                        |
| `listViewDisplayed`        | `boolean`                       | Show/hide dropdown suggestions (default: `true`)                         |
| `enablePoweredByContainer` | `boolean`                       | Show/hide "powered by Google" (default: `false`)                         |


## 🧠 Ref API

### Access programmatically using ref={inputRef}

```bash
type GooglePlacesAutocompleteRef = {
  setAddressText: (text: string) => void;
  getAddressText: () => string;
  getCurrentLocation: () => void;
  focus: () => void;
  blur: () => void;
};
```
### Usage

```bash

ref.current?.setAddressText('Lagos, Nigeria');
ref.current?.getAddressText(); // string
ref.current?.focus();
ref.current?.blur();
```



