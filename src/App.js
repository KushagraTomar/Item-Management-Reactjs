import React, { useState, useEffect } from "react";
import axios from "axios";
require('dotenv').config();

const App = () => {
  const BASE_URL = `${process.env.BASE_URL}`;
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", image: null });
  const [editingId, setEditingId] = useState(null);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${BASE_URL}:3001/items`);
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      if (editingId) {
        await axios.put(`${BASE_URL}:3001/item/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setEditingId(null);
      } else {
        await axios.post(`${BASE_URL}:3001/items`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setForm({ name: "", description: "", price: "", image: null });
      fetchItems();
    } catch (error) {
      console.error("Error submitting item:", error);
    }
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      image: null, // Image editing is optional, so we leave this blank
    });
    setEditingId(item._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}:3001/item/${id}`);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Item Manager</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleInputChange}
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
        />
        <button style={{marginLeft: 10}} type="submit">{editingId ? "Update" : "Add"} Item</button>
      </form>

      <ul>
        {items.map((item) => (
          <li key={item._id} style={{ marginBottom: "10px" }}>
            <strong>{item.name}</strong> - {item.description} - ${item.price}
            {item.image && (
              <div>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: "100px", height: "auto" }}
                />
              </div>
            )}
            <button onClick={() => handleEdit(item)} style={{ marginLeft: "10px" }}>
              Edit
            </button>
            <button onClick={() => handleDelete(item._id)} style={{ marginLeft: "10px" }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
