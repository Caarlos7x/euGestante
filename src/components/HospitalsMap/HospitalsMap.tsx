import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';
import { Card } from '@/components/Card';
import { searchNearbyHospitals, Hospital } from '@/services/hospitalsService';
import { FaMapMarkerAlt } from 'react-icons/fa';

// Fix para ícones do Leaflet no React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapContainerWrapper = styled(Card)`
  width: 100%;
  height: 30rem; /* 360px */
  margin-top: ${({ theme }) => theme.spacing['3xl']};
  padding: 0;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 25rem; /* 300px */
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    height: 20rem; /* 240px */
  }

  .leaflet-container {
    height: 100%;
    width: 100%;
    z-index: 1;
  }
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;

const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ErrorTitle = styled.h3`
  color: ${({ theme }) => theme.colors.error.main};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin: 0;
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const PopupContent = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  min-width: 200px;
`;

const PopupTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const PopupAddress = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

// Componente para ajustar o mapa quando a localização mudar
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);

  return null;
};

const defaultCenter: [number, number] = [-23.5505, -46.6333]; // São Paulo
const defaultZoom = 13;

export const HospitalsMap: React.FC = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obter geolocalização do usuário
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setUserLocation(location);
          setLoading(false);
        },
        (err) => {
          console.error('Erro ao obter geolocalização:', err);
          setError('Não foi possível obter sua localização. Usando localização padrão.');
          setUserLocation(defaultCenter);
          setLoading(false);
        }
      );
    } else {
      setError('Geolocalização não suportada pelo navegador.');
      setUserLocation(defaultCenter);
      setLoading(false);
    }
  }, []);

  // Buscar hospitais quando a localização estiver disponível
  useEffect(() => {
    if (userLocation) {
      const fetchHospitals = async () => {
        try {
          setLoading(true);
          const results = await searchNearbyHospitals(userLocation[0], userLocation[1], 10000);
          setHospitals(results);
          if (results.length === 0) {
            setError('Nenhum hospital ou maternidade encontrado próximo a você.');
          } else {
            setError(null);
          }
        } catch (err: any) {
          console.error('Erro ao buscar hospitais:', err);
          setError('Erro ao buscar hospitais. Tente novamente mais tarde.');
        } finally {
          setLoading(false);
        }
      };

      fetchHospitals();
    }
  }, [userLocation]);

  if (loading) {
    return (
      <MapContainerWrapper padding="lg" elevation="sm">
        <LoadingMessage>Carregando mapa...</LoadingMessage>
      </MapContainerWrapper>
    );
  }

  const mapCenter = userLocation || defaultCenter;

  return (
    <MapContainerWrapper padding="none" elevation="sm">
      <MapContainer
        center={mapCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <MapController center={mapCenter} zoom={defaultZoom} />
        
        {/* TileLayer do OpenStreetMap - totalmente gratuito */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marcador da localização do usuário */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              <PopupContent>
                <PopupTitle>
                  <FaMapMarkerAlt style={{ marginRight: '0.5rem', color: '#4285F4' }} />
                  Sua localização
                </PopupTitle>
              </PopupContent>
            </Popup>
          </Marker>
        )}

        {/* Marcadores dos hospitais */}
        {hospitals.map((hospital) => (
          <Marker
            key={hospital.id}
            position={[hospital.location.lat, hospital.location.lng]}
            icon={DefaultIcon}
          >
            <Popup>
              <PopupContent>
                <PopupTitle>{hospital.name}</PopupTitle>
                <PopupAddress>{hospital.address}</PopupAddress>
              </PopupContent>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {error && hospitals.length === 0 && (
        <div style={{ 
          position: 'absolute', 
          top: '1rem', 
          left: '1rem', 
          right: '1rem', 
          background: 'rgba(255, 255, 255, 0.95)', 
          padding: '1rem', 
          borderRadius: '0.5rem', 
          zIndex: 1000,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <ErrorTitle>{error}</ErrorTitle>
        </div>
      )}
    </MapContainerWrapper>
  );
};
