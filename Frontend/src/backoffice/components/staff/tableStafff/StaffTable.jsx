import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';


import './StaffTable.scss'

const StaffTable = () => {

  const navigate = useNavigate();

  const [staffUsers, setStaffUsers] = useState([]);

  useEffect(() => {
    // Fetch company users from the server
    axios.get('http://localhost:3700/users/users/Staff')
      .then(response => setStaffUsers(response.data))
      .catch(error => console.error('Error fetching staff users:', error));
  }, []);

  const handleDelete = async (userId) => {
    try {
      // Make an HTTP request to delete the user with userId
      const response = await axios.delete(`http://localhost:3700/users/deleteUtilisateur/${userId}`);

      if (response.status === 204) {
        // User deleted successfully, update the state or fetch the updated user list
        console.log('User deleted successfully');

        // Fetch the updated user list or update the state as needed
        const updatedUsers = staffUsers.filter((user) => user._id !== userId);
        setStaffUsers(updatedUsers);
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error.message);
    }
  };


  const handleUpdate = (userId) => {
    navigate(`/admin/users/updateStaff/${userId}`); // Navigation vers la page de mise à jour avec l'ID de l'utilisateur
  };

  const columns = [
    { field: 'nom', headerName: 'Last Name', flex: 1 },
    { field: 'prenom', headerName: 'First Name', flex: 1 },
    { field: 'mail', headerName: 'Email', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            onClick={() => handleUpdate(params.row._id)} // Appel de la fonction handleUpdate avec l'ID de l'utilisateur
          >
            Update
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleDelete(params.row._id)}
          >
            Delete
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <div style={{ marginTop: '5%', marginLeft: '2%' }}>
      <h2>Staff Users</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>

      <Button
  variant="contained"
  onClick={() => navigate('/admin/users/newStaff')} 
  
  color="success"
  style={{ marginLeft: 'auto', marginRight: '2%' }}
>
  Ajouter
</Button>

      </div>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={staffUsers}
          columns={columns}
          pageSize={5}
          getRowId={(row) => row._id} // Specify the ID field
        />
      </div>
    </div>
  );
};

export default StaffTable;
