import React, { useEffect, useState, useRef } from "react";
import { fetchInventory } from "../api/inventoryAPI";
import html2pdf from "html2pdf.js";
import "./InventoryList.css";

export default function InventoryList({ searchQuery = "" }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef();

  const loadInventory = async () => {
    try {
      const response = await fetchInventory();
      setTimeout(() => {
        setPrescriptions(response.data);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to load inventory.", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleItemClick = (prescription) => {
    setSelectedPrescription(prescription);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedPrescription(null);
  };

  const handleDownloadPDF = () => {
    if (!popupRef.current) return;

    const options = {
      margin: 0.5,
      filename: `Prescription-${selectedPrescription?.name || "Patient"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(options).from(popupRef.current).save();
  };

  const filteredPrescriptions = prescriptions.filter((prescription) =>
    prescription.doctorInformation?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="inventory-container">
      {loading ? (
        <div className="skeleton-list">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="skeleton-item" style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="skeleton-line skeleton-name"></div>
              <div className="skeleton-line skeleton-date"></div>
            </div>
          ))}
        </div>
      ) : filteredPrescriptions.length === 0 ? (
        <p className="NoItemsFound">No items found.</p>
      ) : (
        <div>
          <div className="inventory-list">
            {filteredPrescriptions.map((prescription, index) => (
              <div
                key={prescription._id}
                className="inventory-item fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleItemClick(prescription)}
              >
                <div className="item-content">
                  <span className="doctor-name">{prescription.doctorInformation || "Unknown Doctor"}</span>
                  <span className="prescription-date">
                    {prescription.dateOfPrescription || "No Date"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {showPopup && (
            <div className="popup-overlay">
              <div className="popup-content" ref={popupRef}>
                <div className="LogoPre">
                  <div className="Logos"></div>
                  <div className="Docname">{selectedPrescription.doctorInformation}</div>
                  <div className="Hospital">General Doctor, St. Ignatius Medical Center</div>
                </div>
                <div className="BodyPre">
                  <div className="Box">
                    <div className="box1">
                      <h5>NAGA CITY</h5>
                      <div className="Smol">St. Ignatius Medical</div>
                      <div className="Smol1">Naga City, 4400</div>
                      <div className="Smol1">Philippines</div>
                    </div>
                    <div className="box2">
                      <h5>CONTACT INFORMATION</h5>
                      <div className="Smol">ignatiusmedicalcenter@gmail.com</div>
                      <div className="Smol1">0912 345 6789</div>
                      <div className="Smol1">(2) 123 456 78</div>
                    </div>
                  </div>
                  <div className="Box11">
                    <h4>Name:</h4>
                    <div className="NAme">{selectedPrescription.name}</div>
                    <h4>Age:</h4>
                    <div className="Age">{selectedPrescription.age}</div>
                    <h4>Sex:</h4>
                    <div className="Sex">{selectedPrescription.gender}</div>
                  </div>
                  <p><strong>Inscription:</strong></p>
                  {Array.isArray(selectedPrescription.inscription) && selectedPrescription.inscription.length > 0 ? (
                    <ul className="Inscription">
                      {selectedPrescription.inscription.map((med, idx) => (
                        <li key={idx}>
                          {med.name} - {med.dosage}, {med.frequency}x/day, Qty: {med.quantity}
                        </li>
                      ))}
                    </ul>
                  ) : "N/A"}
                </div>
                <div className="FooterPre">
                  <h4>{selectedPrescription.doctorInformation}</h4>
                  <div className="no">LICENSE NO. <div>123456</div></div>
                  <div className="no1">PTR NO. <div>7891011</div></div>
                </div>
                <button className="close-btn" onClick={closePopup}>Close</button>
                <button className="download-btn" onClick={handleDownloadPDF}>Download Prescription</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}