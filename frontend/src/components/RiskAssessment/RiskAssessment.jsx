import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './RiskAssessment.css';

const RiskAssessment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { assessmentData } = location.state || {};

    console.log("RiskAssessment Data:", assessmentData);

    if (!assessmentData || !assessmentData.results) {
        return (
            <div className="risk-assessment">
                <p>No assessment data available.</p>
                <button
                    className="back-button"
                    onClick={() => navigate('/dashboard')}
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    console.log("Complete Risk Assessment Data:", assessmentData.results);

    const getRiskColor = (level) => {
        if (!level) return '#3498db'; // default blue

        switch (level.toLowerCase()) {
            case 'low':
                return '#2ecc71'; // green
            case 'medium':
                return '#f1c40f'; // yellow
            case 'high':
                return '#e74c3c'; // red
            default:
                return '#3498db'; // blue default
        }
    };

    const calculateAngle = (score) => {
        if (score === "N/A" || score === null) return 0;
        const numScore = Number(score);
        return !isNaN(numScore) ? (numScore / 100) * 360 : 0;
    };

    const formatRiskScore = (score) => {
        if (score === "N/A" || score === null) return "N/A";
        const numScore = Number(score);
        return !isNaN(numScore) ? numScore.toFixed(1) : "N/A";
    };

    return (
        <div className="risk-assessment">
            <h2>Your Health Risk Assessment Results</h2>

            <div className="risk-cards">
                {Object.entries(assessmentData.results).map(([type, data]) => {
                    if (!data) return null;

                    const angle = calculateAngle(data.risk_score);
                    const riskColor = getRiskColor(data.risk_level);
                    const formattedScore = formatRiskScore(data.risk_score);

                    return (
                        <div key={type} className="risk-card">
                            <h3>{type.replace(/_/g, ' ').toUpperCase()}</h3>

                            <div className="risk-indicator">
                                <div
                                    className="risk-gauge"
                                    style={{
                                        background: `conic-gradient(${riskColor} ${angle}deg, #ecf0f1 ${angle}deg)`
                                    }}
                                >
                                    <div className="risk-percentage">
                                        {formattedScore === "N/A" ? "N/A" : `${formattedScore}%`}
                                    </div>
                                </div>
                                <p className="risk-level">
                                    Risk Level: <span style={{ color: riskColor, fontWeight: 'bold' }}>
                                        {(data.risk_level || "Unknown").toUpperCase()}
                                    </span>
                                </p>
                            </div>

                            <div className="recommendations">
                                <h4>Recommendations</h4>
                                {data.recommendations && data.recommendations.length > 0 ? (
                                    <ul>
                                        {data.recommendations.map((rec, index) => (
                                            <li key={index}>{rec}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No specific recommendations available.</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <button
                className="back-button"
                onClick={() => navigate('/dashboard')}
            >
                Back to Dashboard
            </button>
        </div>
    );
};

export default RiskAssessment;