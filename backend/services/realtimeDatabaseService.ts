import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
// @deno-types="https://cdn.esm.sh/v58/firebase@9.6.0/database/dist/database/index.d.ts"
import {
  ref,
  set,
  get,
  child,
  getDatabase,
  push
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";


let db:any;

export const setResults = (results: any) => {
    for (var key in results) {
      const resultListRef = ref(db, 'results/'+key);
      results[key].forEach(item => {
        const newResultListRef = push(resultListRef);
        set(newResultListRef, item);
      });
    }
    
};
  
export const getResults = async () => {
    let data = null;
    const dbRef = ref(db);
    await get(child(dbRef, `results`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          data = snapshot.val();
          //   console.log(data);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  
    return data;
};

export const getResultsById :any= async (id) => {
    let data = null;
    const dbRef = ref(db);
    await get(child(dbRef, `results/${id}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          data = snapshot.val();
          //   console.log(data);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  
    return data;
};
  
export const setRequest = (request) => {
    set(ref(db, "requests"), request);
};
  
export const getRequest = async () => {
    const dbRef = ref(db);
    let data = null;
    await get(child(dbRef, `requests`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          data = snapshot.val();
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  
    return data;
};

export const getRequestById = async (id) => {
    const dbRef = ref(db);
    let data:any = null;
    await get(child(dbRef, `requests`))
      .then((snapshot) => {
        if (snapshot.exists()) {
         let requests = snapshot.val();
         data=requests.find(item => item.id === id)
        }
      })
      .catch((error) => {
        console.error(error);
      });
  
    return data;
};

export const initializeFirebase=(firebaseConfig)=>{ 
    const app = initializeApp(firebaseConfig);
    db =  getDatabase(app);
    console.log('Database initialized!');
}