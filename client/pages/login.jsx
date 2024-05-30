import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { ClipLoader } from "react-spinners";

export default function LoginPage() {
  const router = useRouter();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const loginModalRef = useRef(null);
  const signupModalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        (loginModalRef.current &&
          !loginModalRef.current.contains(event.target)) ||
        (signupModalRef.current &&
          !signupModalRef.current.contains(event.target))
      ) {
        setLoginModalOpen(false);
        setSignupModalOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleLoginSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (response.status === 200) {
        const data = await response.json();
        localStorage.setItem("user", JSON.stringify(data.data));
        router.push("/");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
      }
    } catch (error) {
      setErrorMessage("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignupSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      if (response.status === 200 || 201) {
        const data = await response.json();
        localStorage.setItem("user", JSON.stringify(data.data));
        router.push("/");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
      }
    } catch (error) {
      setErrorMessage("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleTemplateClick = (templateNum) => {
    sessionStorage.setItem("selectedTemplate", templateNum);
    setSignupModalOpen(true);
  };

  const handleGetStartedClick = () => {
    setSignupModalOpen(true);
  };

  const switchToLogin = () => {
    setSignupModalOpen(false);
    setLoginModalOpen(true);
  };

  const switchToSignup = () => {
    setLoginModalOpen(false);
    setSignupModalOpen(true);
  };

  return (
    <div className='min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex flex-col'>
      <header className='flex justify-between items-center p-6 bg-white shadow-lg'>
        <h1 className='text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600'>
          Cvify.me
        </h1>
        <div>
          <button
            onClick={() => setLoginModalOpen(true)}
            className='px-5 py-2 bg-indigo-600 text-white font-bold rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2'
          >
            Login
          </button>
          <button
            onClick={handleGetStartedClick}
            className='px-5 py-2 bg-green-600 text-white font-bold rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
          >
            Sign Up
          </button>
        </div>
      </header>

      <main className='flex flex-col items-center p-8'>
        <h2 className='text-4xl font-extrabold mb-4 text-white drop-shadow-lg'>
          Welcome to Cvify.me
        </h2>
        <p className='mb-8 text-white text-center max-w-xl text-lg'>
          Create stunning CVs with our easy-to-use templates. Customize your CVs
          to reflect your personality and professional achievements. Stand out
          from the crowd and land your dream job with Cvify.me.
        </p>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
          <div
            className='bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl'
            onClick={() => handleTemplateClick(1)}
          >
            <img
              src='/template1.png'
              alt='Template 1'
              className='w-full rounded-md'
            />
            <h3 className='text-lg font-bold mt-4 text-indigo-600'>
              Modern Template
            </h3>
            <p className='text-gray-600'>
              Sleek and professional design suitable for any industry.
            </p>
          </div>
          <div
            className='bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl'
            onClick={() => handleTemplateClick(2)}
          >
            <img
              src='/template2.png'
              alt='Template 2'
              className='w-full rounded-md'
            />
            <h3 className='text-lg font-bold mt-4 text-purple-600'>
              Creative Template
            </h3>
            <p className='text-gray-600'>
              A unique design that showcases your creativity and skills.
            </p>
          </div>
          <div
            className='bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl'
            onClick={() => handleTemplateClick(3)}
          >
            <img
              src='/template3.png'
              alt='Template 3'
              className='w-full rounded-md'
            />
            <h3 className='text-lg font-bold mt-4 text-pink-600'>
              Classic Template
            </h3>
            <p className='text-gray-600'>
              A timeless design that emphasizes your experience and
              professionalism.
            </p>
          </div>
        </div>
        <section className='bg-white p-8 rounded-lg shadow-lg mb-12 max-w-2xl transform transition-transform duration-300 hover:scale-105 hover:shadow-xl'>
          <h2 className='text-xl font-bold mb-4 text-gray-800'>
            Why Choose Cvify.me?
          </h2>
          <p className='text-gray-600 mb-4'>
            Our platform offers a variety of templates to suit different needs
            and industries. Whether you're in the tech industry, creative arts,
            or corporate world, we have a template that fits you. With Cvify.me,
            you can:
          </p>
          <ul className='list-disc list-inside text-gray-600 space-y-2'>
            <li>Access multiple professionally designed templates.</li>
            <li>Customize your CV with easy-to-use tools.</li>
            <li>Download your CV in multiple formats.</li>
            <li>Get tips and advice on improving your CV.</li>
          </ul>
        </section>

        <section className='bg-indigo-600 text-white p-8 rounded-lg shadow-lg mb-12 max-w-2xl transform transition-transform duration-300 hover:scale-105 hover:shadow-xl'>
          <h2 className='text-xl font-bold mb-4'>
            Join Thousands of Satisfied Users
          </h2>
          <p className='mb-4'>
            Discover why thousands of job seekers around the world choose
            Cvify.me to create their CVs. Our intuitive platform makes it easy
            to create a professional CV that stands out. Sign up today and take
            the first step towards landing your dream job.
          </p>
          <button
            onClick={handleGetStartedClick}
            className='px-5 py-2 bg-white text-indigo-600 font-bold rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white'
          >
            Get Started
          </button>
        </section>

        {/* Login Modal */}
        {isLoginModalOpen && (
          <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
            <div
              ref={loginModalRef}
              className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full relative transform transition-transform duration-300 hover:scale-105'
            >
              <button
                onClick={() => setLoginModalOpen(false)}
                className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'
              >
                &times;
              </button>
              <h2 className='text-2xl font-bold mb-6 text-gray-800'>Login</h2>
              <form onSubmit={handleLoginSubmit} className='space-y-6'>
                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Email
                  </label>
                  <input
                    type='email'
                    name='email'
                    id='email'
                    placeholder='Email'
                    required
                    className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  />
                </div>
                <div>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Password
                  </label>
                  <input
                    type='password'
                    name='password'
                    id='password'
                    placeholder='Password'
                    required
                    className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  />
                </div>
                {errorMessage && (
                  <p className='text-red-500 text-sm'>{errorMessage}</p>
                )}
                {isLoading ? (
                  <div className='flex justify-center items-center'>
                    <button className='w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                      <ClipLoader color={"white"} loading={true} size={24} />
                    </button>
                  </div>
                ) : (
                  <button
                    type='submit'
                    className='w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  >
                    Login
                  </button>
                )}
                <p className='text-sm text-center text-gray-600 mt-4'>
                  Don't have an account?{" "}
                  <a
                    href='#'
                    onClick={switchToSignup}
                    className='text-indigo-600 hover:text-indigo-800'
                  >
                    Sign Up
                  </a>
                </p>
              </form>
            </div>
          </div>
        )}

        {/* Sign Up Modal */}
        {isSignupModalOpen && (
          <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
            <div
              ref={signupModalRef}
              className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full relative transform transition-transform duration-300 hover:scale-105'
            >
              <button
                onClick={() => setSignupModalOpen(false)}
                className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'
              >
                &times;
              </button>
              <h2 className='text-2xl font-bold mb-6 text-gray-800'>Sign Up</h2>
              <form onSubmit={handleSignupSubmit} className='space-y-6'>
                <div>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Name
                  </label>
                  <input
                    type='text'
                    name='name'
                    id='name'
                    placeholder='Name'
                    required
                    className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  />
                </div>
                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Email
                  </label>
                  <input
                    type='email'
                    name='email'
                    id='email'
                    placeholder='Email'
                    required
                    className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  />
                </div>
                <div>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Password
                  </label>
                  <input
                    type='password'
                    name='password'
                    id='password'
                    placeholder='Password'
                    required
                    className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  />
                </div>
                {errorMessage && (
                  <p className='text-red-500 text-sm'>{errorMessage}</p>
                )}
                {isLoading ? (
                  <div className='flex justify-center items-center'>
                    <button className='w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'>
                      <ClipLoader color={"white"} loading={true} size={24} />
                    </button>
                  </div>
                ) : (
                  <button
                    type='submit'
                    className='w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                  >
                    Sign up
                  </button>
                )}
                <p className='text-sm text-center text-gray-600 mt-4'>
                  Already have an account?{" "}
                  <a
                    href='#'
                    onClick={switchToLogin}
                    className='text-indigo-600 hover:text-indigo-800'
                  >
                    Login
                  </a>
                </p>
              </form>
            </div>
          </div>
        )}
      </main>
      <footer className='mt-auto p-6 bg-white shadow-lg'>
        <p className='text-center text-gray-600'>
          &copy; {new Date().getFullYear()} Cvify.me. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
