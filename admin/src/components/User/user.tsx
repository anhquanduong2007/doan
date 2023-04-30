import * as React from 'react';
import { useAppSelector, useAppDispatch } from 'src/app/hooks';
import { useNavigate } from 'react-router-dom';


const User = () => {
    // const navigate = useNavigate();
    // const accessToken = useAppSelector((state) => state.auth.currentUser.accessToken);
    // const allUsers = useAppSelector((state) => state.user);
    // const GetAllUsers = async () => {
    //     return userApi.getAllUsers(accessToken)
    // }
    // console.log(accessToken)
    // React.useEffect(() => {
    //     if (accessToken !== '') {
    //         GetAllUsers()
    //     } else {
    //         navigate('/login');
    //     }
    // }, [])

    return (
        <div>
            User
        </div>
    );
};

export default User;