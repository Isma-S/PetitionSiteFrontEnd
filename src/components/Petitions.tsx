import axios from 'axios';
import React, { useEffect, useState, ChangeEvent } from "react";
import CSS from 'csstype';
import {
    Paper,
    Typography,
    Pagination,
    FormControl,
    InputLabel,
    OutlinedInput,
    MenuItem,
    Chip,
    Select,
    Button,
    SelectChangeEvent,
    TableRow,
    TableCell,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    CardMedia
} from "@mui/material";
import NavigationBar from "./NavigationBar";
import { useLocation } from "react-router-dom";

interface Petition {
    petitionId: number,
    title: string,
    categoryId: number,
    creationDate: string,
    ownerId: number,
    ownerFirstName: string,
    ownerLastName: string,
    numberOfSupporters: number,
    supportingCost: number,
    imageUrl?: string,
}

interface Categories {
    categoryId: number,
    name: string
}

const RowsPerPage = 10;

const PetitionList = () => {
    const [petitions, setPetitions] = useState<Petition[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [query, setQuery] = useState<string>(new URLSearchParams(useLocation().search).get("q") || '');
    const [categoryIds, setCategoryIds] = useState<number[]>([]);
    const [supportingCost, setSupportingCost] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState<string>('');
    const [selectedSortOption, setSelectedSortOption] = useState<string>("");
    const [categories, setCategories] = useState<Categories[]>([]);

    const apiURL = "https://petitionsitebackend-production.up.railway.app/api/v1";

    useEffect(() => {
        getPetitions();
    }, [query, categoryIds, supportingCost, sortBy]);

    useEffect(() => {
        getCategories();
    }, []);

    const card: CSS.Properties = {
        padding: "60px",
        margin: "20px",
        display: "block",
        width: "90%"
    };

    const getPetitions = () => {
        axios.get(`${apiURL}/petitions`, {
            params: {
                q: query || undefined,
                categoryIds: categoryIds.length ? categoryIds : undefined,
                supportingCost: supportingCost || undefined,
                sortBy: sortBy || undefined,
            }
        })
            .then((response) => {
                setErrorFlag(false);
                setErrorMessage("");
                setPetitions(response.data.petitions);
            })
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            });
    };

    const getCategories = () => {
        axios.get(`${apiURL}/petitions/categories`)
            .then((response) => {
                setErrorFlag(false);
                setErrorMessage("");
                setCategories(response.data);
            })
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            });
    };

    const handleInputChange = (event: { target: { value: string; }; }) => {
        setQuery(event.target.value);
    };

    const handleSortChange = (event: SelectChangeEvent<string>) => {
        setSortBy(event.target.value);
        setSelectedSortOption(event.target.value);
    };

    const handlePageChange = (event: ChangeEvent<unknown>, newPage: number) => {
        setCurrentPage(newPage - 1);
    };

    const handleCategoryChange = (event: any) => {
        setCategoryIds(event.target.value);
    };

    const handleCategoryDelete = (categoryIdToRemove: number) => {
        setCategoryIds((prevCategoryIds) => prevCategoryIds.filter(id => id !== categoryIdToRemove));
    };

    const handleSupportingCostChange = (event: any) => {
        setSupportingCost(event.target.value ? Number(event.target.value) : null);
    };

    const getFileImagePath = (petitionId: number) => {
        return `${apiURL}/petitions/${petitionId}/image`;
    };

    const getOwnerImage = (ownerId: number) => {
        return `${apiURL}/users/${ownerId}/image`;
    };

    const handlePetitionClick = (petitionId: number) => {
        window.location.href = `http://localhost:4942/petition/${petitionId}`;
    };

    const petitionRows = (startIndex: number, endIndex: number) => {
        return petitions.slice(startIndex, endIndex).map((row: Petition) => (
            <TableRow hover tabIndex={-1} key={row.petitionId} onClick={() => handlePetitionClick(row.petitionId)}>
                <TableCell>{row.petitionId}</TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.ownerFirstName}</TableCell>
                <TableCell>{row.ownerLastName}</TableCell>
                <TableCell>{row.numberOfSupporters}</TableCell>
                <TableCell>{row.creationDate}</TableCell>
                <TableCell>{row.categoryId}</TableCell>
                <TableCell>{row.supportingCost}</TableCell>
                <TableCell>
                    <CardMedia
                        component="img"
                        sx={{ objectFit: "cover", width: 100, height: 100 }}
                        src={getOwnerImage(row.ownerId)}
                        alt="Owner image"
                    />
                </TableCell>
                <TableCell>
                    <CardMedia
                        component="img"
                        sx={{ objectFit: "cover", width: 100, height: 100 }}
                        src={getFileImagePath(row.petitionId)}
                        alt="Petition image"
                    />
                </TableCell>
            </TableRow>
        ));
    };

    return (
        <div>
            <NavigationBar />
            <Paper elevation={3} style={card}>


                


                <Typography variant="h4" align="center" gutterBottom>Petitions</Typography>
                <FormControl sx={{ margin: '10px', minWidth: 120 }}>
                    <InputLabel id="select-multiple-chip-label">Select Categories</InputLabel>
                    <Select
                        labelId="select-multiple-chip-label"
                        id="select-multiple-chip"
                        multiple
                        value={categoryIds}
                        onChange={handleCategoryChange}
                        renderValue={(selected) => (
                            <div>
                                {(selected as number[]).map((categoryId) => {
                                    const category = categories.find(cat => cat.categoryId === categoryId);
                                    return <Chip
                                        key={categoryId}
                                        label={category ? category.name : 'Unknown'}
                                        onDelete={() => handleCategoryDelete(categoryId)}
                                    />;
                                })}
                            </div>
                        )}
                    >
                        {categories.map((category) => (
                            <MenuItem key={category.categoryId} value={category.categoryId}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ margin: "0px 5px", width: '200px', height: '60px' }}>
                    <InputLabel id="sort-by-label">Sort By</InputLabel>
                    <Select
                        labelId="sort-by-label"
                        id="sort-by"
                        value={selectedSortOption}
                        onChange={handleSortChange}
                        input={<OutlinedInput label="Sort By" />}
                    >
                        <MenuItem value={'ALPHABETICAL_ASC'}>Title (A-Z)</MenuItem>
                        <MenuItem value={'ALPHABETICAL_DESC'}>Title (Z-A)</MenuItem>
                        <MenuItem value={'COST_ASC'}>Cost (Lowest to Highest)</MenuItem>
                        <MenuItem value={'COST_DESC'}>Cost (Highest to Lowest)</MenuItem>
                        <MenuItem value={'CREATED_ASC'}>Date (Oldest to Newest)</MenuItem>
                        <MenuItem value={'CREATED_DESC'}>Date (Newest to Oldest)</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ margin: "0px 5px", width: "200px", height: "60px" }}>
                    <InputLabel id="supporting-cost-label">Supporting Cost</InputLabel>
                    <OutlinedInput
                        id="supporting-cost-input"
                        value={supportingCost || ""}
                        onChange={handleSupportingCostChange}
                        type="number"
                        startAdornment={<span>$</span>}
                        label="Supporting Cost"
                    />
                </FormControl>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Petition ID</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Owner First Name</TableCell>
                                <TableCell>Owner Last Name</TableCell>
                                <TableCell>Number of Supporters</TableCell>
                                <TableCell>Creation Date</TableCell>
                                <TableCell>Category ID</TableCell>
                                <TableCell>Supporting Cost</TableCell>
                                <TableCell>Owner Image</TableCell>
                                <TableCell>Petition Image</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {petitionRows(currentPage * RowsPerPage, (currentPage + 1) * RowsPerPage)}
                        </TableBody>
                    </Table>
                    <Pagination
                        count={Math.ceil(petitions.length / RowsPerPage)}
                        page={currentPage + 1}
                        onChange={handlePageChange}
                    />
                </TableContainer>
            </Paper>
        </div>
    );
};

export default PetitionList;
