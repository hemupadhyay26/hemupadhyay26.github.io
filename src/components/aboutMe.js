import hero2 from '../assets/hero2.jpeg';
import ShinyText from '../blocks/TextAnimations/ShinyText/ShinyText';
import ResumePdf from "../assets/Resume2Full.pdf";

const AboutMe = () => {
    return (
        <div className="flex flex-col items-center py-10 space-y-6" id='about-me'>
            {/* Title */}
            <div className="font-bold text-3xl text-white">Who am I ?</div>

            {/* Vertical Line */}
            <div className="w-1 h-12 bg-primary"></div>

            {/* Description */}
            <div className="flex flex-col md:flex-row items-center justify-between space-x-6 space-y-2 md:space-y-0">
                {/* Left Box */}
                <div className="flex-1 flex justify-center">
                    <div className="relative">
                        <img
                            src={hero2} // Placeholder for the image
                            alt="About Me"
                            className="border-4 border-primary shadow-lg"
                        />
                    </div>
                </div>

                {/* Right Box */}
                <div className="flex-1 text-center md:text-left space-y-4 pr-4">
                    <h3 className="text-2xl font-bold text-primary">About Me</h3>
                    <ShinyText text="Hem Chandra Upadhyay" disabled={false} speed={3} className='text-3xl font-bold' />
                    <div className="text-secondary max-w-full md:max-w-md">
                        I'm Hem Chandra Upadhyay, a Computer Science graduate skilled in data structures, algorithms, AWS Cloud, and DevOps. I've developed various projects and am proficient in Bash, Git, JavaScript, SQL, and frameworks like ReactJS, React Native, and NodeJS.
                    </div>
                    {/* Cards with Name and Other Details */}
                    <div className="space-y-4">
                        <div className="bg-box p-4 rounded-lg shadow-md border-l-4 border-primary">
                            <h5 className="font-semibold text-lg text-primary">Name:</h5>
                            <p className="text-secondary">Hem Chandra Upadhyay</p>
                        </div>
                        <div className="bg-box p-4 rounded-lg shadow-md border-l-4 border-primary">
                            <h5 className="font-semibold text-lg text-primary">Email:</h5>
                            <p className="text-secondary">hemupadhyay234@gmail.com</p>
                        </div>
                        <div className="bg-box p-4 rounded-lg shadow-md border-l-4 border-primary">
                            <h5 className="font-semibold text-lg text-primary">Location:</h5>
                            <p className="text-secondary">Uttarakhand, India</p>
                        </div>
                    </div>

                    <button
                        onClick={() => window.open(ResumePdf, '_blank')}
                        className="hidden md:inline-block bg-primary text-box py-3 px-6 rounded-md text-lg transition duration-300 border-2 border-primary hover:bg-background hover:text-primary"
                    >
                        Download Resume
                    </button>


                </div>
            </div>
        </div>
    );
};

export default AboutMe;
