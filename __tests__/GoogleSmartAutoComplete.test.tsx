import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import GoogleSmartAutoComplete from '../src/components/GoogleSmartAutoComplete';

describe('GoogleSmartAutoComplete', () => {
  it('renders input and fetches suggestions', async () => {
    const { getByPlaceholderText, getByText } = render(
      <GoogleSmartAutoComplete
        placeholder="Search place"
        predefinedPlaces={[]}
        query={{ key: 'DUMMY_API_KEY', language: 'en' }}
        fetchDetails={false}
        onPress={jest.fn()}
      />
    );

    const input = getByPlaceholderText('Search place');
    fireEvent(input, 'focus');
    fireEvent.changeText(input, 'lagos');

    await waitFor(() => getByText('Lagos, Nigeria'));
  });
});
