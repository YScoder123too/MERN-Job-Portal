// // import { GoogleAuth } from "google-auth-library";
// // import fetch from "node-fetch";

// // // Initialize Google Auth with your service account JSON
// // const auth = new GoogleAuth({
// //   keyFile: "service-account.json", // make sure this path is correct
// //   scopes: "https://www.googleapis.com/auth/cloud-platform",
// // });

// // export async function askGemini(messages = []) {
// //   if (!Array.isArray(messages) || messages.length === 0) {
// //     return "⚠️ No messages provided to Gemini.";
// //   }
// //   try {
// //     const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;

// //     const contents = messages.map((m) => ({
// //       role: m.role,
// //       parts: [{ text: m.content }],
// //     }));

// //     const response = await fetch(url, {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ contents }),
// //     });

// //     const data = await response.json();

// //     if (data.error) {
// //       console.error("❌ Gemini API returned error:", data.error);
// //       return `⚠️ Gemini API Error: ${data.error.message || JSON.stringify(data.error)}`;
// //     }

// //     const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
// //     if (!text) {
// //       return "⚠️ No response from Gemini API.";
// //     }
// //     return text;
// //   } catch (err) {
// //     console.error("❌ askGemini error:", err);
// //     return "⚠️ Failed to connect to Gemini API. Please try again later.";
// //   }
// // }
// // // export async function askGemini(messages = []) {
// // //   if (!Array.isArray(messages) || messages.length === 0) {
// // //     return "⚠️ No messages provided to Gemini.";
// // //   }

// // //   try {
// // //     // Get authenticated client
// // //     const client = await auth.getClient();


// // //     console.log("kkfffffffffffffffffffffffffffffffffff")

// // //     const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

// // //     // Format messages for Gemini
// // //     const contents = messages.map((m) => ({
// // //       role: m.role === "system" ? "system" : m.role, // keep system if needed
// // //       parts: [{ text: m.content }],
// // //     }));

// // //     // Make authenticated request
// // //     const res = await client.request({
// // //       url,
// // //       method: "POST",
// // //       data: { contents },
// // //     });

// // //     const data = res.data;


// // //     console.log(data,'data123')

// // //     if (data.error) {
// // //       console.error("❌ Gemini API returned error:", data.error);
// // //       return `⚠️ Gemini API Error: ${data.error.message || JSON.stringify(data.error)}`;
// // //     }

// // //     const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
// // //     if (!text) {
// // //       console.warn("⚠️ Gemini returned no text in response.");
// // //       return "⚠️ No response from Gemini API.";
// // //     }

// // //     return text;
// // //   } catch (err) {
// // //     console.error("❌ askGemini error:", err);
// // //     return "⚠️ Failed to hhhhhhhh Gemini API. Please try again later.";
// // //   }
// // // }

// //////////////////////////////////////////////////////////////////
// // import fetch from "node-fetch";

// // export async function askGemini(messages = []) {
// //   if (!Array.isArray(messages) || messages.length === 0) {
// //     return "⚠️ No messages provided to Gemini.";
// //   }

// //   try {
// //     const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;

// //     const contents = messages.map((m) => ({
// //       role: m.role,
// //       parts: [{ text: m.content }],
// //     }));

// //     const response = await fetch(url, {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ contents }),
// //     });

// //     const data = await response.json();

// //     if (data.error) {
// //       console.error("❌ Gemini API returned error:", data.error);
// //       return `⚠️ Gemini API Error: ${data.error.message || JSON.stringify(data.error)}`;
// //     }

// //     const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
// //     if (!text) {
// //       return "⚠️ No response from Gemini API.";
// //     }

// //     return text;
// //   } catch (err) {
// //     console.error("❌ askGemini error:", err);
// //     return "⚠️ Failed to connect to Gemini API. Please try again later.";
// //   }
// // }

// import fetch from "node-fetch";

// export async function askGemini(messages = []) {
//   if (!Array.isArray(messages) || messages.length === 0) {
//     return "⚠️ No messages provided to Gemini.";
//   }

//   try {
//     // ✅ NEW working model + correct endpoint
//     const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

//     // Gemini 1.5 uses contents.parts.text (same as your old code)
//     const contents = messages.map((m) => ({
//       role: m.role,
//       parts: [{ text: m.content }],
//     }));

//     const response = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ contents }),
//     });

//     const data = await response.json();

//     if (data.error) {
//       console.error("❌ Gemini API Error:", data.error);
//       return `⚠️ Gemini API Error: ${data.error.message || "Unknown error"}`;
//     }

//     // Gemini 1.5 response format (same as before)
//     const text =
//       data.candidates?.[0]?.content?.parts?.[0]?.text ||
//       "⚠️ No response from Gemini API.";

//     return text;
//   } catch (err) {
//     console.error("❌ askGemini error:", err);
//     return "⚠️ Failed to connect to Gemini API.";
//   }
// }

// import fetch from "node-fetch";

// export async function askGemini(messages = []) {
//   if (!Array.isArray(messages) || messages.length === 0) {
//     return "⚠️ No messages provided to Gemini.";
//   }

//   try {
//     const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

//     const contents = messages.map((m) => ({
//       role: m.role,
//       parts: [{ text: m.content }],
//     }));

//     const response = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ contents }),
//     });

//     const data = await response.json();

//     if (data.error) {
//       console.error("❌ Gemini API Error:", data.error);
//       return `⚠️ Gemini API Error: ${data.error.message}`;
//     }

//     const text =
//       data.candidates?.[0]?.content?.parts?.[0]?.text ||
//       "⚠️ No response from Gemini API.";

//     return text;
//   } catch (err) {
//     console.error("❌ askGemini error:", err);
//     return "⚠️ Failed to connect to Gemini API.";
//   }
// }

import fetch from "node-fetch";

export async function askGemini(messages = []) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return "⚠️ No messages provided to Gemini.";
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const contents = messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.content }],
    }));

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("❌ Gemini API Error:", data.error);
      return `A Gemini API Error: ${data.error.message}`;
    }

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ No response from Gemini API.";

    return text;
  } catch (err) {
    console.error("❌ askGemini error:", err);
    return "⚠️ Failed to connect to Gemini API.";
  }
}
