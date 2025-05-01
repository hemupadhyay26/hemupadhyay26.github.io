import heroImage from "../assets/hero.png";
import CircularText from "../blocks/TextAnimations/CircularText/CircularText";
import ShinyText from "../blocks/TextAnimations/ShinyText/ShinyText";
import RotatingText from "../blocks/TextAnimations/RotatingText/RotatingText";
import ResumePdf from "../assets/Resume2Full.pdf";

const Introduction = () => {
    return (
        <div className="px-4">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
                {/* Left side */}
                <div className="flex-1 text-center md:text-left order-1 md:order-1">
                    <ShinyText text="Hello." disabled={false} speed={3} className='text-4xl md:text-6xl font-bold my-4' />
                    <h3 className="text-2xl md:text-4xl font-extrabold text-primary mb-4">╴I’m
                        <RotatingText
                            texts={['Hem Chandra Upadhyay',
                                'Developer',
                                'Creative Designer',
                                'Tech Enthusiast',
                                'Devops engineer']}
                            mainClassName="px-2 sm:px-2 md:px-3 text-primary overflow-hidden py-0.5 sm:py-1 md:py-2 rounded-lg"
                            staggerFrom={"last"}
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "-120%" }}
                            staggerDuration={0.025}
                            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                            transition={{ type: "spring", damping: 30, stiffness: 400 }}
                            rotationInterval={3000}
                        /></h3>
                    <button
                        onClick={() => window.open(ResumePdf, '_blank')}
                        className="bg-primary text-box py-3 px-6 rounded-md text-lg transition duration-300 border-2 border-primary hover:bg-background hover:text-primary"
                    >
                        Download Resume
                    </button>
                </div>

                {/* Right side */}
                <div className="flex-1 text-center md:text-left order-2 md:order-3">
                    <h4 className="text-2xl md:text-3xl font-bold text-primary mb-4">I am a DevOps engineer</h4>
                    <p className="text-base md:text-lg text-secondary mb-6">
                        I'm Hem Chandra Upadhyay, a Computer Science graduate skilled in data structures, algorithms, AWS Cloud, and DevOps. I've developed various projects and am proficient in Bash, Git, JavaScript, SQL, and frameworks like ReactJS, React Native, and NodeJS.
                    </p>


                    {/* Container for Let’s Talk and CircularText */}
                    <div className="flex flex-col items-center md:items-start">
                        <button
                            onClick={() => alert("Contact form will be available soon!")}
                            className="group text-primary font-bold text-lg md:text-xl flex items-center justify-center md:justify-start transition-all duration-300 hover:text-secondary"
                        >
                            Let’s Talk
                            <span className="ml-2 text-xl md:text-2xl transform transition-all duration-300 group-hover:translate-x-2">
                                &#8594;
                            </span>
                        </button>


                        {/* Circular Component Below Let’s Talk (Hidden on Mobile) */}
                        <div className="hidden md:block mt-6">
                            <CircularText
                                text="DEVOPS*ENGINNER*"
                                onHover="speedUp"
                                spinDuration={20}
                            />
                        </div>
                    </div>
                </div>

                {/* Middle Image */}
                <div className="flex order-3 md:order-2">
                    <img
                        src={heroImage}
                        alt="hem upadhyay"
                        className="w-full max-w-xs md:max-w-md h-auto mx-auto shadow-lg object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default Introduction;
