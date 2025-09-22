import { apiService } from "../config/api";



export default function ProductPage(){
    

const fetchData = async () => {
  try {
    const data = await apiService.get('/api/Product');
    console.log(data);
  } catch (error) {
    console.error('API call failed:', error);
  }
};
fetchData()
    return (
        
        <p>hello world</p>
    )
}