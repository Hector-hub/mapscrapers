import puppeteer from "puppeteer";
import { decrypt } from "./services/encryptService.ts";
import { envConfig } from "./env.ts";
import {
  setRequest,
  getRequest,
  getResults,
  initializeFirebase,
  setResults,
  getRequestById,
  getResultsById,
} from "./services/realtimeDatabaseService.ts";
import { getId, validateURL } from "./utils/urlManager.ts";

const docsPage = await Deno.readTextFile("index.html");
const firebaseConfig: any = {};
const scrapingFrequency = 3600000;
let response = new Response("Server is live!", { status: 200 });
let results = {};
let requests: Array<any> = [];
let browser: any = null;
let page: any = null;
let serverPassword = "";
let saveInterval: any;
let scrapingInterval: any;
let isConfigured = false;
let isStarted = false;

const configureServer = async (apiKey) => {
  await decrypt(envConfig, apiKey)
    .then((result) => {
      const envVars = JSON.parse(result);
      serverPassword = envVars.SERVER_PASSWORD;
      if (serverPassword === apiKey) {
        firebaseConfig.apiKey = envVars.API_KEY;
        firebaseConfig.authDomain = envVars.AUTH_DOMAIN;
        firebaseConfig.databaseURL = envVars.DATABASE_URL;
        firebaseConfig.projectId = envVars.PROJECT_ID;
        firebaseConfig.storageBucket = envVars.STORAGE_BUCKET;
        firebaseConfig.messagingSenderId = envVars.MESSAGING_SENDER_ID;
        firebaseConfig.appId = envVars.APP_ID;
        firebaseConfig.measurementId = envVars.MEASUREMENT_ID;
        serverPassword = envVars.SERVER_PASSWORD;
        initializeFirebase(firebaseConfig,apiKey);
        setServerData();
        response = new Response("Server configured!");
        isConfigured = true;
      } else {
        response = new Response("Invalid apiKey", { status: 404 });
      }
    })
    .catch(() => {
      response = new Response("Invalid apiKey", { status: 404 });
    });
};
const startServer = async (apiKey) => {
  if (isConfigured) {
    if (apiKey === serverPassword) {
      browser = await puppeteer.launch();
      page = await browser.newPage();

      scrapingInterval = setInterval(() => {
        scrapingMaps();
      }, scrapingFrequency / 4);

      saveInterval = setInterval(() => {
        setResults(results);
        results = {};
      }, scrapingFrequency);
      response = new Response("Scraping!");
      isStarted = true;
    } else {
      response = new Response("Invalid apiKey", { status: 404 });
    }
  } else {
    response = new Response("The server must be configured first!");
  }
};
const stopServer = (apiKey) => {
  if (isStarted) {
    if (apiKey === serverPassword) {
      clearInterval(saveInterval);
      clearInterval(scrapingInterval);
      browser.close();
      browser = null;
      isStarted = false;
      response = new Response("Server stopped!");
    } else {
      response = new Response("Invalid apiKey", { status: 404 });
    }
  } else {
    response = new Response("The server must be started first!");
  }
};
const resetServer = (apiKey) => {
  if (isConfigured) {
    if (apiKey === serverPassword) {
      stopServer(apiKey);
      results = {};
      requests = [];
      setResults(results);
      setRequest(requests);
      setServerData();
      response = new Response("Server was reset!");
    } else {
      response = new Response("Invalid apiKey", { status: 404 });
    }
  } else {
    response = new Response("The server must be configured first!");
  }
};
const makeRequest = async (id: any, ruta: any) => {
  if (isConfigured) {
    if (validateURL(ruta)) {
      if (id) {
        await getRequestById(id).then((result) => {
          if (result == null) {
            if (results[id] == undefined) {
              results[id] = [];
            }
            const request = {
              id,
              ruta,
            };
            requests.push(request);
            setRequest(requests);
            response = new Response("Your request was created!");
          } else {
            response = new Response("This request exist, try to get results.");
          }
        });
      } else {
        response = new Response("Invalid id");
      }
    } else {
      response = new Response("Invalid url");
    }
  } else {
    response = new Response("The server must be configured first!");
  }
};
const getResultsAndSort = async (id: any) => {
  if (isConfigured) {
    if (id) {
      await getResultsById(id).then((results: any) => {
        if (results !== null) {
          let resultsData = [...Object.values(results)];
          resultsData.sort((a: any, b: any) => {
            const timeOption1A = parseInt(a.options[0]);
            const timeOption1B = parseInt(b.options[0]);
            return timeOption1A - timeOption1B;
          });
          response = new Response(JSON.stringify(resultsData));
        } else {
          response = new Response("Invalid id", { status: 404 });
        }
      });
    } else {
      response = new Response("Invalid id", { status: 404 });
    }
  } else {
    response = new Response("The server must be configured first!");
  }
};
const getAllRequestsResults = async () => {
  if (isConfigured) {
    await getResults().then((resultsData: any) => {
      let newObj: any = {};
      for (var key in resultsData) {
        newObj[key] = [...Object.values(resultsData[key])];
      }
      response = new Response(JSON.stringify(newObj));
    });
  } else {
    response = new Response("The server must be configured first!");
  }
};
const apiDocsPage = () => {
  response = new Response(docsPage, {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
};
const scrapingMaps = async () => {
  try {
    for (const request of requests) {
      await page.goto(request.ruta);
      await page.waitForSelector("body");

      const options = await page.evaluate(() => {
        const divs = Array.from(
          document.querySelectorAll(".XdKEzd .Fk3sm.fontHeadlineSmall")
        );

        return divs.map((div) => {
          const parts = div.innerHTML.split(" ");
          return parts.length > 2
            ? parseInt(parts[0]) * 60 + parseInt(parts[2])
            : parseInt(parts[0]);
        });
      });
      if (results[request.id] == undefined) {
        results[request.id] = [];
      }
      if (options.length > 0) {
        results[request.id].push({
          date: new Date().toLocaleString(),
          options: options,
          optionsTimeType: "minutes",
        });
      }
      // await browser.close();
    }
    console.log(results);
    console.log(" ----------------------------");
  } catch (error) {
    console.error("Error al extraer datos:", error);
    return { error: "Error al extraer datos" };
  }
};
const setServerData = async () => {
  getRequest().then((requestsData: any) => {
    if (requestsData != null) {
      requests = [...requestsData];
      requests.forEach((request) => {
        if (results[request.id] == undefined) {
          results[request.id] = [];
        }
      });
    }
  });
};

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const apiKey = url.searchParams.get("apiKey");
  const id = url.searchParams.get("id");
  if (req.method === "GET") {
    switch (url.pathname) {
      case "/makeRequest":
        const ruta = url.searchParams.get("url");
        await makeRequest(id, ruta);
        break;

      case "/getResults":
        await getResultsAndSort(id);
        break;

      case "/getAllRequestsResults":
        await getAllRequestsResults();
        break;

      case "/resetServer":
        resetServer(apiKey);

        break;

      case "/startServer":
        await startServer(apiKey);

        break;

      case "/stopServer":
        stopServer(apiKey);

        break;

      case "/configureServer":
        await configureServer(apiKey);
        break;

      default:
        apiDocsPage();
    }
  } else {
    response = new Response("Invalid request", { status: 404 });
  }
  return response;
});
