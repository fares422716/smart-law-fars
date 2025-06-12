
import { useState } from "react";

function App() {
  const [inputs, setInputs] = useState({ siita: "", rajhi: "", mostafa: "" });
  const [response, setResponse] = useState("");
  const [currentCase, setCurrentCase] = useState("siita");

  const handleInputChange = (e) => {
    const { value } = e.target;
    setInputs((prev) => ({ ...prev, [currentCase]: value }));
  };

  const handleGenerate = async (type) => {
    const input = inputs[currentCase];
    const promptMap = {
      memo: `صياغة مذكرة بناءً على: ${input}`,
      reply: `صياغة رد على الدعوى: ${input}`,
      summary: `تلخيص القضية التالية: ${input}`,
    };

    setResponse("جاري المعالجة...");

    try {
      const res = await fetch("/api/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptMap[type] }),
      });

      if (!res.ok) throw new Error("فشل الاتصال بالخادم");

      const data = await res.json();
      setResponse(data.result || "لم يتم توليد نتيجة.");
    } catch (error) {
      setResponse("حدث خطأ أثناء المعالجة. الرجاء المحاولة لاحقًا.");
    }
  };

  return (
    <div className="app" style={{ direction: "rtl", padding: "2rem", textAlign: "right" }}>
      <h1>شركة الفارس للمحاماة والاستشارات القانونية</h1>
      <select onChange={(e) => setCurrentCase(e.target.value)}>
        <option value="siita">دعوى صيته</option>
        <option value="rajhi">دعوى الراجحي</option>
        <option value="mostafa">دعوى مصطفى العمالية</option>
      </select>
      <textarea
        placeholder="اكتب تفاصيل القضية هنا..."
        value={inputs[currentCase]}
        onChange={handleInputChange}
        style={{ width: "100%", minHeight: "100px", marginTop: "1rem" }}
      />
      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => handleGenerate("memo")}>✍️ صياغة مذكرة</button>
        <button onClick={() => handleGenerate("reply")}>🛡️ رد على الدعوى</button>
        <button onClick={() => handleGenerate("summary")}>📝 تلخيص</button>
      </div>
      <div style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}>{response}</div>
    </div>
  );
}

export default App;
