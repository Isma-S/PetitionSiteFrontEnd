import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Typography, Grid, Card, CardContent, CardMedia, Avatar } from '@mui/material';
import NavigationBar from "./NavigationBar";
import {isNumberObject} from "node:util/types";

const Petition = () => {
    const { id } = useParams<{ id: string }>();
    const petitionId: number | undefined = parseInt(id || '');

    const [petition, setPetition] = useState<any>(null);

    useEffect(() => {
        fetchPetitionDetails();
    }, []);

    const fetchPetitionDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:4941/api/v1/petitions/${id}`);
            setPetition(response.data);
        } catch (error) {
            console.error('Error fetching petition details:', error);
        }
    };
    let URL = "http://localhost:4941/api/v1"
    const getOwnerImage = (ownerId: number) => {
        return (URL +  '/users/' + ownerId + '/image')

    }
    const getFileImagePath = (petitionId: number) => {
        return `http://localhost:4941/api/v1/petitions/${petitionId}/image`;
    };

    return (
        <Grid container justifyContent="center">
            {/* NavigationBar outside of the main grid */}
            <NavigationBar />
            <Grid item xs={12} md={8}>
                {petition && (
                    <Card>
                        <CardMedia
                            component="img"
                            sx={{
                                objectFit: "cover",
                                width: 100,
                                height: 100,
                            }}
                            src={getFileImagePath(petitionId)}
                            alt="Petition image"
                        />
                        <CardContent>
                            <Typography variant="h4" gutterBottom>
                                {petition.title}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Creation Date: {petition.creationDate}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Description: {petition.description}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Owner: {petition.ownerFirstName} {petition.ownerLastName}
                            </Typography>
                            <CardMedia
                                component="img"
                                sx={{
                                    objectFit: "cover",
                                    width: 100,
                                    height: 100,
                                }}
                                src={getOwnerImage(petition.ownerId)}
                                alt="Owner image"
                            />
                            <Typography variant="body1" gutterBottom>
                                Number of Supporters: {petition.numberOfSupporters}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Total Money Raised: {petition.totalMoneyRaised}
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                List of Support Tiers:
                            </Typography>
                            {petition.supportTiers.map((tier: any) => (
                                <div key={tier.id}>
                                    <Typography variant="subtitle1">{tier.title}</Typography>
                                    <Typography variant="body2">Description: {tier.description}</Typography>
                                    <Typography variant="body2">Cost: {tier.cost}</Typography>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </Grid>
        </Grid>
    );

};

export default Petition;
