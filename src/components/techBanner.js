import React, { useEffect, useRef } from "react";
import aws from "../assets/bannerLogo/aws.png"
import terraform from "../assets/bannerLogo/terraform.svg"
import githubAction from "../assets/bannerLogo/githubAction.png"
import python from "../assets/bannerLogo/python.png"
import nodejs from "../assets/bannerLogo/nodejs.png"
import docker from "../assets/bannerLogo/docker.png"
import k8s from "../assets/bannerLogo/k8s.png"
import sonarqube from "../assets/bannerLogo/sonarqube.png"
import grafana from "../assets/bannerLogo/grafana.png"

const TechBanner = () => {
    const techList = [
        { name: "React" },
        { name: "Sonarqube", logo:sonarqube },
        { name: "JavaScript" },
        { name: "Node.js", logo: nodejs },
        { name: "Devops" },
        { name: "Python" , logo: python },
        { name: "Github Action", logo: githubAction },
        { name: "Terraform", logo:terraform },
        { name: "AWS", logo:aws },
        { name: "Grafana", logo:grafana },
        { name: "Docker", logo:docker },
        { name: "Kubernetes", logo:k8s },
    ];

    const logosRef = useRef(null);

    useEffect(() => {
        const ul = logosRef.current;
        if (ul) {
            // Clone the list for seamless scrolling
            ul.insertAdjacentHTML("afterend", ul.outerHTML);
            ul.nextSibling.setAttribute("aria-hidden", "true");
        }
    }, []);

    return (
        <div className="w-full bg-primary mx-auto px-4 md:px-6 py-4">
            <div className="text-center">
                <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                    <ul
                        ref={logosRef}
                        className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll"
                    >
                        {techList.map((tech, index) => (
                            <li key={index} className="flex items-center">
                                {tech.logo ? (
                                    <img
                                        src={tech.logo}
                                        alt={tech.name}
                                        title={tech.name}
                                        className="h-12 w-auto"
                                    />
                                ) : (
                                    <span className="text-secondary font-bold text-xl">
                                        {tech.name}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TechBanner;
