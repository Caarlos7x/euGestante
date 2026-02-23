import styled from 'styled-components';
import { FaFlask, FaUserMd } from 'react-icons/fa';
import { Card } from '@/components/Card';

interface UpcomingAppointmentCardProps {
  title: string;
  date: string;
  time: string;
  location?: string;
  doctor?: string;
  type: 'exame' | 'consulta';
}

const AppointmentCardContainer = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transitions.normal},
    box-shadow ${({ theme }) => theme.transitions.normal};
  position: relative;

  &:hover {
    transform: translateY(-0.25rem); /* -3px */
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const AppointmentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const AppointmentType = styled.span<{ $type: 'exame' | 'consulta' }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme, $type }) =>
    $type === 'exame' ? theme.colors.primary.main : theme.colors.secondary.main};
  background-color: ${({ theme, $type }) =>
    $type === 'exame' ? theme.colors.primary.light : theme.colors.secondary.light};
  padding: 0.166rem 0.5rem; /* 2px 6px */
  border-radius: ${({ theme }) => theme.borderRadius.full};
  text-transform: uppercase;
  letter-spacing: 0.05em;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.sm}; /* Aumentar em mobile */
    padding: 0.25rem 0.75rem; /* Aumentar padding */
  }
`;

const AppointmentDate = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const DateText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.base}; /* Aumentar em mobile */
  }
`;

const TimeText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.primary.main};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-top: 0.166rem; /* 2px */

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.lg}; /* Aumentar em mobile */
  }
`;

const AppointmentTitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const AppointmentIcon = styled.div<{ $type: 'exame' | 'consulta' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme, $type }) =>
    $type === 'exame' ? theme.colors.primary.main : theme.colors.secondary.main};
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  flex-shrink: 0;

  svg {
    width: 1.5rem; /* 18px baseado em 12px */
    height: 1.5rem; /* 18px baseado em 12px */
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    svg {
      width: 2rem; /* 24px - aumentar em mobile */
      height: 2rem; /* 24px */
    }
  }
`;

const AppointmentTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  flex: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl}; /* Aumentar em mobile */
  }
`;

const AppointmentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.spacing.sm}; /* Aumentar gap em mobile */
    margin-top: ${({ theme }) => theme.spacing.md};
  }
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.base}; /* Aumentar em mobile */
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const InfoLabel = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize.base}; /* Aumentar em mobile */
  }
`;

export const UpcomingAppointmentCard: React.FC<UpcomingAppointmentCardProps> = ({
  title,
  date,
  time,
  location,
  doctor,
  type,
}) => {
  return (
    <AppointmentCardContainer padding="md" elevation="sm">
      <AppointmentHeader>
        <AppointmentType $type={type}>
          {type === 'exame' ? 'Exame' : 'Consulta'}
        </AppointmentType>
        <AppointmentDate>
          <DateText>{date}</DateText>
          <TimeText>{time}</TimeText>
        </AppointmentDate>
      </AppointmentHeader>
      <AppointmentTitleContainer>
        <AppointmentIcon $type={type}>
          {type === 'exame' ? <FaFlask /> : <FaUserMd />}
        </AppointmentIcon>
        <AppointmentTitle>{title}</AppointmentTitle>
      </AppointmentTitleContainer>
      <AppointmentInfo>
        {doctor && (
          <InfoRow>
            <InfoLabel>Médico:</InfoLabel>
            <span>{doctor}</span>
          </InfoRow>
        )}
        {location && (
          <InfoRow>
            <InfoLabel>Local:</InfoLabel>
            <span>{location}</span>
          </InfoRow>
        )}
      </AppointmentInfo>
    </AppointmentCardContainer>
  );
};
