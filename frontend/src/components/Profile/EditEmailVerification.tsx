import apiClient from '@/api/apiClient';
import axios from 'axios';
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditEmailVerification = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {

        const verifyEmail = async () => {
            if (token) {
                if (!/^[a-zA-Z0-9\-_:]+$/.test(token)) {
                    toast.error('Invalid token');
                    navigate('/profile');
                }
                try {
                    const response = await apiClient.put(, { token });
                    toast.success(response.data.message);
                    navigate('/auth');
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        toast.error(error?.response?.data.error);
                    }
                    else {
                        toast.error('Something went wrong!');
                    }
                    navigate('/auth');
                }
            }
        };
        verifyEmail();
    }, [token, navigate]);

  return (
    <div>
        verifying your email...
    </div>
  )
}

export default EditEmailVerification
