import { useRef } from "react";

const Services = () => {
    const jobs = [
        { number: "01.", title: "Software Development", description: "Creating responsive and user-friendly websites." },
        { number: "02.", title: "DevOps", description: "Streamlining development and deployment processes." },
        { number: "03.", title: "AWS", description: "Providing scalable cloud-based solutions." },
        { number: "04.", title: "CI/CD", description: "Automating software delivery pipelines efficiently." },
        { number: "05.", title: "Dockerization", description: "Containerizing applications for consistency and scalability." },
        { number: "06.", title: "Terraform", description: "Infrastructure as code for provisioning cloud resources." },
        // { number: "07.", title: "Kubernetes", description: "Automating deployment, scaling, and management of containerized applications." },
    ];


    const carouselRef = useRef(null);

    const scrollSpeed = 1000; // Adjust this value to control the scroll speed (in milliseconds)

    const scrollLeft = () => {
        let currentScroll = carouselRef.current.scrollLeft;
        let targetScroll = currentScroll - carouselRef.current.offsetWidth;

        smoothScroll(currentScroll, targetScroll);
    };

    const scrollRight = () => {
        let currentScroll = carouselRef.current.scrollLeft;
        let targetScroll = currentScroll + carouselRef.current.offsetWidth;

        smoothScroll(currentScroll, targetScroll);
    };

    // Function for smooth scrolling
    const smoothScroll = (start, end) => {
        const startTime = performance.now();
        const duration = scrollSpeed; // duration in ms
        const scrollDistance = end - start;

        const animateScroll = (time) => {
            const timeElapsed = time - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            carouselRef.current.scrollLeft = start + scrollDistance * progress;

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    };


    return (
        <div className="py-10 px-4" id="services">
            <div className="flex flex-col items-center space-y-4 text-center mb-8">
                <p className="text-secondary mt-2">Services</p>
                <h2 className="text-4xl font-bold text-white">What i do ?</h2>
                <div className="w-1 h-12 bg-primary"></div>
            </div>

            {/* Carousel */}
            <div className="relative">
                <div
                    className="flex overflow-x-auto space-x-6 py-6 px-4 scrollbar-hide w-[80%] mx-auto"
                    ref={carouselRef}
                >
                    {jobs.map((job, index) => (
                        <div
                            key={index}
                            className="bg-primary bg-opacity-10 border-2 border-primary p-6 rounded-lg shadow-lg w-[300px] h-[400px] flex-shrink-0 flex flex-col justify-between relative group"
                        >
                            <div className="z-10">
                                <h2 className="text-5xl font-bold text-secondary group-hover:text-box transition-colors duration-300">{job.number}</h2>
                                <h3 className="text-3xl font-bold text-white my-4 group-hover:text-box transition-colors duration-300">{job.title}</h3>
                                <p className="text-secondary group-hover:text-box transition-colors duration-300">{job.description}</p>
                                <div className="absolute bottom-9 w-16 h-1 bg-primary group-hover:bg-box"></div>
                            </div>

                            {/* Hover Effect - Primary color filling from bottom to top */}
                            <div className="absolute bottom-0 left-0 right-0 bg-primary rounded-b-lg group-hover:h-full transition-all duration-500 ease-out h-0"></div>
                        </div>
                    ))}
                </div>




                {/* Arrow Controls */}
                <div className="bottom-0 left-0 right-0 flex justify-center gap-8">
                    <button
                        onClick={scrollLeft}
                        className="text-primary font-bold text-5xl hover:scale-110 transform transition"
                    >
                        &#8592; {/* Left Arrow */}
                    </button>
                    <button
                        onClick={scrollRight}
                        className="text-primary font-bold text-5xl hover:scale-110 transform transition"
                    >
                        &#8594; {/* Right Arrow */}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Services;
