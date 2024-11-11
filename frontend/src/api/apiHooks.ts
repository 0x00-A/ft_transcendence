import { useQuery } from '@tanstack/react-query';
import {getData} from './apiClient';


const useGetData = <T>(endpoint: string) => {
  return useQuery({
    queryKey: [endpoint],          // You can use endpoint as a unique key for this query
    queryFn: () => getData<T>(`${endpoint}/`),  // Specify the function to fetch data // Specify the function to fetch data
    staleTime: 5000,      // Optional: Configure additional options like staleTime
    refetchOnWindowFocus: true,
    // refetchInterval: 5000,
  });
};

// const usePostData = <T, D>(endpoint: string, data: D) => {
//   return useMutation({
//     queryKey: [endpoint],
//     queryFn: () => postData<T, D>(`${endpoint}/`, data),
//   })
//   return useQuery({
//     queryKey: [endpoint],
//     queryFn: () => postData<T, D>(`${endpoint}/`, data),
//   });
// }

export { useGetData };
