import api from "../../api/api";

export default function AdminHomePage() {
  const handleHello = async () => {
    const res = await api.get("/hello-admin");
    console.log(res);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: "16px",
      }}
    >
      <button onClick={handleHello}>ok hãy bấm nhé</button>
    </div>
  );
}
