const Login = () => {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white w-[350px] p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-6">
            GigFlow Login
          </h1>
  
          <form className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Enter email"
              className="border border-gray-300 p-3 rounded-md outline-none"
            />
  
            <input
              type="password"
              placeholder="Enter password"
              className="border border-gray-300 p-3 rounded-md outline-none"
            />
  
            <button
              className="bg-black text-white p-3 rounded-md"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  export default Login;
  