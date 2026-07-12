/*custom button*/
const CustomButton = ({
                          text,
                          onClick,
                          className = '',
                          type = 'button',
                          size = 'md',
                          disabled = false,
                      }) => {
    const sizeClasses = {
        sm: 'w-32 h-10 text-xs flex items-center justify-center',
        md: 'px-5 py-2.5 text-sm w-auto',
        lg: 'px-6 py-3.5 text-base w-auto',
        full: 'px-4 py-3 text-base w-full',
    };

    return (
        <div>
            <button
                type={type}
                onClick={onClick}
                disabled={disabled}
                className={`${sizeClasses[size] || sizeClasses.md} rounded-2xl font-semibold text-center transition-all duration-200 active:scale-95 shadow-sm ${
                    disabled ? 'opacity-60 cursor-not-allowed' : ''
                } ${className}`}
            >
                {text}
            </button>
        </div>
    );
};

export default CustomButton;