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
  const [searchQuery, setSearchQuery] = useState("");

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
      ? `https://pims-d.onrender.com/inventory/${editingId}`
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
          <div className="Logo-Sidebar"></div>
          <h2>Main</h2>
          <ul>
            <li>Dashboard</li>
            <li>Data</li>
          </ul>
          <h2>Support</h2>
          <ul>
            <li>Reports</li>
            <li>Settings</li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="Right-content">
        <div className="Header">
          <div className="Profile-box">
            <div className="profile">

            </div>
            <div className="Profile-Logout">
            <button className=" Logout" onClick={handleLogout}>Log out</button>
            </div>
          </div>
        </div>

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
                  <button className="Add-Update" type="submit">{editingId ? "Update" : "Add"}</button>
                  <button className= "Close" type="submit" onClick={handleCloseModal}>Close</button>

                  {/* Delete button only appears when editing */}
                  {editingId && (
                    <button className="Delete"
                      type="Submit"
                      onClick={() => {
                        handleDelete(editingId);
                        setShowModal(false);
                      } }
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
          <div className="DataName">
            <h2 className="Data_Label">DATA</h2>
            <div className="Sort"> Sort </div>
            <div className="Search">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

            {loading ? (
              <p>Loading items...</p>
            ) : items.length > 0 ? (
              <div className="Boxtable">
              <table>
                <thead className="DataName2">
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
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                {items.filter((item) => {
                  const q = searchQuery.toLowerCase();
                    return (
                      item.name.toLowerCase().includes(q) ||
                      item.brand.toLowerCase().includes(q) ||
                      item.medicineId.toLowerCase().includes(q)
                    );
                  }).length > 0 ? (
                    items
                    .filter((item) => {
                     const q = searchQuery.toLowerCase();
                    return (
                    item.name.toLowerCase().includes(q) ||
                    item.brand.toLowerCase().includes(q) ||
                    item.medicineId.toLowerCase().includes(q)
                  );
                  })
                  .map((item) => (
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
                        <button className="Edit" onClick={() => handleEdit(item)}>Edit</button>
                      </td>
                    </tr>
                    ))
                  ) : (
                  <tr>
                    <td colSpan="10" style={{ textAlign: "center", padding: "1rem", color: "gray" }}>
                      No data found.
                    </td>
                  </tr>
                )}
              </tbody>
              </table>
              </div>
            ) : (
              <p>No inventory items found.</p>
            )}
          </section>
        </div>
        <div className="Footer">
          <div className="add">
          <button onClick={handleAddItemClick} className="add-button-container">Add</button>
          </div>
        </div>
      </div>
      </div>
  );
}