import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5001/puppies';

export default function App() {
  const [puppies, setPuppies] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age_est: '',
    current_kennel_number: ''
  });
  const [editingPuppy, setEditingPuppy] = useState(null);
  const [editedFields, setEditedFields] = useState({});

  useEffect(() => {
    fetchPuppies();
  }, []);

  const fetchPuppies = async () => {
    try {
      const response = await axios.get(API_URL);
      setPuppies(response.data);
    } catch (error) {
      console.error('Error fetching puppies:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addPuppy = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData);
      fetchPuppies(); // Refresh the puppy list
      setFormData({ name: '', breed: '', age_est: '', current_kennel_number: '' }); // Clear the form
    } catch (error) {
      console.error('Error adding puppy:', error);
    }
  };

  const startEditing = (puppy) => {
    setEditingPuppy(puppy.pet_id); // Set the puppy being edited
    setEditedFields(puppy); // Initialize the edited fields with the puppy data
  };

  const handleEditInputChange = (e, field) => {
    const { value } = e.target;
    setEditedFields({ ...editedFields, [field]: value });
  };

  const saveChanges = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}`, editedFields);
      fetchPuppies(); // Refresh the puppy list
      setEditingPuppy(null); // Exit editing mode
    } catch (error) {
      console.error('Error updating puppy:', error);
    }
  };

  const cancelEditing = () => {
    setEditingPuppy(null); // Exit editing mode without saving
  };

  const deletePuppy = async (id) => {
    if (!window.confirm('Are you sure you want to delete this puppy?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchPuppies(); // Refresh the puppy list
    } catch (error) {
      console.error('Error deleting puppy:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Puppy Management App</h1>

      {/* Puppy Form */}
      <form onSubmit={addPuppy} style={styles.form}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Name"
          required
        />
        <input
          type="text"
          name="breed"
          value={formData.breed}
          onChange={handleInputChange}
          placeholder="Breed"
        />
        <input
          type="number"
          name="age_est"
          value={formData.age_est}
          onChange={handleInputChange}
          placeholder="Age"
        />
        <input
          type="number"
          name="current_kennel_number"
          value={formData.current_kennel_number}
          onChange={handleInputChange}
          placeholder="Kennel #"
        />
        <button type="submit">Add Puppy</button>
      </form>

      {/* Puppy Table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Breed</th>
            <th>Age</th>
            <th>Kennel #</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {puppies.length > 0 ? (
            puppies.map((puppy) => (
              <tr key={puppy.pet_id}>
                <td>{puppy.pet_id}</td>
                <td>
                  {editingPuppy === puppy.pet_id ? (
                    <input
                      type="text"
                      value={editedFields.name}
                      onChange={(e) => handleEditInputChange(e, 'name')}
                    />
                  ) : (
                    puppy.name
                  )}
                </td>
                <td>
                  {editingPuppy === puppy.pet_id ? (
                    <input
                      type="text"
                      value={editedFields.breed}
                      onChange={(e) => handleEditInputChange(e, 'breed')}
                    />
                  ) : (
                    puppy.breed || 'N/A'
                  )}
                </td>
                <td>
                  {editingPuppy === puppy.pet_id ? (
                    <input
                      type="number"
                      value={editedFields.age_est}
                      onChange={(e) => handleEditInputChange(e, 'age_est')}
                    />
                  ) : (
                    puppy.age_est || 'N/A'
                  )}
                </td>
                <td>
                  {editingPuppy === puppy.pet_id ? (
                    <input
                      type="number"
                      value={editedFields.current_kennel_number}
                      onChange={(e) => handleEditInputChange(e, 'current_kennel_number')}
                    />
                  ) : (
                    puppy.current_kennel_number || 'N/A'
                  )}
                </td>
                <td>
                  {editingPuppy === puppy.pet_id ? (
                    <>
                      <button onClick={() => saveChanges(puppy.pet_id)} style={styles.button}>Save</button>
                      <button onClick={cancelEditing} style={styles.button}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEditing(puppy)} style={styles.button}>Edit</button>
                      <button onClick={() => deletePuppy(puppy.pet_id)} style={{ ...styles.button, backgroundColor: 'red' }}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No puppies found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Basic Styling
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
  },
  form: {
    marginBottom: '20px',
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  button: {
    margin: '0 5px',
    padding: '5px 10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
};
