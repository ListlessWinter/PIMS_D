import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    medicineId: "",
    name: "",
    brand: "",
    dosageForm: "",
    quantity: "",
    price: "",
    expirationDate: "",
    prescriptionRequired: false,
    description: "",
  });
  
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchItems();
    }
  }, [navigate]);

  const fetchItems = async () => {
    try {
      const res = await fetch("https://pims-d.onrender.com/inventory");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `https://pims-d.onrender.com/api/inventory/${editingId}`
      : `https://pims-d.onrender.com/inventory`;

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      setForm({
        medicineId: "",
        name: "",
        brand: "",
        dosageForm: "",
        quantity: "",
        price: "",
        expirationDate: "",
        prescriptionRequired: false,
        description: "",
      });
      
      setEditingId(null);
      fetchItems();
    } catch (err) {
      console.error("Error saving item:", err);
    }
  };

  const handleEdit = (item) => {
  setForm({
    medicineId: item.medicineId,
    name: item.name,
    brand: item.brand,
    dosageForm: item.dosageForm,
    quantity: item.quantity,
    price: item.price,
    expirationDate: item.expirationDate?.split("T")[0] || "",
    prescriptionRequired: item.prescriptionRequired,
    description: item.description,
  });
  setEditingId(item._id);
};

  const handleDelete = async (id) => {
    try {
      await fetch(`https://pims-d.onrender.com/inventory/${id}`, { 
        method: "DELETE",
      });
      fetchItems();
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "auto" }}>
      <h1>Inventory Management</h1>
      <button onClick={handleLogout} style={{ marginBottom: "20px" }}>
        Logout
      </button>

      {/* Form Section */}
      <section style={{ marginBottom: "30px" }}>
        <h2>{editingId ? "Edit Item" : "Add New Item"}</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="medicineId" placeholder="Medicine ID" value={form.medicineId} onChange={handleChange} required />
          <input type="text" name="name" placeholder="Medicine Name" value={form.name} onChange={handleChange} required />
          <input type="text" name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} required />
          <input type="text" name="dosageForm" placeholder="Dosage Form (e.g., tablet)" value={form.dosageForm} onChange={handleChange} required />
          <input type="number" name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} required min={1} />
          <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} required min={0} />
          <input type="date" name="expirationDate" placeholder="Expiration Date" value={form.expirationDate} onChange={handleChange} required />
          <label>
          <input type="checkbox" name="prescriptionRequired" checked={form.prescriptionRequired} onChange={(e) => setForm({ ...form, prescriptionRequired: e.target.checked })} />
          Prescription Required
          </label>
          <input type="text" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <button type="submit">{editingId ? "Update" : "Add"}</button>
        </form>
      </section>

      {/* Inventory List */}
      <section>
        <h2>Items</h2>
        {loading ? (
          <p>Loading items...</p>
        ) : items.length > 0 ? (
          <ul>
  {items.map((item) => (
    <li key={item._id} style={{ marginBottom: "10px" }}>
      <strong>{item.name}</strong> (ID: {item.medicineId}) — {item.brand}, {item.dosageForm}, Qty: {item.quantity}, Price: ${item.price}  
      <br />
      Exp: {item.expirationDate?.split("T")[0]} | Rx: {item.prescriptionRequired ? "Yes" : "No"}  
      <br />
      {item.description}
      <button onClick={() => handleEdit(item)} style={{ marginLeft: "10px" }}>Edit</button>
      <button onClick={() => handleDelete(item._id)} style={{ marginLeft: "5px" }}>Delete</button>
    </li>
  ))}
</ul>

        ) : (
          <p>No inventory items found.</p>
        )}
      </section>
    </div>
  );
}
