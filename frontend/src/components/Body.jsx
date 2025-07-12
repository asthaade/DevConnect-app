import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';
import { addUser } from '../utils/userSlice';
import Footer from './Footer';
import NavBar from './NavBar';

const  Body = () => {

    const userData = useSelector((store) => store.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const fetchUser = async() =>{

        if (userData) return;
        try{
            const res = await axios.get(BASE_URL + "/profile/view", {
                withCredentials: true,
            });

            dispatch(addUser(res.data));
        }catch(err){
            if(err.status === 401){
                navigate("/login");
            }
            console.log(err);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);


    return (
    <div>
        <NavBar/>
        <Outlet/>
        <Footer/>
    </div>
    )
}

export default Body;