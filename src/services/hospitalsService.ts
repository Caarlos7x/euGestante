/**
 * Serviço para buscar hospitais e maternidades usando API pública do OpenStreetMap (Nominatim)
 * Totalmente gratuito e não requer API key
 */

export interface Hospital {
  id: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  type?: string;
}

/**
 * Busca hospitais e maternidades próximos usando Nominatim API (OpenStreetMap)
 * @param lat Latitude do usuário
 * @param lng Longitude do usuário
 * @param radius Raio de busca em metros (padrão: 10000 = 10km)
 */
export const searchNearbyHospitals = async (
  lat: number,
  lng: number,
  radius: number = 10000
): Promise<Hospital[]> => {
  try {
    // Nominatim API - totalmente gratuita, sem necessidade de API key
    // Busca por hospitais e maternidades próximos
    const query = encodeURIComponent('hospital maternidade');
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&lat=${lat}&lon=${lng}&radius=${radius}&format=json&limit=20&addressdetails=1`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'euGestanteApp/1.0', // Nominatim requer User-Agent identificável
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar hospitais');
    }

    const data = await response.json();

    // Filtrar e formatar resultados
    const hospitals: Hospital[] = data
      .filter((place: any) => {
        // Filtrar apenas hospitais e maternidades
        const type = (place.type || '').toLowerCase();
        const name = (place.display_name || '').toLowerCase();
        const category = (place.category || '').toLowerCase();
        
        return (
          type.includes('hospital') ||
          type.includes('maternity') ||
          type.includes('clinic') ||
          name.includes('hospital') ||
          name.includes('maternidade') ||
          name.includes('maternity') ||
          category.includes('health')
        );
      })
      .map((place: any, index: number) => ({
        id: place.place_id?.toString() || `hospital-${index}`,
        name: place.display_name?.split(',')[0] || 'Hospital',
        address: place.display_name || 'Endereço não disponível',
        location: {
          lat: parseFloat(place.lat),
          lng: parseFloat(place.lon),
        },
        type: place.type || 'hospital',
      }));

    // Remover duplicados baseado no ID
    const uniqueHospitals = Array.from(
      new Map(hospitals.map((h) => [h.id, h])).values()
    );

    return uniqueHospitals;
  } catch (error) {
    console.error('Erro ao buscar hospitais:', error);
    return [];
  }
};
