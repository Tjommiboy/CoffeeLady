export default function Contact() {
  return (
    <div className="min-h-screen py-12 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
      <form
        action="mailto:coffee@coffeelady.com"
        method="GET"
        encType="text/plain"
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-xl"
      >
        <label className="block mb-4">
          <span className="block mb-1 font-semibold">Name</span>
          <input
            type="text"
            name="name"
            className="w-full rounded border border-gray-300 dark:border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900"
            placeholder="Your name"
            required
          />
        </label>
        <label className="block mb-4">
          <span className="block mb-1 font-semibold">Email</span>
          <input
            type="email"
            name="email"
            className="w-full rounded border border-gray-300 dark:border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900"
            placeholder="you@example.com"
            required
          />
        </label>
        <label className="block mb-6">
          <span className="block mb-1 font-semibold">Message</span>
          <textarea
            name="message"
            rows="5"
            className="w-full rounded border border-gray-300 dark:border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 resize-none"
            placeholder="Write your message here..."
            required
          ></textarea>
        </label>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded transition"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
