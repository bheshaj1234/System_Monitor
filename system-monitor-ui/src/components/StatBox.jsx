export default function StatBox({ title, value }) {
  return (
    <div
      style={{
        background: "#1e293b",
        color: "#fff",
        padding: "20px",
        margin: "15px",
        borderRadius: "12px",
        width: "220px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
        transition: "0.3s ease-in-out",
        textAlign: "center",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "scale(1.05)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.transform = "scale(1)")
      }
    >
      <h4
        style={{
          fontSize: "16px",
          color: "#94a3b8",
          marginBottom: "10px",
          letterSpacing: "1px",
        }}
      >
        {title}
      </h4>

      <h2
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          margin: 0,
        }}
      >
        {value}
      </h2>
    </div>
  );
}                                   