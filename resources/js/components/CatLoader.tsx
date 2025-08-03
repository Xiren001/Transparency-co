const CatLoader = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity dark:bg-[#0a0a0a]">
            <div className="loader flex h-fit w-fit items-center justify-center">
                <div className="wrapper flex h-fit w-fit flex-col items-center justify-center">
                    <div className="catContainer relative flex h-fit w-full items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 733 673" className="catbody w-20">
                            <path
                                fill="#212121"
                                d="M111.002 139.5C270.502 -24.5001 471.503 2.4997 621.002 139.5C770.501 276.5 768.504 627.5 621.002 649.5C473.5 671.5 246 687.5 111.002 649.5C-23.9964 611.5 -48.4982 303.5 111.002 139.5Z"
                            />
                            <path fill="#212121" d="M184 9L270.603 159H97.3975L184 9Z" />
                            <path fill="#212121" d="M541 0L627.603 150H454.397L541 0Z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 158 564" className="tail absolute top-3/4 w-4">
                            <path
                                fill="#191919"
                                d="M5.97602 76.066C-11.1099 41.6747 12.9018 0 51.3036 0V0C71.5336 0 89.8636 12.2558 97.2565 31.0866C173.697 225.792 180.478 345.852 97.0691 536.666C89.7636 553.378 73.0672 564 54.8273 564V564C16.9427 564 -5.4224 521.149 13.0712 488.085C90.2225 350.15 87.9612 241.089 5.97602 76.066Z"
                            />
                        </svg>

                        <div className="text absolute m-0 mb-25 ml-32 flex w-12 flex-col">
                            <span className="bigzzz ml-2 text-2xl font-bold text-black dark:text-white">Z</span>
                            <span className="zzz text-sm font-bold text-black dark:text-white">Z</span>
                        </div>
                    </div>

                    <div className="wallContainer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 500 126" className="wall w-80">
                            <line strokeWidth={6} stroke="#7C7C7C" y2={3} x2={450} y1={3} x1={50} />
                        </svg>
                    </div>

                    <div className="font-schoolbell mt-6 text-center text-lg font-medium text-neutral-600 dark:text-neutral-300">
                        Loading assets...
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CatLoader;
