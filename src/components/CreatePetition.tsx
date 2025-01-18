import React, { useState } from 'react';
import { Button, Card, CardContent, Paper, TextField } from '@mui/material';
import axios from "axios";
import NavigationBar from "./NavigationBar";
import { useNavigate } from "react-router-dom";

const CreatePetition = () => {
    const [petition, setPetition] = useState({
        title: '',
        description: '',
        categoryId: '',
        supportTiers: [''],
        image: null,
    });

    const [errors, setErrors] = useState({
        title: '',
        description: '',
        categoryId: '',
        supportTiers: '',
        image: '',
    });

    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (event:any) => {
        const { name, value } = event.target;
        setPetition(prevPetition => ({
            ...prevPetition,
            [name]: value
        }));
    };

    const handleImageChange = (event:any) => {
        const file = event.target.files[0];
        setPetition(prevPetition => ({
            ...prevPetition,
            image: file
        }));
    };

    const handleSubmit = async (event:any) => {
        event.preventDefault();

        try {
            const formData = new FormData();
            formData.append('title', petition.title);
            formData.append('description', petition.description);
            formData.append('categoryId', petition.categoryId);
            petition.supportTiers.forEach((tier, index) => {
                formData.append(`supportTiers[${index}]`, tier);
            });
            // formData.append('image', petition.image);

            const response = await axios.post("http://localhost:4941/api/v1/petitions", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 201) {
                // Petition created successfully, navigate to the petitions page or any other desired route
                navigate('/petitions');
            }
        } catch (error) {
            console.error('Petition creation failed:', error);
            setErrorMessage('Petition creation failed. Please try again.');
            setErrorFlag(true);
        }
    };

    return (
        <Paper elevation={3} style={{ padding: '150px' }}>
            <NavigationBar />
            <Card sx={{ width: '30%', margin: '20 auto', padding: "50px", textAlign: "center" }}>
                <CardContent>
                    <h2>Create Petition</h2>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Title"
                            type="text"
                            name="title"
                            value={petition.title}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Description"
                            type="text"
                            name="description"
                            value={petition.description}
                            onChange={handleChange}
                            fullWidth
                            required
                        />

                        <TextField
                            label="Category ID"
                            type="text"
                            name="categoryId"
                            value={petition.categoryId}
                            onChange={handleChange}
                            fullWidth
                            required
                        />

                        <div>
                            <label htmlFor="supportTiers">Support Tiers:</label>
                            {petition.supportTiers.map((tier, index) => (
                                <TextField
                                    key={index}
                                    type="text"
                                    value={tier}
                                    // onChange={(e) => handleSupportTierChange(e, index)}
                                    fullWidth
                                    required
                                />
                            ))}
                            {/*<Button onClick={addSupportTier}>Add Tier</Button>*/}
                        </div>

                        <div>
                            <label htmlFor="image">Image:</label>
                            <input
                                type="file"
                                id="image"
                                name="image"
                                accept="image/jpeg, image/png, image/gif"
                                onChange={handleImageChange}
                                required
                            />
                        </div>

                        <Button type="submit" variant="contained">
                            Create Petition
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Paper>
    );
};

export default CreatePetition;
