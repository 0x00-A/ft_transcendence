import { useQuery } from '@tanstack/react-query';
import APIClient from './apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Generic GET request hook
// const useGetData = <T>(endpoint: string) => {
//   return useQuery<T, Error>([endpoint], () => APIClient.get<T>(endpoint), {
//     staleTime: 300000, // Optional: data is fresh for 5 minutes
//     cacheTime: 600000, // Optional: cache data for 10 minutes
//     onError: (error: any) => {
//       console.error("Error fetching data:", error.message);
//     },
//   });
// };

const useGetData = <T>(endpoint: string) => {
  return useQuery({
    queryKey: [endpoint],          // You can use endpoint as a unique key for this query
    queryFn: () => APIClient.get<T>(`${endpoint}/`),  // Specify the function to fetch data
    staleTime: 1000 * 60 * 5,      // Optional: Configure additional options like staleTime
  });
};

const usePostData = <T, D>(endpoint: string) => {
  const queryClient = useQueryClient();
  return useMutation<T, Error, D>(
    (data: D) => APIClient.post<T, D>(`${endpoint}/`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([endpoint]); // Optionally, refetch data after a successful mutation
      },
      onError: (error) => {
        console.error('Error posting data:', error.message);
      },
    }
  );
};

export { useGetData, usePostData };
