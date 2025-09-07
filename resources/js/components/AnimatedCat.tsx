import React from 'react';

const AnimatedCat: React.FC = () => {
    return (
        <div className="cat-container mb-8 flex items-center justify-center">
            <div className="cat relative h-[170px] w-[192px]">
                {/* Ears */}
                <div className="ear ear-left absolute -top-[30%] -left-[7%] h-[60%] w-[25%] -rotate-[15deg] rounded-tl-[70%] rounded-tr-[30%] bg-white dark:bg-gray-100">
                    <div className="absolute right-[10%] bottom-[24%] h-[10%] w-[5%] rounded-full bg-gray-800 dark:bg-black"></div>
                    <div className="absolute right-[10%] bottom-[24%] h-[10%] w-[5%] origin-[50%_100%] -rotate-[45deg] rounded-full bg-gray-800 dark:bg-black"></div>
                </div>
                <div className="ear ear-right absolute -top-[30%] -right-[7%] h-[60%] w-[25%] rotate-[15deg] rounded-tl-[30%] rounded-tr-[70%] bg-white dark:bg-gray-100">
                    <div className="absolute bottom-[24%] left-[10%] h-[10%] w-[5%] rounded-full bg-gray-800 dark:bg-black"></div>
                    <div className="absolute bottom-[24%] left-[10%] h-[10%] w-[5%] origin-[50%_100%] rotate-[45deg] rounded-full bg-gray-800 dark:bg-black"></div>
                </div>

                {/* Face */}
                <div className="face absolute h-full w-full rounded-full bg-gray-800 dark:bg-[#121212]">
                    {/* Eyes */}
                    <div className="eye eye-left absolute top-[35%] left-0 h-[30%] w-[31%] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-white dark:bg-gray-100">
                        {/* Eyelid */}
                        <div className="animate-blink absolute top-0 left-0 h-0 w-full rounded-b-[50%_50%/0_0_40%_40%] bg-gray-800 dark:bg-[#121212]"></div>
                        {/* Eye tip */}
                        <div className="absolute top-[60%] -right-[5%] h-[10%] w-[15%] rounded-full bg-white dark:bg-gray-100"></div>
                        {/* Pupil */}
                        <div className="eye-pupil animate-look-around absolute top-[25%] right-[30%] h-[50%] w-[20%] rounded-full bg-gray-800 dark:bg-black">
                            {/* Glare */}
                            <div className="absolute top-[30%] -right-[5%] h-[20%] w-[35%] rounded-full bg-white dark:bg-gray-100"></div>
                        </div>
                    </div>
                    <div className="eye eye-right absolute top-[35%] right-0 h-[30%] w-[31%] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-white dark:bg-gray-100">
                        {/* Eyelid */}
                        <div className="animate-blink absolute top-0 left-0 h-0 w-full rounded-b-[50%_50%/0_0_40%_40%] bg-gray-800 dark:bg-[#121212]"></div>
                        {/* Eye tip */}
                        <div className="absolute top-[60%] -left-[5%] h-[10%] w-[15%] rounded-full bg-white dark:bg-gray-100"></div>
                        {/* Pupil */}
                        <div className="eye-pupil animate-look-around absolute top-[25%] left-[30%] h-[50%] w-[20%] rounded-full bg-gray-800 dark:bg-black">
                            {/* Glare */}
                            <div className="absolute top-[30%] -right-[5%] h-[20%] w-[35%] rounded-full bg-white dark:bg-gray-100"></div>
                        </div>
                    </div>

                    {/* Muzzle */}
                    <div className="muzzle absolute top-[60%] left-1/2 h-[6%] w-[10%] -translate-x-1/2 rounded-[50%_50%_50%_50%/30%_30%_70%_70%] bg-white dark:bg-gray-100"></div>
                </div>
            </div>
        </div>
    );
};

export default AnimatedCat;
