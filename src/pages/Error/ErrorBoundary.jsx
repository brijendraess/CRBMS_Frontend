import React from "react";

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f8f9fa",
    color: "#343a40",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    textAlign: "center",
  },
  miniContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100px",
    backgroundColor: "#f8f9fa",
    color: "#343a40",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(248, 14, 14, 0.56)",
    textAlign: "center",
    gap: "10px",
  },
  content: {
    maxWidth: "600px",
    padding: "20px",
    backgroundColor: "white",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
  },
  title: {
    fontSize: "3rem",
    fontWeight: "bold",
    color: "#d9534f",
    marginBottom: "10px",
  },
  message: {
    fontSize: "1.25rem",
    marginBottom: "20px",
    color: "#6c757d",
  },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px 20px",
    fontSize: "1rem",
    fontWeight: "bold",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

styles.button[":hover"] = {
  backgroundColor: "#0056b3",
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.content}>
            <h1 style={styles.title}>Oops!</h1>
            <p style={styles.message}>Something went wrong.</p>
            <div style={styles.miniContainer}>
              <button
                style={styles.button}
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
              {/* <p> or</p> */}
              <button
                style={styles.button}
                onClick={() => (window.location.href = "/")}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
