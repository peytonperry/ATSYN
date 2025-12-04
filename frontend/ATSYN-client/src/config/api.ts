const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    // Aspire provides the base URL like "https://localhost:7068"
    // We need to add /api to it
    return `${import.meta.env.VITE_API_URL}/api`;
  }
  
  // Fallback
  return 'https://localhost:7068/api';
};

export const API_BASE_URL = getApiBaseUrl();

export const apiService = {
  async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
  
  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    return text ? JSON.parse(text) : null;
    //return response.json();
  },

  async put(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }); 
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  },

  delete: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error: any = new Error(`HTTP error! status: ${response.status}`);
      error.response = {
        status: response.status,
        data: errorData
      };
      throw error;
    }
  
    return response;
  },  

  async uploadFile(endpoint: string, formData: FormData){
    console.log('Uploading to:', `${API_BASE_URL}${endpoint}`); // Temporary debug
    const response = await fetch(`${API_BASE_URL}${endpoint}`,{
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if(!response.ok){
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  getImageUrl(photoId: number): string {
    return `${API_BASE_URL}/Photo/${photoId}`;
  }

};