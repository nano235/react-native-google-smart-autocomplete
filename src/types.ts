import * as React from 'react';
import {
  ImageStyle,
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';

export interface GoogleSmartPlaceDetail {
  address_components: any[];
  adr_address: string;
  formatted_address: string;
  geometry: any;
  icon: string;
  id: string;
  name: string;
  place_id: string;
  plus_code: any;
  reference: string;
  scope: 'GOOGLE';
  types: string[];
  url: string;
  utc_offset: number;
  vicinity: string;
}

export interface GoogleSmartPlaceData {
  description: string;
  id: string;
  matched_substrings: any[];
  place_id: string;
  reference: string;
  structured_formatting: any;
}

export interface Styles {
  container: StyleProp<ViewStyle>;
  description: StyleProp<TextStyle>;
  textInputContainer: StyleProp<ViewStyle>;
  textInput: StyleProp<TextStyle>;
  loader: StyleProp<ViewStyle>;
  listView: StyleProp<ViewStyle>;
  predefinedPlacesDescription: StyleProp<TextStyle>;
  poweredContainer: StyleProp<ViewStyle>;
  powered: StyleProp<ImageStyle>;
  separator: StyleProp<ViewStyle>;
  row: StyleProp<ViewStyle>;
}

export interface GoogleSmartAutocompleteProps {
  predefinedPlaces?: GoogleSmartPlaceData[];
  onPress: (data: GoogleSmartPlaceData, details?: GoogleSmartPlaceDetail) => void;
  fetchPlaceDetails?: (placeId: string) => Promise<GoogleSmartPlaceDetail>;
  apiKey: string;
  query?: Record<string, any>;
  fetchDetails?: boolean;
  placeholder?: string;
  debounce?: number;
  listViewDisplayed?: boolean;
  renderItem?: (item: GoogleSmartPlaceData) => React.ReactNode;
  renderRow?: (item: GoogleSmartPlaceData) => React.ReactNode;
  renderLeftButton?: () => React.ReactNode;
  renderRightButton?: () => React.ReactNode;
  renderEmptyComponent?: () => React.ReactNode;
  listEmptyComponent?: React.ReactNode;
  textInputProps?: TextInputProps;
  value?: string;
  onFocus?: () => void;
  onTextChange?: (text: string) => void;
  onError?: (error: any) => void;
  styles?: Partial<Styles>;
}

export type GoogleSmartAutocompleteRef = {
  setAddressText(address: string): void;
  getAddressText(): string;
  getCurrentLocation(): void;
  focus(): void;
  blur(): void;
}; 