import { useState, useCallback } from "react";
import { apiCall, apiOption } from "../../../src/actions/api";


const ExecuteQueryHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const ExecuteQuery = useCallback(async (page, params) => {    
    try {
      if (params !== null) {
        setIsLoading(true);
        setError(null);
        apiCall
          .post(page, { params }, apiOption())
          .then((res) => {
            setData(res.data.datalist);
            setIsLoading(false);
          })
          .catch((error) => {
            setError(error);
          });
      }
    } catch (err) {
      setError(err.message || "Something went wrong!");    }
    
  }, []);

  return { isLoading, data, error, ExecuteQuery };
};

export default ExecuteQueryHook;