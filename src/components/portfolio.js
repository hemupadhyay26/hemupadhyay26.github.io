import sshManagement from '../assets/ssh-mangement.jpg';
import actionEmailNotification from '../assets/action-email-notification.jpg';

const Portfolio = () => {
    const projects = [
        {
            name: "SSH Credential Management",
            description: "A secure SSH credential management system built using Node.js, allowing users to manage and authenticate SSH keys efficiently.",
            image: sshManagement,
            githubUrl: "https://github.com/hemupadhyay26/ssh-cred-manager-nodejs",
        },
        {
            name: "Action Email Notification",
            description: "A GitHub Action that sends email notifications about workflow success or failure, ensuring real-time updates for CI/CD pipelines.",
            image: actionEmailNotification,
            githubUrl: "https://github.com/hemupadhyay26/action-email-notification",
        },
    ];

    return (
        <div className="py-10 px-4" id="portfolio">
            <div className="flex flex-col items-center space-y-4 text-center mb-8">
                <h2 className="text-4xl font-bold text-white">My Projects</h2>
                <div className="w-1 h-12 bg-primary"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {projects.map((project, index) => (
                    <div key={index} className="flex flex-col bg-transparent rounded-lg p-6">
                        {/* Image Wrapper with Hover Effect */}
                        <div className="relative group w-full h-60 rounded-lg overflow-hidden">
                            {/* Project Image */}
                            <img
                                src={project.image}
                                alt={project.name}
                                className="w-full h-full object-cover transition duration-300 ease-in-out group-hover:opacity-30"
                            />
                            {/* Overlay Text */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
                                <h3 className="text-3xl font-bold text-primary">
                                    {project.name}
                                </h3>
                            </div>
                        </div>

                        {/* Project details */}
                        <div className="mt-4">
                            <h3 className="text-2xl font-bold text-primary mb-2">
                                {project.name}
                            </h3>
                            <p className="text-gray-300 mb-4">{project.description}</p>
                            <div className="flex space-x-4">
                                {project.githubUrl && (
                                    <a
                                        href={project.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary font-semibold"
                                    >
                                        GitHub Repo
                                    </a>
                                )}
                                {project.liveDemo && (
                                    <a
                                        href={project.liveDemo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary font-semibold"
                                    >
                                        Live Demo
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Portfolio;
