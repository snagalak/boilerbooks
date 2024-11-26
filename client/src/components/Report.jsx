import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReportList from "./ReportList";

export default function BookReport() {
  const [form, setForm] = useState({
    author_name: "",
  });
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [users, setUsers] = useState([]);
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();
  const [booksByAuthor, setBooksByAuthor] = useState([]);
  const [avgprice, setAvgprice] = useState();
  const [genre, setGenre] = useState();
  const [avgrating, setAvgrating] = useState();
  const [hasAuthor, setHasAuthor] = useState(false);

  useEffect(() => {
    // Fetch genres from the API
    async function fetchGenres() {
      try {
        const response = await fetch("https://boilerbooksbackend.vercel.app/record/genres");
        if (!response.ok) {
          throw new Error(`Error fetching genres: ${response.statusText}`);
        }
        const data = await response.json();
        setGenres(data.genres || data); // Handle different possible structures
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    }

    async function fetchAuthors() {
      try {
        const response = await fetch("https://boilerbooksbackend.vercel.app/record/authors");
        if (!response.ok) {
          throw new Error(`Error fetching authors: ${response.statusText}`);
        }
        const data = await response.json();
        setAuthors(data.authors || data); // Handle different possible structures
      } catch (error) {
        console.error("Failed to fetch authors:", error);
      }
    }

    async function fetchUsers() {
      try {
        const response = await fetch("https://boilerbooksbackend.vercel.app/record/users");
        if (!response.ok) {
          throw new Error(`Error fetching users: ${response.statusText}`);
        }
        const data = await response.json();
        setUsers(data.users || data); // Handle different possible structures
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    }

    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if (!id) return;
      setIsNew(false);
      const response = await fetch(
        `https://boilerbooksbackend.vercel.app/record/${params.id.toString()}`
      );
      if (!response.ok) {
        console.error(`An error has occurred: ${response.statusText}`);
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
    fetchUsers();
    fetchData();

    return;
  }, [params.id, navigate]);

  // Update form state
  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setBooksByAuthor([]);
    setAvgprice([]);
    setGenre([]);
    setAvgrating([]);
    setHasAuthor(false);

    try {
      // Construct query parameters dynamically
      const params = new URLSearchParams();
      if (form.author_name) {
        params.append("author_id", form.author_name);
        setHasAuthor(true);
      }
      if (form.genre_name) {
        params.append("genre_name", form.genre_name);
      }

      const requests = [
        fetch(`https://boilerbooksbackend.vercel.app/record/check?${params.toString()}`),
      ];

      let includeAdditionalData = false;

      if (params.has("author_id")) {
        includeAdditionalData = true;
        requests.push(
          fetch(`https://boilerbooksbackend.vercel.app/record/avgprice?${params.toString()}`),
          fetch(
            `https://boilerbooksbackend.vercel.app/record/commongenre?${params.toString()}`
          ),
          fetch(`https://boilerbooksbackend.vercel.app/record/rating?${params.toString()}`)
        );
      }

      const responses = await Promise.all(requests);
      const [response] = responses;
      const books = await response.json();
      setBooksByAuthor(books);
      if (includeAdditionalData) {
        const [avg, common, rating] = responses.slice(1);
        const avgPrice = await avg.json();
        const commonGenre = await common.json();
        const avgRating = await rating.json();

        setAvgprice(avgPrice);
        setGenre(commonGenre);
        setAvgrating(avgRating);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setForm({
      author_name: "",
      genre_name: "",
    });
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
              Statistic Report
            </h2>
            <p className="mt-1 text-sm leading-6 text-white">
              This information will be displayed publicly, so be careful what
              you share.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8">
            <div className="sm:col-span-4">
              <label
                htmlFor="author_name"
                className="block text-sm font-medium leading-6 text-white"
              >
                Author Name
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
          </div>
        </div>
        <input
          type="submit"
          value="Search"
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-zinc-00 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4"
        />
      </form>
      {booksByAuthor.length > 0 && (
        <>
          <ReportList books={booksByAuthor} />
          <div className="mt-4">
            {hasAuthor && (
              <>
                <h3 className="text-lg font-semibold text-white">Statistics</h3>
                <p className="text-white">
                  {avgprice?.avgPrice
                    ? `The average price of books by the author: $${avgprice.avgPrice.toFixed(
                        2
                      )}`
                    : "No price information available."}
                </p>
                <p className="text-white">
                  {genre?.mostCommonGenres?.length > 0
                    ? `The most common genre(s) for this author: ${genre.mostCommonGenres.join(
                        ", "
                      )}`
                    : "No genre information available."}
                </p>
                <p className="text-white">
                  {avgrating?.avgRating
                    ? `The average rating of books by the author: ${avgrating.avgRating.toFixed(
                        2
                      )}`
                    : "No rating information available."}
                </p>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
