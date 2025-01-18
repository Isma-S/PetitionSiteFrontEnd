import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardMedia, Paper, Typography } from '@mui/material';
import axios from "axios";
import NavigationBar from "./NavigationBar";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
    const userId = parseInt(localStorage.getItem("userId") || '0');
    const authToken = localStorage.getItem("authToken");

    const [ownerImage, setOwnerImage] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState({ email: '', firstName: '', lastName: '' });

    const URL = "http://localhost:4941/api/v1";

    useEffect(() => {
        if (userId) {
            const fetchOwnerImage = async () => {
                try {
                    const response = await axios.get(`${URL}/users/${userId}/image`);
                    setOwnerImage(response.data.url);
                } catch (error) {
                    console.error('Error fetching owner image:', error);
                }
            };

            const fetchUserInfo = async () => {
                try {
                    const response = await axios.get(`${URL}/users/${userId}`, {
                        headers: { 'Authorization': `Bearer ${authToken}` }
                    });
                    setUserInfo(response.data);
                } catch (error) {
                    console.error('Error fetching user info:', error);
                }
            };

            fetchOwnerImage();
            fetchUserInfo();
        }
    }, [userId, authToken]);

    const userCardStyles: React.CSSProperties = {
        display: "inline-block",
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '70%',
        height: '60%',
        margin: '0 auto',
        padding: "80px",
        textAlign: "center"
    };

    return (
        <Paper elevation={3} style={{ padding: "10px" }}>
            <NavigationBar />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Card sx={{ width: '95%' }}>
                    <CardContent>
                        <CardMedia
                            component="img"
                            sx={{
                                objectFit: "cover",
                                width: 100,
                                height: 100,
                            }}
                            src={ownerImage || '/default_owner_image.jpg'}
                            alt="Owner image"
                            onError={(e) => {
                                e.currentTarget.src = "/default_owner_image.jpg";
                            }}
                        />
                        <Typography variant="h5" component="h2" align="center" gutterBottom>
                            My Profile
                        </Typography>
                        {/* Add your profile information or content here */}
                    </CardContent>
                </Card>
            </div>

            <Card sx={userCardStyles}>
                <CardMedia
                    component="img"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        objectFit: "contain",
                        width: "15%",
                        height: "15%",
                        borderRadius: "50%",
                        margin: "auto",
                        textAlign: "center"
                    }}
                    src={ownerImage || "https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png"}
                    alt="Profile image"
                    onError={(e) => {
                        e.currentTarget.src = "https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png";
                    }}
                />
                <CardContent>
                    <Typography variant="h4">
                        First Name: {userInfo.firstName}
                    </Typography>
                    <Typography variant="h4">
                        Last Name: {userInfo.lastName}
                    </Typography>
                    <Typography variant="h4">
                        Email: {userInfo.email}
                    </Typography>
                </CardContent>
                <Button component={Link} to="/editProfile" sx={{ backgroundColor: 'gray', color: 'white' }}>
                    Edit my profile
                </Button>
            </Card>
        </Paper>
    );
};

export default Profile;
