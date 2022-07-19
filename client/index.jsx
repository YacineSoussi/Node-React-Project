import React from "react";
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import {createRoot} from "react-dom/client";
import {App} from "./ui/app";
import {appRoutes} from "./configuration/appRoutes";
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(<App appRoutes={appRoutes} />);
