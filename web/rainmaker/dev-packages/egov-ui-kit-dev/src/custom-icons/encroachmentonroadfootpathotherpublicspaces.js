import React from "react";
import SvgIcon from "material-ui/SvgIcon";

const Encroachment = (props) => {
  return (
    <SvgIcon viewBox="0 0 512.273 512.273" className="custom-icon" {...props}>
      <g>
        <g >
          <g>
            <path
              d="m507.891 238.399c-6.723-35.881-21.853-66.905-43.755-89.718-9.845-10.253-21.456-19.75-34.514-28.227-14.94-9.699-32.192-18.438-54.293-27.503-9.684-3.972-19.375-7.637-28.406-11.005-14.642-5.46-30.064-10.958-45.843-16.337-5.427-1.851-10.921-3.606-16.234-5.303-8.505-2.717-17.3-5.527-25.771-8.721-5.224-1.97-7.426-3.464-8.321-4.258.046-.056.096-.115.151-.177 4.048-4.615 27.603-23.105 41.501-33.677 2.562-1.949 3.595-5.315 2.566-8.365s-3.889-5.104-7.107-5.104l-154.052-.004c-1.321 0-2.619.349-3.762 1.012-17.282 10.021-31.623 25.79-39.346 43.262-8.946 20.24-9.016 41.425-.202 61.263 12.07 27.167 37.567 42.237 60.063 55.533 5.87 3.469 11.414 6.746 16.655 10.167 3.095 2.02 6.273 4.003 9.347 5.922 11.545 7.208 22.45 14.016 31.167 23.604 8.981 9.877 11.693 22.501 7.842 36.507-8.948 32.544-35.544 61.781-59.009 87.576-4.342 4.773-8.442 9.281-12.409 13.776-11.107 12.587-27.393 30.89-44.634 50.267-56.869 63.914-94.415 106.229-98 111.846-1.474 2.309-1.571 5.238-.254 7.64 1.316 2.402 3.838 3.895 6.577 3.895l446.316.003h.001c3.251 0 6.132-2.094 7.135-5.187 11.659-35.96 22.212-72.232 35.283-121.283 15.591-58.515 19.185-105.354 11.308-147.404zm-25.803 143.543c-12.37 46.42-22.464 81.305-33.385 115.331l-26.94-.002c1.288-3.948 2.573-7.903 3.861-11.842 11.58-35.41 22.877-70.925 32.504-106.888 1.535-5.74 3.122-11.674 4.67-17.645 1.04-4.009-1.368-8.103-5.378-9.142-4.009-1.038-8.102 1.369-9.142 5.378-1.533 5.914-3.113 11.82-4.641 17.531-9.439 35.275-20.797 71.025-32.27 106.104-1.797 5.493-3.595 10.992-5.389 16.504h-157.978c-.432-1.858-1.567-3.553-3.309-4.649-3.504-2.206-8.136-1.152-10.342 2.353-.495.786-.973 1.542-1.449 2.296h-156.234c24.473-30.551 91.897-112.073 124.238-148.724 17.24-19.537 31.368-38.726 41.994-57.033 17.598-30.319 24.567-56.765 20.716-78.601-8.273-46.909-45.127-65.764-77.643-82.398-3.439-1.759-6.995-3.579-10.407-5.375l-.609-.321c-3.663-1.933-8.2-.53-10.133 3.133s-.53 8.2 3.133 10.133l.616.325c3.496 1.84 7.091 3.68 10.568 5.458 32.257 16.502 62.726 32.09 69.703 71.65 3.22 18.256-3.145 41.291-18.917 68.466-9.989 17.21-23.914 36.104-40.268 54.638-35.286 39.988-116.098 137.838-132.056 158.648h-33.85c17.882-20.753 56.744-64.428 86.981-98.411 17.252-19.389 33.547-37.702 44.675-50.313 3.892-4.41 7.956-8.878 12.258-13.607 24.597-27.04 52.476-57.688 62.375-93.693 5.207-18.939 1.227-36.9-11.207-50.575-16.423-18.062-39.863-30.237-60.635-42.514-21.565-12.746-43.864-25.926-53.987-48.71-15.023-33.815 4.366-67.718 31.667-84.447h13.639c-20.557 15.074-32.568 30.305-36.494 46.195-3.183 12.882-.813 25.756 7.045 38.265 4.324 6.883 9.904 13.112 17.058 19.042 3.188 2.643 7.916 2.201 10.561-.988 2.643-3.189 2.201-7.917-.988-10.561-5.909-4.898-10.465-9.959-13.929-15.472-5.688-9.056-7.384-17.786-5.185-26.688 3.979-16.103 20.568-32.851 49.314-49.793h50.715c-13.306 10.479-28.105 24.775-24.095 42.353 3.979 17.441 24.177 27.179 39.178 33.472 19.558 8.205 39.835 14.72 59.445 21.021 32.088 10.31 65.269 20.971 95.003 39.137 33.934 20.731 55.518 51.158 62.42 87.989 4.478 23.896 3.426 50.634-3.311 84.152l-.107.536c-.814 4.062 1.818 8.014 5.88 8.828.498.1.993.147 1.481.147 3.501 0 6.632-2.464 7.346-6.028l.106-.532c7.128-35.462 8.191-64.018 3.349-89.867-7.707-41.123-31.686-75.02-69.344-98.026-31.262-19.099-65.309-30.039-98.234-40.618-19.307-6.203-39.271-12.618-58.23-20.572-5.787-2.429-10.712-4.912-15.057-7.59-5.464-3.368-13.721-8.457-15.302-15.388-2.579-11.309 14.33-23.998 25.52-32.395 3.216-2.414 6.106-4.585 8.473-6.617 0 0 13.789 0 13.787.002-9.892 7.786-34.156 19.733-30.174 35.653 1.998 7.986 10.688 12.191 18.035 14.962 13.981 5.272 28.324 9.367 42.456 14.186 15.644 5.335 30.933 10.783 45.442 16.195 8.913 3.325 18.47 6.938 27.957 10.829 21.214 8.701 37.679 17.028 51.816 26.206 12.094 7.852 22.813 16.611 31.861 26.035 19.875 20.701 33.648 49.088 39.831 82.091 7.451 39.771 3.937 84.505-11.058 140.781z"
              fill="#fe7a51"
              data-original="#000000"
            />
            <path
              d="m344.365 199.407c1.461 2.073 3.78 3.18 6.138 3.18 1.492 0 3-.444 4.313-1.37 3.386-2.386 4.196-7.065 1.811-10.451-4.109-5.831-8.811-11.293-13.973-16.233-2.993-2.865-7.741-2.76-10.604.232-2.864 2.993-2.761 7.74.232 10.604 4.465 4.274 8.531 8.997 12.083 14.038z"
              fill="#fe7a51"
              data-original="#000000"
            />
            <path
              d="m255.083 122.518-.473-.246c-5.776-2.993-11.545-5.983-17.334-8.945-3.684-1.883-8.206-.426-10.093 3.262-1.886 3.688-.426 8.206 3.262 10.093 5.765 2.949 11.511 5.927 17.263 8.908l.473.245c1.104.572 2.283.843 3.445.843 2.712 0 5.331-1.476 6.665-4.05 1.906-3.678.47-8.204-3.208-10.11z"
              fill="#fe7a51"
              data-original="#000000"
            />
            <path
              d="m179.683 57.584c1.744-5.51 4.719-10.196 8.163-12.856 3.278-2.532 3.882-7.242 1.351-10.52-2.534-3.279-7.244-3.882-10.521-1.351-5.889 4.549-10.61 11.724-13.293 20.201-1.25 3.949.938 8.164 4.887 9.414.753.238 1.515.352 2.265.352 3.182-.001 6.136-2.043 7.148-5.24z"
              fill="#fe7a51"
              data-original="#000000"
            />
            <path
              d="m201.136 95.903c-6.751-3.314-11.424-6.268-15.152-9.576-3.098-2.75-7.838-2.466-10.588.631-2.75 3.098-2.467 7.838.631 10.588 4.779 4.242 10.484 7.888 18.499 11.822 1.063.522 2.19.769 3.3.769 2.77 0 5.435-1.542 6.738-4.196 1.825-3.718.29-8.212-3.428-10.038z"
              fill="#fe7a51"
              data-original="#000000"
            />
            <path
              d="m275.855 441.276c-3.553-2.126-8.159-.972-10.287 2.583-3.494 5.835-6.949 11.576-10.306 17.122-2.145 3.543-1.011 8.155 2.533 10.299 1.215.735 2.554 1.085 3.877 1.085 2.537 0 5.014-1.288 6.423-3.618 3.368-5.565 6.837-11.327 10.343-17.183 2.127-3.554.971-8.16-2.583-10.288z"
              fill="#fe7a51"
              data-original="#000000"
            />
            <path
              d="m364.864 224.152c-4.067.786-6.727 4.72-5.94 8.787.91 4.713 1.372 9.468 1.372 14.132 0 .358-.003.716-.009 1.09-.015.976-.044 1.947-.087 2.915-.187 4.138 3.018 7.643 7.155 7.829.115.005.229.008.343.008 3.986 0 7.306-3.14 7.486-7.163.051-1.117.084-2.239.101-3.35.008-.443.011-.887.011-1.33 0-5.617-.554-11.33-1.645-16.978-.787-4.067-4.728-6.725-8.787-5.94z"
              fill="#fe7a51"
              data-original="#000000"
            />
            <path
              d="m306.254 389.481c-3.582-2.073-8.172-.853-10.249 2.731-3.232 5.582-6.606 11.37-10.062 17.261-2.096 3.573-.897 8.168 2.676 10.264 1.192.699 2.498 1.031 3.787 1.031 2.574 0 5.08-1.326 6.477-3.707 3.469-5.915 6.856-11.728 10.103-17.332 2.076-3.583.852-8.171-2.732-10.248z"
              fill="#fe7a51"
              data-original="#000000"
            />
            <path
              d="m361.929 283.314c-3.883-1.446-8.201.53-9.646 4.413-2.091 5.619-4.592 11.404-7.646 17.686-1.811 3.725-.259 8.213 3.466 10.024 1.057.514 2.174.756 3.273.756 2.781 0 5.454-1.553 6.751-4.223 3.266-6.718 5.952-12.937 8.214-19.011 1.445-3.882-.53-8.2-4.412-9.645z"
              fill="#fe7a51"
              data-original="#000000"
            />
            <path
              d="m335.92 337.275c-3.585-2.075-8.173-.852-10.249 2.733-3.109 5.372-6.634 11.46-9.975 17.517-2 3.627-.682 8.189 2.945 10.19 1.148.633 2.391.934 3.615.934 2.644 0 5.207-1.401 6.574-3.879 3.266-5.92 6.749-11.938 9.822-17.247 2.077-3.585.852-8.172-2.732-10.248z"
              fill="#fe7a51"
              data-original="#000000"
            />
            <path
              d="m308.001 151.402c-3.218-1.838-6.474-3.763-9.621-5.624-2.531-1.496-5.059-2.99-7.6-4.461-3.586-2.075-8.174-.852-10.248 2.733-2.076 3.584-.853 8.173 2.732 10.249 2.501 1.448 4.99 2.919 7.482 4.393 3.194 1.888 6.498 3.841 9.813 5.735 1.174.67 2.452.989 3.714.989 2.604 0 5.135-1.358 6.519-3.781 2.056-3.597.806-8.178-2.791-10.233z"
              fill="#fe7a51"
              data-original="#000000"
            />
          </g>
        </g>
      </g>
    </SvgIcon>
  );
};

export default Encroachment;
