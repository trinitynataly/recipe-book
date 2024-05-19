import { decodeToken } from './auth';

const getUser = () => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    const decodedToken = decodeToken(token);
    const user = decodedToken ? decodedToken.user : null;
    return user;
}
export default getUser;