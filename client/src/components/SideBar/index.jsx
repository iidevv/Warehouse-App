import { NavLink } from "react-router-dom";

const SideBar = (props) => {
  return (
    <div className="relative hidden h-screen my-4 ml-4 shadow-lg lg:block w-80">
      <div className="h-full bg-white rounded-2xl">
        <div className="flex items-center justify-center pt-6">
          {/* <svg
            className="logo__regular"
            width="180"
            height="125"
            viewBox="0 0 180 125"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.71101 112.156C8.71101 113.367 8.28573 114.401 7.43515 115.26C6.58457 116.119 5.55843 116.549 4.35551 116.549H0V98.1902H4.35551C5.56709 98.1902 6.59693 98.6197 7.44256 99.4788C8.2882 100.338 8.71101 101.367 8.71101 102.568V112.157V112.156ZM2.7718 113.81H4.44328C4.88341 113.81 5.2543 113.652 5.5572 113.335C5.86009 113.017 6.01216 112.645 6.01216 112.215V102.611C6.01216 102.172 5.85762 101.797 5.54978 101.484C5.24194 101.172 4.87228 101.015 4.44328 101.015H2.7718V113.811V113.81Z"
              fill="url(#paint0_linear_35_2)"
            ></path>
            <path
              d="M13.9158 116.549H11.144V98.205H13.9158V116.549Z"
              fill="url(#paint1_linear_35_2)"
            ></path>
            <path
              d="M25.3974 111.981C25.4172 113.259 25.0846 114.353 24.3997 115.26C23.9497 115.875 23.3142 116.309 22.4933 116.563C22.0532 116.7 21.5401 116.768 20.9541 116.768C19.8686 116.768 18.9698 116.5 18.2553 115.964C17.6594 115.524 17.1871 114.927 16.8409 114.17C16.4935 113.414 16.2908 112.547 16.2327 111.572L18.8722 111.382C18.9896 112.451 19.2727 113.226 19.7228 113.707C20.0553 114.07 20.4361 114.242 20.8663 114.222C21.4721 114.202 21.9568 113.905 22.3178 113.328C22.5032 113.046 22.5959 112.64 22.5959 112.113C22.5959 111.351 22.2485 110.593 21.555 109.842C21.0073 109.324 20.1864 108.547 19.091 107.511C18.1724 106.623 17.5221 105.827 17.1413 105.123C16.7309 104.332 16.5257 103.472 16.5257 102.545C16.5257 100.875 17.0882 99.6096 18.212 98.7494C18.9056 98.2322 19.766 97.973 20.7934 97.973C21.8208 97.973 22.6268 98.1927 23.3303 98.6321C23.878 98.974 24.3206 99.4517 24.6569 100.066C24.9944 100.681 25.1971 101.389 25.2651 102.189L22.6108 102.672C22.5329 101.92 22.3178 101.335 21.9654 100.915C21.7107 100.613 21.3448 100.461 20.8651 100.461C20.357 100.461 19.9713 100.686 19.7067 101.135C19.4916 101.497 19.384 101.945 19.384 102.482C19.384 103.321 19.7462 104.175 20.4695 105.044C20.7427 105.376 21.1532 105.766 21.7008 106.215C22.3462 106.752 22.7715 107.128 22.9767 107.342C23.6604 108.026 24.1883 108.699 24.5604 109.363C24.736 109.675 24.8782 109.963 24.9857 110.227C25.2503 110.881 25.3863 111.466 25.3962 111.983L25.3974 111.981Z"
              fill="url(#paint2_linear_35_2)"
            ></path>
            <path
              d="M32.055 116.783C30.8323 116.783 29.7938 116.356 28.9383 115.502C28.0828 114.648 27.655 113.616 27.655 112.405V102.392C27.655 101.172 28.0853 100.135 28.9457 99.2813C29.8062 98.4272 30.8422 98.0001 32.055 98.0001C33.2679 98.0001 34.3138 98.4296 35.1631 99.2887C36.0137 100.148 36.439 101.182 36.439 102.392V104.485H33.5646V102.332C33.5646 101.893 33.4076 101.518 33.0948 101.205C32.782 100.893 32.4062 100.738 31.966 100.738C31.5259 100.738 31.1525 100.894 30.8447 101.205C30.5369 101.518 30.3823 101.894 30.3823 102.332V112.376C30.3823 112.815 30.5369 113.188 30.8447 113.495C31.1525 113.802 31.5271 113.957 31.966 113.957C32.4049 113.957 32.782 113.802 33.0948 113.495C33.4076 113.188 33.5646 112.814 33.5646 112.376V109.843H36.439V112.405C36.439 113.626 36.0087 114.66 35.1483 115.509C34.2878 116.358 33.2567 116.783 32.0538 116.783H32.055Z"
              fill="url(#paint3_linear_35_2)"
            ></path>
            <path
              d="M43.0519 97.9705C44.2734 97.9705 45.3119 98.4 46.1674 99.259C47.0229 100.118 47.4507 101.152 47.4507 102.363V112.377C47.4507 113.596 47.0205 114.634 46.16 115.487C45.2995 116.341 44.2635 116.768 43.0507 116.768C41.8379 116.768 40.792 116.339 39.9426 115.48C39.092 114.621 38.6667 113.586 38.6667 112.377V102.363C38.6667 101.144 39.097 100.107 39.9574 99.2529C40.8179 98.3987 41.849 97.9717 43.0519 97.9717V97.9705ZM44.5627 102.304C44.5627 101.865 44.4082 101.492 44.1003 101.184C43.7925 100.877 43.4179 100.723 42.979 100.723C42.5401 100.723 42.163 100.877 41.8502 101.184C41.5375 101.492 41.3817 101.866 41.3817 102.304V112.347C41.3817 112.786 41.5375 113.159 41.8502 113.467C42.163 113.774 42.5401 113.928 42.979 113.928C43.4179 113.928 43.7925 113.774 44.1003 113.467C44.4082 113.159 44.5627 112.785 44.5627 112.347V102.304Z"
              fill="url(#paint4_linear_35_2)"
            ></path>
            <path
              d="M54.2553 116.753C53.0338 116.753 51.9965 116.329 51.1472 115.48C50.2966 114.63 49.8713 113.601 49.8713 112.39V98.205H52.5838V112.362C52.5838 112.801 52.7396 113.174 53.0524 113.481C53.3651 113.789 53.7422 113.943 54.1811 113.943C54.62 113.943 54.9946 113.789 55.3024 113.481C55.6103 113.174 55.7648 112.8 55.7648 112.362V98.205H58.6541V112.39C58.6541 113.62 58.2238 114.655 57.3634 115.494C56.5029 116.334 55.4669 116.753 54.254 116.753H54.2553Z"
              fill="url(#paint5_linear_35_2)"
            ></path>
            <path
              d="M64.2285 98.1902L67.9065 110.528V98.1902H70.6783V116.549H67.7013L63.8885 104.793V116.549H61.1167V98.1902H64.2285Z"
              fill="url(#paint6_linear_35_2)"
            ></path>
            <path
              d="M75.8548 100.987H72.9075V98.205H81.5591V100.987H78.6266V116.549H75.8548V100.987Z"
              fill="url(#paint7_linear_35_2)"
            ></path>
            <path
              d="M89.5753 116.549H86.8035V98.1902H90.7807L93.3633 111.378L95.8421 98.1902H99.6635V116.549H96.8917V105.013L94.4871 116.549H92.258L89.574 105.042V116.549H89.5753Z"
              fill="url(#paint8_linear_35_2)"
            ></path>
            <path
              d="M106.482 97.9705C107.703 97.9705 108.742 98.4 109.597 99.259C110.453 100.118 110.881 101.152 110.881 102.363V112.377C110.881 113.596 110.45 114.634 109.59 115.487C108.729 116.341 107.693 116.768 106.481 116.768C105.268 116.768 104.222 116.339 103.373 115.48C102.522 114.621 102.097 113.586 102.097 112.377V102.363C102.097 101.144 102.527 100.107 103.387 99.2529C104.248 98.3987 105.279 97.9717 106.482 97.9717V97.9705ZM107.993 102.304C107.993 101.865 107.838 101.492 107.53 101.184C107.222 100.877 106.848 100.723 106.409 100.723C105.97 100.723 105.593 100.877 105.28 101.184C104.967 101.492 104.812 101.866 104.812 102.304V112.347C104.812 112.786 104.967 113.159 105.28 113.467C105.593 113.774 105.97 113.928 106.409 113.928C106.848 113.928 107.222 113.774 107.53 113.467C107.838 113.159 107.993 112.785 107.993 112.347V102.304Z"
              fill="url(#paint9_linear_35_2)"
            ></path>
            <path
              d="M115.734 100.987H112.787V98.205H121.439V100.987H118.506V116.549H115.734V100.987Z"
              fill="url(#paint10_linear_35_2)"
            ></path>
            <path
              d="M127.729 97.9705C128.95 97.9705 129.989 98.4 130.844 99.259C131.7 100.118 132.128 101.152 132.128 102.363V112.377C132.128 113.596 131.697 114.634 130.837 115.487C129.977 116.341 128.941 116.768 127.728 116.768C126.515 116.768 125.469 116.339 124.62 115.48C123.769 114.621 123.344 113.586 123.344 112.377V102.363C123.344 101.144 123.774 100.107 124.634 99.2529C125.495 98.3987 126.526 97.9717 127.729 97.9717V97.9705ZM129.24 102.304C129.24 101.865 129.085 101.492 128.777 101.184C128.469 100.877 128.095 100.723 127.656 100.723C127.217 100.723 126.84 100.877 126.527 101.184C126.214 101.492 126.059 101.866 126.059 102.304V112.347C126.059 112.786 126.214 113.159 126.527 113.467C126.84 113.774 127.217 113.928 127.656 113.928C128.095 113.928 128.469 113.774 128.777 113.467C129.085 113.159 129.24 112.785 129.24 112.347V102.304Z"
              fill="url(#paint11_linear_35_2)"
            ></path>
            <path
              d="M141.773 116.783C140.551 116.783 139.512 116.354 138.658 115.494C137.802 114.635 137.375 113.606 137.375 112.405V102.392C137.375 101.172 137.805 100.135 138.665 99.2813C139.526 98.4272 140.562 98.0001 141.775 98.0001C142.987 98.0001 144.033 98.4296 144.884 99.2887C145.734 100.148 146.16 101.182 146.16 102.392V104.485H143.285V102.332C143.285 101.893 143.128 101.518 142.815 101.205C142.503 100.893 142.127 100.738 141.687 100.738C141.247 100.738 140.873 100.894 140.565 101.205C140.258 101.518 140.103 101.894 140.103 102.332V112.376C140.103 112.815 140.258 113.188 140.565 113.495C140.873 113.802 141.248 113.957 141.687 113.957C142.126 113.957 142.503 113.804 142.815 113.496C143.128 113.19 143.285 112.817 143.285 112.379V108.774H141.746V105.992H146.16V112.404C146.16 113.625 145.729 114.659 144.869 115.508C144.009 116.357 142.977 116.782 141.775 116.782L141.773 116.783Z"
              fill="url(#paint12_linear_35_2)"
            ></path>
            <path
              d="M148.562 116.549V98.1902H156.451V100.972H151.333V105.98H155.072V108.762H151.333V113.768H156.451V116.55H148.562V116.549Z"
              fill="url(#paint13_linear_35_2)"
            ></path>
            <path
              d="M161.916 112.332L161.243 116.549H158.357L161.48 98.205H165.293L168.372 116.549H165.459L164.811 112.332H161.916ZM163.373 102.406L162.347 109.638H164.4L163.374 102.406H163.373Z"
              fill="url(#paint14_linear_35_2)"
            ></path>
            <path
              d="M175.073 98.205C176.618 98.205 177.751 98.6295 178.476 99.4787C179.111 100.22 179.429 101.255 179.429 102.582V105.246C179.429 106.545 178.936 107.642 177.948 108.541L180 116.549H177.003L175.323 109.639H173.476V116.549H170.704V98.205H175.075H175.073ZM176.73 102.626C176.73 101.562 176.202 101.03 175.146 101.03H173.475V106.9H175.146C175.587 106.9 175.96 106.745 176.268 106.433C176.576 106.12 176.73 105.744 176.73 105.306V102.626Z"
              fill="url(#paint15_linear_35_2)"
            ></path>
            <path
              d="M70.6327 49.0753C70.6327 51.6438 69.8798 54.0346 68.5854 56.0353C67.2205 58.1607 65.2375 59.843 62.9033 60.8218C61.4297 61.4488 59.8101 61.7894 58.1151 61.7894H50.3474C48.7439 61.7894 47.2653 60.8971 46.4963 59.469L44.3835 55.5428H56.7997C57.8506 55.5428 58.8421 55.2836 59.7137 54.8233C60.8301 54.2444 61.7499 53.3409 62.3569 52.2326C62.8774 51.3019 63.1692 50.2257 63.1692 49.0741C63.1692 47.9978 62.9095 46.987 62.4546 46.0946C62.1517 45.5046 61.761 44.964 61.3011 44.4987C60.1476 43.3311 58.5553 42.6053 56.7997 42.6053H40.0292C38.4208 42.6053 36.9421 41.713 36.1719 40.28L34.0591 36.3588H58.1151C64.6428 36.3588 69.9997 41.4316 70.5796 47.9102C70.6179 48.294 70.634 48.6779 70.634 49.0729L70.6327 49.0753Z"
              fill="url(#paint16_linear_35_2)"
            ></path>
            <path
              d="M58.0989 51.7722L58.1199 51.7611C58.6281 51.4982 59.0435 51.0885 59.3229 50.5787L59.3377 50.5516C59.5862 50.1072 59.7123 49.611 59.7123 49.0754C59.7123 48.5792 59.5986 48.1053 59.376 47.6659C59.2314 47.3869 59.0521 47.1388 58.8419 46.9253C58.2881 46.3649 57.5636 46.0576 56.7983 46.0576H40.0464L42.1296 49.8591C42.7947 51.0736 43.989 51.892 45.339 52.0919H56.7983C57.2582 52.0919 57.6959 51.9845 58.0989 51.7722Z"
              fill="url(#paint17_linear_35_2)"
            ></path>
            <path
              d="M109.367 49.0753C109.367 51.6438 110.12 54.0346 111.415 56.0353C112.78 58.1607 114.763 59.843 117.097 60.8218C118.571 61.4488 120.19 61.7894 121.885 61.7894H129.653C131.256 61.7894 132.735 60.8971 133.504 59.469L135.617 55.5428H123.2C122.15 55.5428 121.158 55.2836 120.286 54.8233C119.17 54.2444 118.25 53.3409 117.643 52.2326C117.123 51.3019 116.831 50.2257 116.831 49.0741C116.831 47.9978 117.091 46.987 117.546 46.0946C117.849 45.5046 118.239 44.964 118.699 44.4987C119.853 43.3311 121.445 42.6053 123.2 42.6053H139.971C141.579 42.6053 143.058 41.713 143.828 40.28L145.941 36.3588H121.885C115.357 36.3588 110 41.4316 109.421 47.9102C109.382 48.294 109.366 48.6779 109.366 49.0729L109.367 49.0753Z"
              fill="url(#paint18_linear_35_2)"
            ></path>
            <path
              d="M123.291 49.1876L121.67 52.2338H130.195L128.955 54.6233H136.043L139.985 46.0958H128.444C126.285 46.0958 124.303 47.2844 123.291 49.1876Z"
              fill="url(#paint19_linear_35_2)"
            ></path>
            <path
              d="M81.6852 34.5531C81.3007 34.5148 80.9162 34.4988 80.5206 34.4988C77.9478 34.4988 75.5531 35.2504 73.5491 36.5427C72.0123 37.5264 70.708 38.8335 69.7313 40.3615C71.2977 42.5029 72.2633 45.043 72.5056 47.7325C72.5477 48.1633 72.5687 48.6027 72.5687 49.0754C72.5687 51.9314 71.7539 54.6999 70.211 57.0845C69.63 57.9879 68.9587 58.8161 68.2107 59.5579C68.6075 60.3873 69.2653 61.0896 70.1097 61.5426L74.0423 63.652V48.3114C74.0423 47.2622 74.302 46.2724 74.7631 45.4022C75.3429 44.2877 76.2479 43.3694 77.3581 42.7634C78.2903 42.2437 79.3684 41.9525 80.5218 41.9525C81.5999 41.9525 82.6124 42.2117 83.5063 42.6659C84.0972 42.9683 84.6387 43.3583 85.1048 43.8174C86.2744 44.969 87.0013 46.5587 87.0013 48.3114V57.693C87.0013 59.2987 87.8952 60.7749 89.3305 61.5438L93.2583 63.6532V46.9981C93.2583 40.4812 88.177 35.1332 81.6877 34.5543L81.6852 34.5531Z"
              fill="url(#paint20_linear_35_2)"
            ></path>
            <path
              d="M109.787 57.0783C108.247 54.6999 107.433 51.9314 107.433 49.0754C107.433 48.6014 107.454 48.162 107.496 47.7325C107.738 45.0418 108.705 42.5005 110.272 40.3578C108.214 37.1438 104.705 34.9147 100.645 34.5531C100.261 34.5148 99.8764 34.4988 99.4807 34.4988C96.908 34.4988 94.5133 35.2504 92.5092 36.5427C92.1284 36.7859 91.7637 37.05 91.4126 37.3314C93.1274 39.1988 94.2994 41.4489 94.8433 43.868C95.2748 43.4336 95.7706 43.0596 96.317 42.7621C97.2492 42.2425 98.3273 41.9512 99.4807 41.9512C100.559 41.9512 101.571 42.2104 102.465 42.6646C103.056 42.967 103.598 43.3571 104.064 43.8162C105.233 44.9678 105.96 46.5575 105.96 48.3101V57.6917C105.96 59.2975 106.854 60.7737 108.289 61.5426L112.217 63.652V59.9628C111.295 59.1198 110.478 58.1533 109.788 57.0783H109.787Z"
              fill="url(#paint21_linear_35_2)"
            ></path>
            <path
              d="M121.886 63.7211C120.225 63.7211 118.611 63.4409 117.078 62.8879C116.199 64.2469 115.22 65.5367 114.152 66.745V66.8845L114.068 66.8388C108.168 73.4557 99.5721 77.625 90.0006 77.625C78.6426 77.625 68.657 71.7549 62.923 62.8879C61.39 63.4409 59.7766 63.7211 58.115 63.7211H50.3473C49.9072 63.7211 49.4744 63.6754 49.0541 63.5865C48.6152 64.2308 48.5645 65.0862 48.9713 65.7897L51.9532 70.9452C52.4601 71.8227 53.5295 72.2054 54.479 71.8499L58.11 70.4934C58.9149 70.1923 59.8273 70.4132 60.3898 71.0624C61.6484 72.5127 63.0132 73.8691 64.4708 75.1207C65.1249 75.6823 65.3486 76.5956 65.047 77.4028L63.6833 81.0402C63.3273 81.9893 63.7105 83.0557 64.5895 83.5618L69.7536 86.5388C70.6326 87.0448 71.749 86.8437 72.3943 86.0611L74.8756 83.0545C75.4233 82.3905 76.327 82.1276 77.1405 82.4102C78.9344 83.0347 80.7851 83.5346 82.6878 83.895C83.5334 84.0555 84.1837 84.7355 84.3259 85.5835L84.9688 89.4245C85.1357 90.4242 86.0024 91.1562 87.0174 91.1562H92.9813C93.9963 91.1562 94.8617 90.4242 95.0299 89.4245L95.6727 85.5835C95.8149 84.7355 96.4652 84.0555 97.3108 83.895C99.2123 83.5346 101.064 83.0347 102.858 82.4102C103.672 82.1276 104.575 82.3905 105.123 83.0545L107.604 86.0611C108.25 86.8437 109.366 87.0448 110.245 86.5388L115.409 83.5618C116.288 83.0557 116.671 81.9881 116.315 81.0402L114.952 77.4028C114.65 76.5968 114.874 75.6823 115.528 75.1207C116.985 73.8691 118.35 72.5127 119.609 71.0624C120.171 70.4144 121.084 70.1935 121.889 70.4934L125.52 71.8499C126.47 72.2054 127.539 71.8227 128.045 70.9452L131.027 65.7897C131.434 65.0862 131.383 64.2308 130.945 63.5865C130.524 63.6754 130.092 63.7211 129.651 63.7211H121.884H121.886Z"
              fill="url(#paint22_linear_35_2)"
            ></path>
            <path
              d="M59.71 34.5185C64.1978 22.1525 76.0651 13.3176 89.9995 13.3176C103.934 13.3176 115.802 22.1525 120.289 34.5185C120.816 34.4593 121.349 34.4284 121.885 34.4284H127.577C127.4 33.8286 127.21 33.2349 127.006 32.6474C126.723 31.8352 126.987 30.9355 127.651 30.3887L130.55 28.0041C131.334 27.3598 131.536 26.2453 131.029 25.3677L128.047 20.2122C127.54 19.3347 126.471 18.952 125.521 19.3075L122.027 20.6121C121.219 20.9145 120.301 20.6899 119.74 20.0357C118.461 18.546 117.072 17.1537 115.584 15.8701C114.932 15.3085 114.711 14.3964 115.012 13.5917L116.316 10.116C116.672 9.16684 116.288 8.10044 115.409 7.59439L110.245 4.61736C109.366 4.11131 108.25 4.3125 107.605 5.09502L105.259 7.93628C104.71 8.60155 103.803 8.86568 102.988 8.5781C101.142 7.92888 99.2347 7.41049 97.2739 7.04144C96.4271 6.88222 95.778 6.20091 95.6358 5.35298L95.0301 1.73166C94.8632 0.731915 93.9965 0 92.9815 0H87.0176C86.0025 0 85.1371 0.731915 84.969 1.73166L84.3632 5.35298C84.221 6.20091 83.5707 6.88222 82.7251 7.04144C80.7643 7.41049 78.8567 7.92888 77.0109 8.5781C76.1962 8.86444 75.29 8.60155 74.7398 7.93628L72.3945 5.09502C71.7492 4.3125 70.6328 4.11131 69.7538 4.61736L64.5897 7.59439C63.7107 8.10044 63.3275 9.16807 63.6835 10.116L64.9866 13.5917C65.2882 14.3964 65.0669 15.3085 64.4154 15.8701C62.9281 17.1525 61.5385 18.5447 60.2589 20.0357C59.6977 20.6899 58.7803 20.9133 57.9718 20.6121L54.478 19.3075C53.5273 18.952 52.4591 19.3347 51.9522 20.2122L48.9702 25.3677C48.4633 26.2453 48.6649 27.3598 49.4487 28.0041L52.3478 30.3887C53.0117 30.9355 53.2763 31.8365 52.9932 32.6474C52.7879 33.2349 52.5988 33.8298 52.422 34.4284H58.1139C58.6505 34.4284 59.1821 34.4593 59.71 34.5185Z"
              fill="url(#paint23_linear_35_2)"
            ></path>
            <path
              d="M114.151 66.329L113.817 66.7067C107.969 73.2396 99.4658 77.3522 89.9994 77.3522C78.7589 77.3522 68.8758 71.5536 63.1851 62.7904C62.2999 63.1298 61.3863 63.3779 60.4517 63.531C66.5429 73.4433 77.4979 80.0552 89.9994 80.0552C102.501 80.0552 113.456 73.4433 119.547 63.531C118.612 63.3767 117.699 63.1298 116.814 62.7904C116.008 64.0321 115.117 65.2145 114.151 66.329Z"
              fill="url(#paint24_linear_35_2)"
            ></path>
            <path
              d="M59.9905 34.5519C64.456 22.3228 76.2071 13.5917 90.0006 13.5917C103.794 13.5917 115.545 22.3228 120.011 34.5519C120.629 34.4704 121.256 34.4284 121.886 34.4284H122.837C118.222 20.7442 105.264 10.8887 90.0006 10.8887C74.7372 10.8887 61.7794 20.7442 57.1643 34.4284H58.115C58.7468 34.4284 59.3724 34.4704 59.9905 34.5519Z"
              fill="url(#paint25_linear_35_2)"
            ></path>
            <path
              d="M46.1809 124.155C53.4838 123.859 60.7879 123.705 68.0907 123.599L70.8291 123.557L73.5676 123.53L79.0444 123.479L89.9993 123.439L100.954 123.476L106.431 123.527L109.169 123.554L111.908 123.596C119.211 123.701 126.515 123.857 133.818 124.154C126.515 124.452 119.211 124.607 111.908 124.712L109.169 124.754L106.431 124.781L100.954 124.832L89.9993 124.869L79.0444 124.829L73.5676 124.779L70.8291 124.751L68.0907 124.709C60.7879 124.605 53.4838 124.449 46.1809 124.153V124.155Z"
              fill="url(#paint26_linear_35_2)"
            ></path>
            <defs>
              <linearGradient
                id="paint0_linear_35_2"
                x1="4.35551"
                y1="95.381"
                x2="4.35551"
                y2="121.878"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#EF4136"></stop>
                <stop offset="1" stop-color="#F7941D"></stop>
              </linearGradient>
              <linearGradient
                id="paint1_linear_35_2"
                x1="12.5299"
                y1="95.381"
                x2="12.5299"
                y2="121.878"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#EF4136"></stop>
                <stop offset="1" stop-color="#F7941D"></stop>
              </linearGradient>
              <linearGradient
                id="paint2_linear_35_2"
                x1="20.8157"
                y1="95.3811"
                x2="20.8157"
                y2="121.878"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#EF4136"></stop>
                <stop offset="1" stop-color="#F7941D"></stop>
              </linearGradient>
              <linearGradient
                id="paint3_linear_35_2"
                x1="32.0476"
                y1="95.381"
                x2="32.0476"
                y2="121.878"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#EF4136"></stop>
                <stop offset="1" stop-color="#F7941D"></stop>
              </linearGradient>
              <linearGradient
                id="paint4_linear_35_2"
                x1="43.0593"
                y1="95.381"
                x2="43.0593"
                y2="121.878"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#EF4136"></stop>
                <stop offset="1" stop-color="#F7941D"></stop>
              </linearGradient>
              <linearGradient
                id="paint5_linear_35_2"
                x1="54.2627"
                y1="95.381"
                x2="54.2627"
                y2="121.878"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#EF4136"></stop>
                <stop offset="1" stop-color="#F7941D"></stop>
              </linearGradient>
              <linearGradient
                id="paint6_linear_35_2"
                x1="65.8975"
                y1="95.381"
                x2="65.8975"
                y2="121.878"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#EF4136"></stop>
                <stop offset="1" stop-color="#F7941D"></stop>
              </linearGradient>
              <linearGradient
                id="paint7_linear_35_2"
                x1="77.2321"
                y1="95.381"
                x2="77.2321"
                y2="121.878"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#EF4136"></stop>
                <stop offset="1" stop-color="#F7941D"></stop>
              </linearGradient>
              <linearGradient
                id="paint8_linear_35_2"
                x1="93.2335"
                y1="95.381"
                x2="93.2335"
                y2="121.878"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#414042"></stop>
                <stop offset="1" stop-color="#939598"></stop>
              </linearGradient>
              <linearGradient
                id="paint9_linear_35_2"
                x1="106.489"
                y1="95.381"
                x2="106.489"
                y2="121.878"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#414042"></stop>
                <stop offset="1" stop-color="#939598"></stop>
              </linearGradient>
              <linearGradient
                id="paint10_linear_35_2"
                x1="117.113"
                y1="95.381"
                x2="117.113"
                y2="121.878"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#414042"></stop>
                <stop offset="1" stop-color="#939598"></stop>
              </linearGradient>
              <linearGradient
                id="paint11_linear_35_2"
                x1="127.736"
                y1="95.381"
                x2="127.736"
                y2="121.878"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#414042"></stop>
                <stop offset="1" stop-color="#939598"></stop>
              </linearGradient>
              <linearGradient
                id="paint12_linear_35_2"
                x1="141.766"
                y1="95.381"
                x2="141.766"
                y2="121.878"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#EF4136"></stop>
                <stop offset="1" stop-color="#F7941D"></stop>
              </linearGradient>
              <linearGradient
                id="paint13_linear_35_2"
                x1="152.507"
                y1="95.381"
                x2="152.507"
                y2="121.878"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#EF4136"></stop>
                <stop offset="1" stop-color="#F7941D"></stop>
              </linearGradient>
              <linearGradient
                id="paint14_linear_35_2"
                x1="163.365"
                y1="95.381"
                x2="163.365"
                y2="121.878"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#EF4136"></stop>
                <stop offset="1" stop-color="#F7941D"></stop>
              </linearGradient>
              <linearGradient
                id="paint15_linear_35_2"
                x1="175.353"
                y1="95.381"
                x2="175.353"
                y2="121.878"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#EF4136"></stop>
                <stop offset="1" stop-color="#F7941D"></stop>
              </linearGradient>
              <linearGradient
                id="paint16_linear_35_2"
                x1="52.3453"
                y1="32.1611"
                x2="52.3453"
                y2="74.796"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#EF4136"></stop>
                <stop offset="1" stop-color="#F7941D"></stop>
              </linearGradient>
              <linearGradient
                id="paint17_linear_35_2"
                x1="49.8787"
                y1="32.1611"
                x2="49.8787"
                y2="74.7961"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#EF4136"></stop>
                <stop offset="1" stop-color="#F7941D"></stop>
              </linearGradient>
              <linearGradient
                id="paint18_linear_35_2"
                x1="127.655"
                y1="32.1611"
                x2="127.655"
                y2="74.796"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#EF4136"></stop>
                <stop offset="1" stop-color="#F7941D"></stop>
              </linearGradient>
              <linearGradient
                id="paint19_linear_35_2"
                x1="130.827"
                y1="32.161"
                x2="130.827"
                y2="74.7997"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#EF4136"></stop>
                <stop offset="1" stop-color="#F7941D"></stop>
              </linearGradient>
              <linearGradient
                id="paint20_linear_35_2"
                x1="80.7332"
                y1="32.1611"
                x2="80.7332"
                y2="74.7961"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#414042"></stop>
                <stop offset="1" stop-color="#939598"></stop>
              </linearGradient>
              <linearGradient
                id="paint21_linear_35_2"
                x1="101.814"
                y1="32.1611"
                x2="101.814"
                y2="74.7961"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#414042"></stop>
                <stop offset="1" stop-color="#939598"></stop>
              </linearGradient>
              <linearGradient
                id="paint22_linear_35_2"
                x1="90.1168"
                y1="-0.399883"
                x2="89.9541"
                y2="91.0117"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#808285"></stop>
                <stop offset="1" stop-color="#414042"></stop>
              </linearGradient>
              <linearGradient
                id="paint23_linear_35_2"
                x1="90.0477"
                y1="-0.3999"
                x2="89.8863"
                y2="91.0105"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#808285"></stop>
                <stop offset="1" stop-color="#414042"></stop>
              </linearGradient>
              <linearGradient
                id="paint24_linear_35_2"
                x1="90.0946"
                y1="10.5899"
                x2="89.9714"
                y2="79.9392"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#414042"></stop>
                <stop offset="1" stop-color="#939598"></stop>
              </linearGradient>
              <linearGradient
                id="paint25_linear_35_2"
                x1="90.0426"
                y1="10.59"
                x2="89.9194"
                y2="79.9393"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#414042"></stop>
                <stop offset="1" stop-color="#939598"></stop>
              </linearGradient>
              <linearGradient
                id="paint26_linear_35_2"
                x1="46.1809"
                y1="124.155"
                x2="133.82"
                y2="124.155"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#414042"></stop>
                <stop offset="1" stop-color="#939598"></stop>
              </linearGradient>
            </defs>
          </svg> */}
        </div>
        <nav className="mt-6">
          <ul>
            <li>
                <NavLink 
                to="/"
                className={({isPending, isActive}) => isActive ? "active-menu-link" : "menu-link"}
                >
                    <span className="mx-4 text-sm font-normal">Dashboard</span>
                </NavLink>
            </li>
            <li>
                <NavLink
                to="/settings"
                className={({isPending, isActive}) => isActive ? "active-menu-link" : "menu-link"}
                >
                    <span className="mx-4 text-sm font-normal">Settings</span>
                </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SideBar;
