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
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
  
  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async uploadFile(endpoint: string, formData: FormData){
    console.log('Uploading to:', `${API_BASE_URL}${endpoint}`); // Temporary debug
    const response = await fetch(`${API_BASE_URL}${endpoint}`,{
      method: 'POST',
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