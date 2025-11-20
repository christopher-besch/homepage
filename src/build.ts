import { renderToStaticMarkup } from "react-dom/server";
import Index from "./components/index.js";


let a: string = "Hello World!";
console.log(a);


let b = renderToStaticMarkup(Index());
console.log(b);
console.log(0 / 0);
throw new Error("test");
