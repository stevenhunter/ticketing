import axios from "axios";

const Named = ({ req }) => {
	if (typeof window === "undefined") {
		//we are on the server
		return axios.create({
			baseURL:
				"http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
			headers: req.headers,
		});
	} else {
		//we are on the browser
		return axios.create({
			baseURL: "/",
		});
	}
};

export default Named;
