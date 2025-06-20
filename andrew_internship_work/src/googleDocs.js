// Add this to your index.html if not already present:
// <script src="https://accounts.google.com/gsi/client" async defer></script>

import { cleanEssayPrompt } from "./cleanEssayPrompt";

window.addEventListener('unhandledrejection', function(event) {
  console.error('UNHANDLED PROMISE REJECTION:', event.reason);
  alert('UNHANDLED PROMISE REJECTION: ' + (event.reason && event.reason.message ? event.reason.message : JSON.stringify(event.reason)));
});

const CLIENT_ID = "909605093667-578a1equr1rng4onvuv7lbnvj8qc0p9n.apps.googleusercontent.com";
const API_KEY = "AIzaSyDCZCwL0lhWcesxuE-NTa2dnB-WJoP5D7g";
const SCOPES = "https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive.file";

let accessToken = null;

export function gapiLoad() {
  return new Promise(resolve => {
    if (window.gapi) {
      window.gapi.load("client", resolve);
    } else {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.onload = () => window.gapi.load("client", resolve);
      document.body.appendChild(script);
    }
  });
}

export async function gapiInit() {
  await window.gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [
      "https://docs.googleapis.com/$discovery/rest?version=v1",
      "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
    ],
  });
}

export async function gapiSignIn() {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
      reject(new Error("Google Identity Services not loaded"));
      return;
    }
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (tokenResponse) => {
        try {
          console.log("GIS callback called:", tokenResponse);
          if (tokenResponse && tokenResponse.access_token) {
            try {
              accessToken = tokenResponse.access_token;
              console.log("Set accessToken");
            } catch (e) {
              console.error("Error setting accessToken:", e);
            }
            try {
              window.gapi.client.setToken({ access_token: accessToken });
              console.log("Set gapi client token");
            } catch (e) {
              console.error("Error setting gapi client token:", e);
            }
            try {
              console.log("About to resolve gapiSignIn promise");
              resolve();
              console.log("gapiSignIn promise resolved");
            } catch (e) {
              console.error("Error in resolve:", e);
            }
          } else {
            console.error("No access token in tokenResponse", tokenResponse);
            reject(tokenResponse);
          }
        } catch (err) {
          console.error("Error in GIS callback:", err);
          reject(err);
        }
      },
    });
    console.log("Requesting access token...");
    client.requestAccessToken();
    console.log("requestAccessToken() called");
  });
}

export async function createCollegeDoc(collegeId, collegeName, essayText, collegeSlug) {
  try {
    // Get user name from localStorage (set at registration)
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userName = user.name || "User";
    // Compose doc title as requested
    const docTitle = `${userName} - ${collegeName} 2025 essays`;

    // If essayText is not provided, try to fetch from prompts
    let finalEssayText = essayText;
    if (!finalEssayText && collegeSlug) {
      const prompts = await getEssayPrompts(collegeSlug, "2025");
      if (prompts && prompts.length > 0) {
        finalEssayText = prompts.map((q, i) => `${i + 1}. ${q}`).join("\n\n");
      } else {
        finalEssayText = `Essay prompts for ${collegeName} (none found)`;
      }
    }
    // Always clean the essay text before export
    finalEssayText = cleanEssayPrompt(finalEssayText);

    console.log('Starting Google Docs creation...');
    await gapiLoad();
    console.log('gapi loaded');
    await gapiInit();
    console.log('gapi initialized');
    await gapiSignIn();
    console.log('gapi signed in');

    // 1. Create the doc
    let createRes, docId;
    try {
      createRes = await window.gapi.client.docs.documents.create({ title: docTitle });
      docId = createRes.result.documentId;
      console.log('Doc created:', docId);
    } catch (err) {
      console.error("Error creating Google Doc:", err);
      alert("Error creating Google Doc: " + (err.message || JSON.stringify(err)));
      throw err;
    }

    // 2. Insert essay questions
    try {
      await window.gapi.client.docs.documents.batchUpdate({
        documentId: docId,
        requests: [{
          insertText: {
            location: { index: 1 },
            text: finalEssayText,
          }
        }]
      });
      console.log('Text inserted');
    } catch (err) {
      console.error("Error inserting text into Google Doc:", err);
      alert("Error inserting text into Google Doc: " + (err.message || JSON.stringify(err)));
      throw err;
    }

    // 3. Get the doc link
    const docUrl = `https://docs.google.com/document/d/${docId}/edit`;
    console.log('Doc URL:', docUrl);

    // 4. Store in localStorage
    const docs = JSON.parse(localStorage.getItem("collegeDocs") || "{}");
    docs[collegeId] = docUrl;
    localStorage.setItem("collegeDocs", JSON.stringify(docs));

    return docUrl;
  } catch (err) {
    console.error("createCollegeDoc failed:", err);
    alert("createCollegeDoc failed: " + (err.message || JSON.stringify(err)));
    throw err;
  }
}

export function getCollegeDocUrl(collegeId) {
  const docs = JSON.parse(localStorage.getItem("collegeDocs") || "{}");
  return docs[collegeId] || null;
}

// Fetch essay prompts from the static JSON file in public/
export async function getEssayPrompts(collegeSlug, year = "2025") {
  try {
    const res = await fetch("/essay_prompts.json");
    if (!res.ok) throw new Error("Failed to fetch essay prompts");
    const data = await res.json();
    if (data[collegeSlug] && data[collegeSlug][year]) {
      return data[collegeSlug][year];
    }
    return [];
  } catch (err) {
    console.error("Error fetching essay prompts:", err);
    return [];
  }
}

export async function checkGoogleDocExists(docUrl) {
  try {
    // Extract docId from the URL
    const match = docUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) return false;
    const docId = match[1];
    // Try to get the document metadata
    await gapiLoad();
    await gapiInit();
    await gapiSignIn();
    await window.gapi.client.docs.documents.get({ documentId: docId });
    return true;
  } catch (err) {
    // If the doc is deleted or inaccessible, treat as non-existent
    return false;
  }
}
