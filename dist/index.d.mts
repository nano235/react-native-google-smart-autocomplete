import React from 'react';
import { TextInputProps, ViewStyle, TextStyle } from 'react-native';

interface GoogleSmartAutocompleteProps<T> {
    predefinedPlaces?: T[];
    fetchSuggestions: (query: string, apiKey?: string) => Promise<T[]>;
    onPress: (data: T, details?: any) => void;
    GooglePlacesDetailsQuery?: Record<string, any>;
    apiKey?: string;
    query?: Record<string, any>;
    fetchDetails?: boolean;
    enablePoweredByContainer?: boolean;
    placeholder?: string;
    debounce?: number;
    listViewDisplayed?: boolean;
    renderItem?: (item: T) => React.ReactNode;
    renderLeftButton?: () => React.ReactNode;
    renderRightButton?: () => React.ReactNode;
    renderEmptyComponent?: () => React.ReactNode;
    listEmptyComponent?: React.ReactNode;
    textInputProps?: TextInputProps;
    styles?: {
        container?: ViewStyle;
        listView?: ViewStyle;
        textInputContainer?: ViewStyle;
        textInput?: TextStyle;
        row?: ViewStyle;
        separator?: ViewStyle;
        description?: TextStyle;
        poweredContainer?: ViewStyle;
        powered?: ViewStyle;
        predefinedPlacesDescription?: TextStyle;
    };
}
declare function GoogleSmartAutocompleteInner<T>(props: GoogleSmartAutocompleteProps<T>, ref: React.Ref<any>): React.JSX.Element;
declare const GoogleSmartAutocomplete: <T>(props: GoogleSmartAutocompleteProps<T> & {
    ref?: React.Ref<any>;
}) => ReturnType<typeof GoogleSmartAutocompleteInner>;

export { GoogleSmartAutocomplete as default };
