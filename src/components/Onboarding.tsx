import React, { useState } from 'react';
import '../styles/onboarding.scss';

const slides = [
    {
        videoSrc: '/videobg1.mp4',
        title: ['Everything you need to', 'edit like a pro'],
        description:
            'From basic cuts to advanced transitions — make your videos stand out in just a few taps.',
    },
    {
        videoSrc: '/videobg2.mp4',
        title: ['Make viral videos in', 'one tap'],
        description:
            'Explore our collection of trendy templates and transform your clips effortlessly.',
    },
    {
        videoSrc: '/videobg3.mp4',
        title: ['Smart editing powered', 'by AI'],
        description:
            'Our intelligent engine picks the best moments, syncs them with music & builds your story.',
    },
];

const Onboarding: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleContinue = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            window.location.href = '/';
        }
    };

    const activeSlide = slides[currentSlide];

    return (
        <div className="relative w-full h-full overflow-hidden">
            <video
                className="video-background"
                src={activeSlide.videoSrc}
                autoPlay
                muted
                loop
                key={activeSlide.videoSrc}
            />
            <div className="content-overlay">
                <div className="text-content">
                    <h1>
                        <span>{activeSlide.title[0]}</span>
                        <b />
                        <span>{activeSlide.title[1]}</span>
                    </h1>
                    <p>{activeSlide.description}</p>
                </div>

                <div className="button-container">
                    <button
                        className="continue-button"
                        onClick={handleContinue}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;