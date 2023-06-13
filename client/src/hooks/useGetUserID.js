import Cookies from 'js-cookie';

export const useGetUserID = () => {
  return Cookies.get('userID');
};