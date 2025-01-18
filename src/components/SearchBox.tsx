import React, { useState } from 'react';
import { TextField } from '@mui/material';

const SearchBox = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div>
            <TextField
                label="Search"
                variant="outlined"
                value={searchTerm}
                // onChange={handleSearch}
            />
        </div>
    );
}

export default SearchBox;
