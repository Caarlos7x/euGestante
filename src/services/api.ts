import { User } from 'firebase/auth';

const getApiBaseUrl = (): string => {
  // Em desenvolvimento, usar o proxy do Vite
  if (import.meta.env.DEV) {
    return ''; // Proxy do Vite em /api
  }
  // Em produção, usar a URL configurada ou padrão
  return import.meta.env.VITE_API_BASE_URL || 'https://eu-gestante.vercel.app';
};

export interface ApiResponse<T = any> {
  ok?: boolean;
  items?: T[];
  id?: string;
  error?: string;
  [key: string]: any;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = getApiBaseUrl();
  }

  private async getAuthHeaders(user: User | null): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (user) {
      try {
        const idToken = await user.getIdToken();
        headers['Authorization'] = `Bearer ${idToken}`;
      } catch (error) {
        console.error('Erro ao obter token:', error);
        throw new Error('Não foi possível obter token de autenticação');
      }
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    user: User | null = null
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = await this.getAuthHeaders(user);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Erro na requisição ${endpoint}:`, error);
      throw error;
    }
  }

  // Health check
  async health(): Promise<ApiResponse> {
    return this.request('/api/health');
  }

  // Profile
  async getProfile(user: User): Promise<ApiResponse> {
    return this.request('/api/profile', { method: 'GET' }, user);
  }

  async updateProfile(user: User, data: {
    nome?: string;
    dataGestacaoInicio?: string;
    dataPrevistaParto?: string;
    idadeGestacionalAtual?: number;
    telefone?: string;
  }): Promise<ApiResponse> {
    return this.request('/api/profile', {
      method: 'POST',
      body: JSON.stringify(data),
    }, user);
  }

  // Records
  async getRecords(
    user: User,
    type: 'peso' | 'glicemia' | 'pressao',
    limit: number = 50
  ): Promise<ApiResponse> {
    const limitParam = Math.min(Math.max(limit, 1), 200);
    return this.request(
      `/api/records?type=${type}&limit=${limitParam}`,
      { method: 'GET' },
      user
    );
  }

  async createRecord(
    user: User,
    type: 'peso' | 'glicemia' | 'pressao',
    data: any
  ): Promise<ApiResponse> {
    return this.request(
      `/api/records?type=${type}`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      user
    );
  }

  // Consultas
  async getConsultas(user: User): Promise<ApiResponse> {
    return this.request('/api/consultas', { method: 'GET' }, user);
  }

  async createConsulta(user: User, data: any): Promise<ApiResponse> {
    return this.request(
      '/api/consultas',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      user
    );
  }

  // Exames
  async getExames(user: User): Promise<ApiResponse> {
    return this.request('/api/exames', { method: 'GET' }, user);
  }

  async createExame(user: User, data: any): Promise<ApiResponse> {
    return this.request(
      '/api/exames',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      user
    );
  }

  // Alertas
  async getAlertas(user: User, semana?: number): Promise<ApiResponse> {
    const url = semana
      ? `/api/alertas?semana=${semana}`
      : '/api/alertas';
    return this.request(url, { method: 'GET' }, user);
  }

  async createAlerta(user: User, data: any): Promise<ApiResponse> {
    return this.request(
      '/api/alertas',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      user
    );
  }

  // Lembretes
  async getLembretes(user: User): Promise<ApiResponse> {
    return this.request('/api/lembretes', { method: 'GET' }, user);
  }

  async createLembrete(user: User, data: any): Promise<ApiResponse> {
    return this.request(
      '/api/lembretes',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      user
    );
  }
}

export const apiService = new ApiService();
