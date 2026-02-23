// Serviço para buscar endereços usando Google Places API

interface PlacePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface PlaceDetails {
  formatted_address: string;
  name?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
}

const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

/**
 * Busca sugestões de endereços usando Google Places Autocomplete
 */
export async function searchAddresses(
  input: string,
  sessionToken?: string
): Promise<PlacePrediction[]> {
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn('Google Maps API Key não configurada');
    return [];
  }

  if (!input || input.length < 3) {
    return [];
  }

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json');
    url.searchParams.append('input', input);
    url.searchParams.append('key', GOOGLE_PLACES_API_KEY);
    url.searchParams.append('language', 'pt-BR');
    url.searchParams.append('components', 'country:br'); // Limitar ao Brasil
    url.searchParams.append('types', 'establishment|geocode'); // Estabelecimentos e endereços

    if (sessionToken) {
      url.searchParams.append('sessiontoken', sessionToken);
    }

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status === 'OK' && data.predictions) {
      return data.predictions;
    }

    if (data.status === 'ZERO_RESULTS') {
      return [];
    }

    console.warn('Erro na busca de endereços:', data.status, data.error_message);
    return [];
  } catch (error) {
    console.error('Erro ao buscar endereços:', error);
    return [];
  }
}

/**
 * Obtém detalhes de um lugar usando place_id
 */
export async function getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn('Google Maps API Key não configurada');
    return null;
  }

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
    url.searchParams.append('place_id', placeId);
    url.searchParams.append('key', GOOGLE_PLACES_API_KEY);
    url.searchParams.append('language', 'pt-BR');
    url.searchParams.append('fields', 'formatted_address,name,geometry,address_components');

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status === 'OK' && data.result) {
      return data.result;
    }

    console.warn('Erro ao obter detalhes do lugar:', data.status, data.error_message);
    return null;
  } catch (error) {
    console.error('Erro ao obter detalhes do lugar:', error);
    return null;
  }
}

/**
 * Alternativa: Busca endereços usando Geocoding API (mais simples, mas sem autocomplete)
 */
export async function geocodeAddress(address: string): Promise<PlaceDetails | null> {
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn('Google Maps API Key não configurada');
    return null;
  }

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
    url.searchParams.append('address', address);
    url.searchParams.append('key', GOOGLE_PLACES_API_KEY);
    url.searchParams.append('language', 'pt-BR');
    url.searchParams.append('region', 'br'); // Limitar ao Brasil

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status === 'OK' && data.results && data.results.length > 0) {
      return {
        formatted_address: data.results[0].formatted_address,
        name: data.results[0].address_components[0]?.long_name,
        geometry: data.results[0].geometry,
        address_components: data.results[0].address_components,
      };
    }

    return null;
  } catch (error) {
    console.error('Erro ao geocodificar endereço:', error);
    return null;
  }
}
