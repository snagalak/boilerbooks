import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function BookForm() {
  const [form, setForm] = useState({
    book_ISBN: "",
    user_name: "",
    title: "",
    price: "",
    genre_name: "",
    condition: "",
    author_name: "",
    rating: "",
  });
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [users, setUsers] = useState([]);
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch genres from the API
    async function fetchGenres() {
      try {
        const response = await fetch("https://boilerbooks.azurewebsites.net/record/genres");

        if (!response.ok) {
          throw new Error(`Error fetching genres: ${response.statusText}`);
        }

        const data = await response.json();
        setGenres(data.genres || data);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    }

    async function fetchAuthors() {
      try {
        console.log("Fetching genres...");
        const response = await fetch("https://boilerbooks.azurewebsites.net/record/authors");

        if (!response.ok) {
          throw new Error(`Error fetching genres: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched genres data:", data);
        setAuthors(data.authors || data);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    }

    async function fetchUsers() {
      try {
        const response = await fetch("https://boilerbooks.azurewebsites.net/record/users");

        if (!response.ok) {
          throw new Error(`Error fetching genres: ${response.statusText}`);
        }

        const data = await response.json();
        setUsers(data.users || data);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    }
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      console.log("here");
      if (!id) return;
      setIsNew(false);
      const response = await fetch(
        `https://boilerbooks.azurewebsites.net/record/${params.id.toString()}`
      );
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const record = await response.json();
      if (!record) {
        console.warn(`Record with id ${id} not found`);
        navigate("/");
        return;
      }
      setForm(record);
    }

    fetchGenres();
    fetchAuthors();
    fetchData();
    fetchUsers();
    return;
  }, [params.id, navigate]);

  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    const bookData = { ...form };
    try {
      let response;
      if (isNew) {
        response = await fetch("https://boilerbooks.azurewebsites.net/record", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookData),
        });
      } else {
        response = await fetch(`https://boilerbooks.azurewebsites.net/record/${params.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookData),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("A problem occurred with your fetch operation: ", error);
    } finally {
      setForm({
        book_ISBN: "",
        title: "",
        price: "",
        genre_name: "",
        condition: "",
        author_name: "",
        user_name: "",
        rating: "",
      });
      navigate("/");
    }
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Create/Update Book Record</h3>
      <form
        onSubmit={onSubmit}
        className="border rounded-lg overflow-hidden p-4"
        style={{ backgroundColor: "hsl(0 0% 10.6%)" }}
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12 md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold leading-7 text-white">
              Book Info
            </h2>
            <p className="mt-1 text-sm leading-6 text-white">
              This information will be displayed publicly, so be careful what
              you share.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 ">
            <div className="sm:col-span-4">
              <label
                htmlFor="book_ISBN"
                className="block text-sm font-medium leading-6 text-white"
              >
                ISBN
              </label>
              <input
                type="text"
                name="book_ISBN"
                id="book_ISBN"
                className="mt-2 p-2 block w-full bg-gray-800 border border-gray-700 rounded-md"
                value={form.book_ISBN}
                onChange={(e) => updateForm({ book_ISBN: e.target.value })}
              />
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium leading-6 text-white"
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className="mt-2 p-2 block w-full bg-gray-800 border border-gray-700 rounded-md"
                value={form.title}
                onChange={(e) => updateForm({ title: e.target.value })}
              />
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="price"
                className="block text-sm font-medium leading-6 text-white"
              >
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                id="price"
                className="mt-2 p-2 block w-full bg-gray-800 border border-gray-700 rounded-md"
                value={form.price}
                min={0}
                step={1}
                onChange={(e) => {
                  const value = Math.max(1, e.target.value);
                  updateForm({ price: value });
                }}
              />
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="genre_name"
                className="block text-sm font-medium leading-6 text-white"
              >
                Genre
              </label>
              <select
                name="genre_name"
                id="genre_name"
                className="mt-2 p-2 block w-full bg-gray-800 border border-gray-700 rounded-md"
                value={form.genre_name}
                onChange={(e) => updateForm({ genre_name: e.target.value })}
              >
                <option value="">Select Genre</option>
                {genres.map((genre) => (
                  <option key={genre._id} value={genre.name}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="condition"
                className="block text-sm font-medium leading-6 text-white"
              >
                Condition
              </label>
              <input
                type="text"
                name="condition"
                id="condition"
                className="mt-2 p-2 block w-full bg-gray-800 border border-gray-700 rounded-md"
                value={form.condition}
                onChange={(e) => updateForm({ condition: e.target.value })}
              />
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="author_name"
                className="block text-sm font-medium leading-6 text-white"
              >
                Author ID
              </label>
              <select
                name="author_name"
                id="author_name"
                className="mt-2 p-2 block w-full bg-gray-800 border border-gray-700 rounded-md"
                value={form.author_name}
                onChange={(e) => updateForm({ author_name: e.target.value })}
              >
                <option value="">Select Author</option>
                {authors.map((author) => (
                  <option key={author._id} value={author._id}>
                    {`${author._id}: ${author.name}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="user_name"
                className="block text-sm font-medium leading-6 text-white"
              >
                Seller Name
              </label>
              <select
                name="user_name"
                id="user_name"
                className="mt-2 p-2 block w-full bg-gray-800 border border-gray-700 rounded-md"
                value={form.user_name}
                onChange={(e) => updateForm({ user_name: e.target.value })}
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user._id} value={user.name}>
                    {`${user._id}: ${user.name}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="rating"
                className="block text-sm font-medium leading-6 text-white"
              >
                Seller Rating
              </label>
              <input
                type="number"
                name="rating"
                id="rating"
                className="mt-2 p-2 block w-full bg-gray-800 border border-gray-700 rounded-md"
                value={form.rating}
                min={1}
                max={10}
                step={1}
                onChange={(e) => {
                  const value = Math.max(1, Math.min(10, e.target.value));
                  updateForm({ rating: value });
                }}
              />
            </div>
          </div>
        </div>
        <input
          type="submit"
          value="Save Book Record"
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-zinc-00 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4"
        />
      </form>
    </>
  );
}
