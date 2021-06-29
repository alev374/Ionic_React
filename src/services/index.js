import "./app.js";

import Storage from "./storage";
import Network from "./network";
import Analytics from "./analytics";
import Notifications from "./notifications";

const storage = new Storage();
const network = new Network();
const analytics = new Analytics();
const notifications = new Notifications({ storage });

export { storage, network, analytics, notifications };
