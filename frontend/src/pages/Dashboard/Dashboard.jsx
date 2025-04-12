import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import "./Dashboard.css";

const Dashboard = () => {
    const [healthRecords, setHealthRecords] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHealthRecords();
    }, []);

    const fetchHealthRecords = async () => {
        try {
            const response = await api.getUserHealthRecords();
            console.log("API Response:", response);

            const records = Array.isArray(response.records) ? response.records : [];

            const processedRecords = records.map(record => {
                const riskAssessment = record.riskAssessment || {};

                return {
                    ...record,
                    results: {
                        cardiovascular: {
                            risk_score: riskAssessment?.cardiovascular?.risk_score ?? "N/A",
                            risk_level: riskAssessment?.cardiovascular?.risk_level ?? "N/A",
                            recommendations: riskAssessment?.cardiovascular?.recommendations || []
                        },
                        diabetes: {
                            risk_score: riskAssessment?.diabetes?.risk_score ?? "N/A",
                            risk_level: riskAssessment?.diabetes?.risk_level ?? "N/A",
                            recommendations: riskAssessment?.diabetes?.recommendations || []
                        },
                        kidney_stone: {
                            risk_score: riskAssessment?.kidney_stone?.risk_score ?? "N/A",
                            risk_level: riskAssessment?.kidney_stone?.risk_level ?? "N/A",
                            recommendations: riskAssessment?.kidney_stone?.recommendations || []
                        }
                    }
                };
            });

            setHealthRecords(processedRecords);
        } catch (err) {
            console.error("Error fetching health records:", err);
            setError("Failed to fetch health records.");
        } finally {
            setLoading(false);
        }
    };

    const handleNewAssessment = () => {
        navigate('/health-form');
    };

    const formatRiskScore = (score) => {
        if (score === "N/A") return "N/A";
        const numScore = Number(score);
        return !isNaN(numScore) ? `${numScore.toFixed(1)}%` : "N/A";
    };

    const getRiskLevelClass = (level) => {
        if (!level || level === "N/A") return "risk-unknown";
        switch (level.toLowerCase()) {
            case 'low': return "risk-low";
            case 'medium': return "risk-medium";
            case 'high': return "risk-high";
            default: return "risk-unknown";
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="dashboard">
            <h2>Health Risk Assessments</h2>
            <button onClick={handleNewAssessment}>New Assessment</button>

            {healthRecords.length === 0 ? (
                <p>No records found. Please complete a health assessment.</p>
            ) : (
                healthRecords.map((record, index) => (
                    <div key={index} className="record-card">
                        <h3>{record.createdAt ? new Date(record.createdAt).toLocaleString() : "Unknown Date"}</h3>

                        {["cardiovascular", "diabetes", "kidney_stone"].map((category) => (
                            <div key={category} className="record-section">
                                <h4>{category.replace("_", " ").toUpperCase()}</h4>
                                <p>Risk Score: {formatRiskScore(record.results?.[category]?.risk_score)}</p>
                                <p className={getRiskLevelClass(record.results?.[category]?.risk_level)}>
                                    Risk Level: {record.results?.[category]?.risk_level || "N/A"}
                                </p>
                                <p>Recommendations:</p>
                                <ul>
                                    {(record.results?.[category]?.recommendations || []).map((rec, idx) => (
                                        <li key={idx}>{rec}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    );
};

export default Dashboard;
