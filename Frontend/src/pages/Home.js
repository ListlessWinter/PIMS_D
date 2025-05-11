import React, { useEffect, useState, useRef } from "react";
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
  const [sortOrder, setSortOrder] = useState("asc"); // or "desc"
  const [sortType, setSortType] = useState("az");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isEditable, setIsEditable] = useState(false);
  const [originalItem, setOriginalItem] = useState(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const openModal = (item) => {
    setOriginalItem({ ...item }); // Save original
    setForm(item); 
    setEditingId(item._id);
    setIsEditable(false); // View-only mode by default
    setShowModal(true);
  };

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

      // Refresh item list with updated version
      await fetchItems();

      if (editingId) {
        // After update, switch back to view mode
        setIsEditable(false);
      } else {
        // After add, close modal and reset form
        setShowModal(false);
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
      }

    } catch (err) {
      console.error("Error saving item:", err);
    }
  };

  const handleEdit = (item) => {
    setOriginalItem({ ...item }); // Save original
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
    setIsEditable(false); // Start in view mode
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
    setEditingId(null);            // Make sure we're not editing
    setOriginalItem(null);         // Clear original item
    setIsEditable(true);           // Allow immediate input
    setShowModal(true);            // Show the modal
  };

  const handleCloseModal = () => {
    if (editingId && originalItem) {
      // Revert form to original data in edit mode
      setForm({
        medicineId: originalItem.medicineId,
        name: originalItem.name,
        brand: originalItem.brand,
        dosageForm: originalItem.dosageForm,
        quantity: originalItem.quantity,
        price: originalItem.price,
        expirationDate: originalItem.expirationDate?.split("T")[0] || "",
        prescriptionRequired: originalItem.prescriptionRequired,
        description: originalItem.description,
      });
      setIsEditable(false); // Back to view mode
    } else {
      // In add mode, just close and reset
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
      setIsEditable(false);
      setOriginalItem(null);
      setShowModal(false);
    }

    setShowModal(false); // Finally close modal
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
            <div className="profile"></div>
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
                <h2>{editingId ? "Item Details" : "Add Item"}</h2>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="medicineId"
                    placeholder="Medicine ID"
                    value={form.medicineId}
                    onChange={handleChange}
                    readOnly={!isEditable}
                    required
                  />
                  <input
                    type="text"
                    name="name"
                    placeholder="Medicine Name"
                    value={form.name}
                    onChange={handleChange}
                    readOnly={!isEditable}
                    required
                  />
                  <input
                    type="text"
                    name="brand"
                    placeholder="Brand"
                    value={form.brand}
                    onChange={handleChange}
                    readOnly={!isEditable}
                    required
                  />
                  <input
                    type="text"
                    name="dosageForm"
                    placeholder="Dosage Form (e.g., tablet)"
                    value={form.dosageForm}
                    onChange={handleChange}
                    readOnly={!isEditable}
                    required
                  />
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    readOnly={!isEditable}
                    min={1}
                    required
                  />
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={form.price}
                    onChange={handleChange}
                    readOnly={!isEditable}
                    min={0}
                    required
                  />
                  <input
                    type="date"
                    name="expirationDate"
                    placeholder="Expiration Date"
                    value={form.expirationDate}
                    onChange={handleChange}
                    readOnly={!isEditable}
                    required
                  />
                  <label>
                    <input
                      type="checkbox"
                      name="prescriptionRequired"
                      checked={form.prescriptionRequired}
                      onChange={(e) =>
                        setForm({ ...form, prescriptionRequired: e.target.checked })
                      }
                      disabled={!isEditable}
                    />
                    Prescription Required
                  </label>
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    readOnly={!isEditable}
                  />

                  {/* Conditionally render buttons */}
                  {editingId ? (
                    isEditable ? (
                      <>
                        <button className="Add-Update" type="submit">Update</button>
                        <button
                          className="Delete"
                          type="button"
                          onClick={() => {
                            handleDelete(editingId);
                            setShowModal(false);
                          }}
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <button type="button" onClick={() => setIsEditable(true)} className="Edit">
                        Edit
                      </button>
                    )
                  ) : (
                    <>
                      <button className="Add-Update" type="submit">Add</button>
                    </>
                  )}

                  <button className="Close" type="button" onClick={handleCloseModal}>
                    Close
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Inventory List */}
          <section>
            <div className="DataName">
              <h2 className="Data_Label">DATA</h2>
              <div className="dropdown" ref={dropdownRef}>
                <button className="Sort" onClick={toggleDropdown}>SORT ▾</button>
                {dropdownOpen && (
                  <div className="SortContent">
                    <label className="SortBox">
                      <input
                        type="checkbox"
                        checked={sortType === "az"}
                        onChange={() => setSortType("az")}
                      />
                      Medicine name A - Z
                    </label>
                    <label className="SortBox">
                      <input
                        type="checkbox"
                        checked={sortType === "za"}
                        onChange={() => setSortType("za")}
                      />
                      Medicine name Z - A
                    </label>
                    <label className="SortBox">
                      <input
                        type="checkbox"
                        checked={sortType === "closest"}
                        onChange={() => setSortType("closest")}
                      />
                      Medicine closest to expire
                    </label>
                    <label className="SortBox">
                      <input
                        type="checkbox"
                        checked={sortType === "farthest"}
                        onChange={() => setSortType("farthest")}
                      />
                      Medicine farthest to expire
                    </label>
                  </div>
                )}
              </div>
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
                      <th>STOCKS</th>
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
                        .sort((a, b) => {
                          switch (sortType) {
                            case "az":
                              return a.name.localeCompare(b.name);
                            case "za":
                              return b.name.localeCompare(a.name);
                            case "closest":
                              return new Date(a.expirationDate) - new Date(b.expirationDate);
                            case "farthest":
                              return new Date(b.expirationDate) - new Date(a.expirationDate);
                            default:
                              return 0;
                          }
                        })
                        .map((item) => (
                          <tr key={item._id} onClick={() => handleEdit(item)} style={{ cursor: "pointer" }}>
                            <td>{item.medicineId}</td>
                            <td>{item.name}</td>
                            <td>{item.brand}</td>
                            <td>{item.dosageForm}</td>
                            <td>{item.quantity}</td>
                            <td>${item.price}</td>
                            <td>{item.expirationDate?.split("T")[0]}</td>
                            <td>{item.prescriptionRequired ? "Yes" : "No"}</td>
                            <td>{item.description}</td>
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