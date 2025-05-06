import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './HomePage.css';

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
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

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
      const res = await fetch("https://pims-d.onrender/inventory");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
  
    const transformedValue =
      type === "checkbox"
        ? e.target.checked
        : typeof value === "string"
        ? value.toUpperCase()
        : value;
  
    setForm({ ...form, [name]: transformedValue });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `https://pims-d.onrender/inventory/${editingId}`
      : `https://pims-d.onrender/inventory`;

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
      setShowModal(false); // Close the modal after submit
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
    setShowModal(true);
  };
  

  const handleDelete = async (id) => {
    try {
      await fetch(`https://pims-d.onrender/inventory/${id}`, {
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

  const handleAddItemClick = () => {
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
    setShowModal(true); // Open modal for adding new item
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close modal
  };

  return (
    <div className="container">
        {/* Sidebar (Dashboard) */}
        <div className="sidebar">
          <h2>Dashboard</h2>
          <ul>
            <li>Dashboard Overview</li>
            <li>Item Management</li>
            <li>Reports</li>
            <li>Settings</li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Modal (Form) */}
          {showModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>{editingId ? "Edit Item" : "Add New Item"}</h2>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="medicineId"
                    placeholder="Medicine ID"
                    value={form.medicineId}
                    onChange={handleChange}
                    required />
                  <input
                    type="text"
                    name="name"
                    placeholder="Medicine Name"
                    value={form.name}
                    onChange={handleChange}
                    required />
                  <input
                    type="text"
                    name="brand"
                    placeholder="Brand"
                    value={form.brand}
                    onChange={handleChange}
                    required />
                  <input
                    type="text"
                    name="dosageForm"
                    placeholder="Dosage Form (e.g., tablet)"
                    value={form.dosageForm}
                    onChange={handleChange}
                    required />
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                    min={1} />
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={form.price}
                    onChange={handleChange}
                    required
                    min={0} />
                  <input
                    type="date"
                    name="expirationDate"
                    placeholder="Expiration Date"
                    value={form.expirationDate}
                    onChange={handleChange}
                    required />
                  <label>
                    <input
                      type="checkbox"
                      name="prescriptionRequired"
                      checked={form.prescriptionRequired}
                      onChange={(e) => setForm({ ...form, prescriptionRequired: e.target.checked })} />
                    Prescription Required
                  </label>
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange} />
                  <button type="submit">{editingId ? "Update" : "Add"}</button>
                  <button type="button" onClick={handleCloseModal}>Close</button>

                  {/* Delete button only appears when editing */}
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        handleDelete(editingId);
                        setShowModal(false);
                      } }
                      style={{ backgroundColor: "red", color: "white", marginLeft: "10px" }}
                    >
                      Delete
                    </button>
                  )}
                </form>
              </div>
            </div>
          )}
          {/* Inventory List */}
          <section>
            <h2>DATA</h2>
            {loading ? (
              <p>Loading items...</p>
            ) : items.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>MEDICINE ID</th>
                    <th>NAME</th>
                    <th>BRAND</th>
                    <th>DOSAGE FORM</th>
                    <th>DOSAGE</th>
                    <th>PRICE</th>
                    <th>EXPIRATION DATE</th>
                    <th>PRESCRIPTION REQ.</th>
                    <th>DESCRIPTION</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item._id}>
                      <td>{item.medicineId}</td>
                      <td>{item.name}</td>
                      <td>{item.brand}</td>
                      <td>{item.dosageForm}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price}</td>
                      <td>{item.expirationDate?.split("T")[0]}</td>
                      <td>{item.prescriptionRequired ? "Yes" : "No"}</td>
                      <td>{item.description}</td>
                      <td>
                        <button onClick={() => handleEdit(item)}>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No inventory items found.</p>
            )}
          </section>
          <div className="add-button-container">
            <button onClick={handleAddItemClick}>Add</button>
          </div>

        </div>
      </div>
  );
}