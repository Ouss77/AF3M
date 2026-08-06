import axios from "axios";


  export const fetchActualites = async (setActualites, setLoading, setError) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Actualites/getActualite.php`);
      const data = response.data;
      setActualites(data);
    } catch (err) { 
      setError(err.message);
    } finally {
     setLoading(false); 
    }
  };
